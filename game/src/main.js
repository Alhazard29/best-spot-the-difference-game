// SPOTLIGHT — boot, loop, input and screens.
// One canvas (1280 x 720) holds the two panels; the HUD and the screens
// are DOM on top of it. The game state machine is: title -> play ->
// levelComplete / levelFailed -> (next level | gameComplete). Staging
// (?shot=...) renders one frozen moment of the real game for screenshots.

import { SCENES } from './scenes.js';
import { disc, ring, star } from './art.js';
import { sfx, isMuted, toggleMute } from './audio.js';
import {
  getBest, totalDiffs, starsFor, findPoints, timeBonus, recordLevelResult, totalStars,
} from './levels.js';

const W = 1280;
const H = 720;
const PANEL = 600;
const PANELS = [{ x: 24, y: 88 }, { x: 656, y: 88 }];
const WRONG_PENALTY_S = 3;
const HINT_COST_S = 5;
const HINTS_PER_LEVEL = 3;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const state = {
  screen: 'title',
  sceneIndex: 0,
  found: new Set(),
  foundOrder: [],
  mistakes: 0,
  streak: 0,
  bestStreak: 0,
  levelScore: 0,
  totalScore: 0,
  timeLeft: 90,
  hintsLeft: HINTS_PER_LEVEL,
  hint: null, // { diff, until }
  pops: [], // { diff, at } ring pop animations
  sparks: [], // { x, y, panel, at } sparkle bursts
  wrongs: [], // { x, y, panel, at } red X flashes
  shakeUntil: 0,
  frozen: false,
  frozenNow: 0,
  startedAt: 0,
  lastWholeSecond: -1,
  levelStartScore: 0,
};

function scene() { return SCENES[state.sceneIndex]; }
function nowMs() { return state.frozen ? state.frozenNow : performance.now(); }
function elapsed() { return (nowMs() - state.startedAt) / 1000; }

function allMods() {
  const mods = {};
  for (const d of scene().diffs) mods[d.id] = true;
  return mods;
}

// ---------- HUD ----------
const el = {
  levelBadge: document.getElementById('hud-level'),
  sceneName: document.getElementById('hud-scene'),
  dots: document.getElementById('hud-dots'),
  counter: document.getElementById('hud-counter'),
  timerText: document.getElementById('hud-timer'),
  timerBar: document.getElementById('hud-timerbar'),
  score: document.getElementById('hud-score'),
  hintBtn: document.getElementById('btn-hint'),
  muteBtn: document.getElementById('btn-mute'),
  pauseBtn: document.getElementById('btn-pause'),
  toast: document.getElementById('toast'),
};

let toastTimer = 0;
function toast(text) {
  el.toast.textContent = text;
  el.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove('show'), 2200);
}

function renderHud() {
  const s = scene();
  el.levelBadge.textContent = `LEVEL ${state.sceneIndex + 1}/${SCENES.length}`;
  el.sceneName.textContent = s.name;
  const remaining = s.diffs.length - state.found.size;
  el.counter.textContent = `${state.found.size} / ${s.diffs.length} found · ${remaining} to go`;
  el.dots.innerHTML = '';
  for (const d of s.diffs) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (state.found.has(d.id) ? ' found' : '');
    el.dots.appendChild(dot);
  }
  el.score.textContent = `Score ${state.totalScore + state.levelScore}`;
  el.hintBtn.textContent = `Hint (${state.hintsLeft})`;
  el.hintBtn.disabled = state.hintsLeft <= 0 || state.screen !== 'play';
  el.muteBtn.textContent = isMuted() ? 'Sound: Off' : 'Sound: On';
}

function renderTimer() {
  const s = scene();
  const t = Math.max(0, state.timeLeft);
  const mm = Math.floor(t / 60);
  const ss = Math.floor(t % 60).toString().padStart(2, '0');
  el.timerText.textContent = `${mm}:${ss}`;
  el.timerBar.style.width = `${(t / s.timeLimit) * 100}%`;
  el.timerBar.classList.toggle('urgent', t <= 10);
  el.timerText.classList.toggle('urgent', t <= 10);
}

// ---------- Screens ----------
const screens = {
  title: document.getElementById('screen-title'),
  pause: document.getElementById('screen-pause'),
  complete: document.getElementById('screen-complete'),
  failed: document.getElementById('screen-failed'),
  final: document.getElementById('screen-final'),
};

function showScreen(name) {
  state.screen = name;
  for (const [key, node] of Object.entries(screens)) {
    node.classList.toggle('hidden', key !== name);
  }
  document.getElementById('hud').classList.toggle('hidden', name === 'title');
  renderHud();
}

function buildLevelCards() {
  const wrap = document.getElementById('level-cards');
  wrap.innerHTML = '';
  const best = getBest();
  SCENES.forEach((s, i) => {
    const b = best[s.id] || { stars: 0, score: 0 };
    const card = document.createElement('button');
    card.className = 'level-card';
    card.innerHTML = `<b>${i + 1}. ${s.name}</b><span>${s.tagline}</span>` +
      `<span class="stars">${'★'.repeat(b.stars)}${'☆'.repeat(3 - b.stars)}</span>` +
      `<span class="meta">${s.diffs.length} differences · ${s.timeLimit}s${b.score ? ` · best ${b.score}` : ''}</span>`;
    card.addEventListener('click', () => { sfx.unlock(); startLevel(i); });
    wrap.appendChild(card);
  });
  document.getElementById('total-diffs').textContent =
    `${SCENES.length} scenes · ${totalDiffs()} differences to find`;
}

// ---------- Level flow ----------
function startLevel(i) {
  state.sceneIndex = i;
  state.found = new Set();
  state.foundOrder = [];
  state.mistakes = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.levelScore = 0;
  state.levelStartScore = state.totalScore;
  state.timeLeft = scene().timeLimit;
  state.hintsLeft = HINTS_PER_LEVEL;
  state.hint = null;
  state.pops = [];
  state.sparks = [];
  state.wrongs = [];
  state.startedAt = nowMs();
  state.lastWholeSecond = -1;
  showScreen('play');
  renderTimer();
  if (!state.frozen) toast(`${scene().name} — find ${scene().diffs.length} differences!`);
}

function levelComplete() {
  const s = scene();
  const stars = starsFor(s, state.mistakes, state.timeLeft);
  const bonus = timeBonus(state.timeLeft);
  state.levelScore += bonus;
  const gained = recordLevelResult(state.sceneIndex, stars, state.levelScore);
  sfx.win();
  document.getElementById('complete-title').textContent = `${s.name} complete!`;
  document.getElementById('complete-stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
  document.getElementById('complete-lines').innerHTML =
    `<li>Finds: ${state.found.size} × 100 + streak bonuses — ${state.levelScore - bonus} pts</li>` +
    `<li>Time bonus: ${Math.round(state.timeLeft)}s left × 10 — ${bonus} pts</li>` +
    `<li>Mistakes: ${state.mistakes} · Best streak: ${state.bestStreak}</li>` +
    `<li>Level score: ${state.levelScore} · Best for this scene: ${gained.score}</li>`;
  document.getElementById('btn-next').textContent =
    state.sceneIndex + 1 < SCENES.length ? 'Next level →' : 'See final results →';
  showScreen('complete');
}

function levelFailed() {
  sfx.lose();
  document.getElementById('failed-title').textContent = `Out of time in ${scene().name}`;
  document.getElementById('failed-lines').textContent =
    `You found ${state.found.size} of ${scene().diffs.length} differences. The rest were hiding in plain sight — try again!`;
  showScreen('failed');
}

function gameComplete() {
  const stars = totalStars();
  document.getElementById('final-stars').textContent = '★'.repeat(stars) + '☆'.repeat(15 - stars);
  document.getElementById('final-lines').innerHTML =
    `<li>Total score: ${state.totalScore}</li>` +
    `<li>Stars: ${stars} / ${SCENES.length * 3}</li>` +
    `<li>All ${totalDiffs()} differences found across ${SCENES.length} scenes</li>`;
  showScreen('final');
}

function nextLevel() {
  if (state.sceneIndex + 1 < SCENES.length) {
    state.totalScore += state.levelScore;
    startLevel(state.sceneIndex + 1);
  } else {
    state.totalScore += state.levelScore;
    gameComplete();
  }
}

// ---------- Play actions ----------
function foundDiff(d, panel) {
  state.found.add(d.id);
  state.foundOrder.push(d.id);
  state.streak += 1;
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  const pts = findPoints(state.streak - 1);
  state.levelScore += pts;
  const t = nowMs();
  state.pops.push({ diff: d, at: t });
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.4;
    state.sparks.push({
      x: d.x + Math.cos(a) * (d.r + 14), y: d.y + Math.sin(a) * (d.r + 14),
      panel, at: t, delay: i * 40,
    });
  }
  sfx.found(state.streak);
  toast(`Found ${d.label}! +${pts}${state.streak > 1 ? ` (streak ×${state.streak})` : ''}`);
  renderHud();
  if (state.found.size === scene().diffs.length) levelComplete();
}

function wrongClick(x, y, panel) {
  state.mistakes += 1;
  state.streak = 0;
  state.timeLeft = Math.max(0, state.timeLeft - WRONG_PENALTY_S);
  state.wrongs.push({ x, y, panel, at: nowMs() });
  state.shakeUntil = nowMs() + 180;
  sfx.wrong();
  toast(`Not a difference — −${WRONG_PENALTY_S}s`);
  renderHud();
  renderTimer();
  if (state.timeLeft <= 0) levelFailed();
}

function useHint() {
  if (state.screen !== 'play' || state.hintsLeft <= 0) return;
  const remaining = scene().diffs.filter((d) => !state.found.has(d.id));
  if (!remaining.length) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.timeLeft = Math.max(0, state.timeLeft - HINT_COST_S);
  state.hint = { diff: pick, until: nowMs() + 2500 };
  sfx.hint();
  toast(`Hint: look near “${pick.label}” — −${HINT_COST_S}s`);
  renderHud();
  renderTimer();
  if (state.timeLeft <= 0) levelFailed();
}

canvas.addEventListener('click', (ev) => {
  if (state.screen !== 'play') return;
  const rect = canvas.getBoundingClientRect();
  const x = ((ev.clientX - rect.left) / rect.width) * W;
  const y = ((ev.clientY - rect.top) / rect.height) * H;
  let panel = -1;
  let sx = 0;
  for (let i = 0; i < PANELS.length; i++) {
    const p = PANELS[i];
    if (x >= p.x && x <= p.x + PANEL && y >= p.y && y <= p.y + PANEL) {
      panel = i;
      sx = x - p.x;
      break;
    }
  }
  if (panel < 0) return;
  const sy = y - PANELS[panel].y;
  sfx.unlock();
  for (const d of scene().diffs) {
    if (state.found.has(d.id)) continue;
    const dist = Math.hypot(sx - d.x, sy - d.y);
    if (dist <= d.r + 8) {
      foundDiff(d, panel);
      return;
    }
  }
  wrongClick(sx, sy, panel);
});

// ---------- Rendering ----------
function drawPanel(i) {
  const p = PANELS[i];
  const mods = i === 0 ? {} : allMods();
  ctx.save();
  if (nowMs() < state.shakeUntil) {
    ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
  }
  ctx.translate(p.x, p.y);
  ctx.save();
  ctx.shadowColor = 'rgba(16,24,40,0.35)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#fffdf5';
  ctx.fillRect(0, 0, PANEL, PANEL);
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, PANEL, PANEL);
  ctx.clip();
  scene().draw(ctx, mods);
  // Found markers on both panels.
  for (const id of state.foundOrder) {
    const d = scene().diffs.find((v) => v.id === id);
    const pop = state.pops.find((v) => v.diff.id === id);
    const age = pop ? (nowMs() - pop.at) / 250 : 1;
    const scale = age >= 1 ? 1 : 0.5 + 0.5 * age;
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.scale(scale, scale);
    ring(ctx, 0, 0, d.r + 10, '#ffb703', 6);
    ring(ctx, 0, 0, d.r + 16, 'rgba(255,183,3,0.45)', 3);
    star(ctx, 0, -d.r - 8, 9, 4, 4, '#ffb703');
    ctx.restore();
  }
  // Hint ring, pulsing, on both panels.
  if (state.hint && nowMs() < state.hint.until) {
    const d = state.hint.diff;
    const pulse = 1 + 0.12 * Math.sin(nowMs() / 130);
    ctx.save();
    ctx.setLineDash([10, 8]);
    ring(ctx, d.x, d.y, (d.r + 12) * pulse, '#00b4d8', 4);
    ctx.restore();
  }
  // Sparkles.
  for (const s of state.sparks) {
    const age = (nowMs() - s.at - s.delay) / 700;
    if (age < 0 || age > 1) continue;
    ctx.globalAlpha = 1 - age;
    star(ctx, s.x, s.y, 7 * (1 - age * 0.5), 3, 4, '#ffd93b');
    ctx.globalAlpha = 1;
  }
  // Wrong-click X marks (only on the panel that was clicked).
  for (const w of state.wrongs) {
    if (w.panel !== i) continue;
    const age = (nowMs() - w.at) / 500;
    if (age > 1) continue;
    ctx.globalAlpha = 1 - age;
    ctx.strokeStyle = '#e63946';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(w.x - 12, w.y - 12); ctx.lineTo(w.x + 12, w.y + 12);
    ctx.moveTo(w.x + 12, w.y - 12); ctx.lineTo(w.x - 12, w.y + 12);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  // Panel chip.
  ctx.fillStyle = 'rgba(16,24,40,0.75)';
  ctx.beginPath();
  ctx.roundRect(10, 10, 92, 30, 15);
  ctx.fill();
  ctx.fillStyle = '#fffdf5';
  ctx.font = 'bold 16px "Trebuchet MS", Verdana, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(i === 0 ? 'PICTURE A' : 'PICTURE B', 56, 26);
  ctx.restore();
}

function drawPlay() {
  ctx.fillStyle = '#20304a';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#2c4266';
  ctx.fillRect(0, 72, W, 4);
  drawPanel(0);
  drawPanel(1);
}

function drawTitleBackdrop(t) {
  ctx.save();
  ctx.translate(0, 0);
  const drift = Math.sin(t / 9000) * 40;
  ctx.scale(2.25, 2.25);
  ctx.translate(-40 + drift, -30);
  SCENES[0].draw(ctx, {});
  ctx.restore();
  ctx.fillStyle = 'rgba(13,27,62,0.55)';
  ctx.fillRect(0, 0, W, H);
}

function frame(t) {
  // Timer.
  if (state.screen === 'play' && !state.frozen) {
    const dt = 1 / 60;
    state.timeLeft -= dt;
    const whole = Math.ceil(state.timeLeft);
    if (whole !== state.lastWholeSecond) {
      state.lastWholeSecond = whole;
      if (whole <= 10 && whole > 0) sfx.tick();
    }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      renderTimer();
      levelFailed();
    }
    renderTimer();
  }
  ctx.clearRect(0, 0, W, H);
  if (state.screen === 'title') {
    drawTitleBackdrop(t);
  } else {
    drawPlay();
  }
  // Prune finished effects.
  const cutoff = nowMs() - 1000;
  state.sparks = state.sparks.filter((s) => s.at + s.delay + 700 > cutoff);
  state.wrongs = state.wrongs.filter((w) => w.at + 500 > cutoff);
  requestAnimationFrame(frame);
}

// ---------- Buttons & keys ----------
document.getElementById('btn-play').addEventListener('click', () => {
  sfx.unlock();
  const best = getBest();
  const next = SCENES.findIndex((s) => !(best[s.id] || {}).stars);
  startLevel(next < 0 ? 0 : next);
});
document.getElementById('btn-resume').addEventListener('click', () => showScreen('play'));
document.getElementById('btn-restart').addEventListener('click', () => startLevel(state.sceneIndex));
document.getElementById('btn-quit').addEventListener('click', () => { buildLevelCards(); showScreen('title'); });
document.getElementById('btn-next').addEventListener('click', nextLevel);
document.getElementById('btn-replay').addEventListener('click', () => startLevel(state.sceneIndex));
document.getElementById('btn-menu').addEventListener('click', () => { buildLevelCards(); showScreen('title'); });
document.getElementById('btn-retry').addEventListener('click', () => startLevel(state.sceneIndex));
document.getElementById('btn-failed-menu').addEventListener('click', () => { buildLevelCards(); showScreen('title'); });
document.getElementById('btn-again').addEventListener('click', () => { state.totalScore = 0; startLevel(0); });
document.getElementById('btn-final-menu').addEventListener('click', () => { state.totalScore = 0; buildLevelCards(); showScreen('title'); });
el.hintBtn.addEventListener('click', useHint);
el.muteBtn.addEventListener('click', () => { toggleMute(); renderHud(); });
el.pauseBtn.addEventListener('click', () => { if (state.screen === 'play') showScreen('pause'); });

document.addEventListener('keydown', (ev) => {
  if (ev.key === 'h' || ev.key === 'H') useHint();
  else if (ev.key === 'm' || ev.key === 'M') { toggleMute(); renderHud(); }
  else if (ev.key === 'Escape' || ev.key === 'p' || ev.key === 'P') {
    if (state.screen === 'play') showScreen('pause');
    else if (state.screen === 'pause') showScreen('play');
  } else if (ev.key === 'Enter') {
    if (state.screen === 'title') document.getElementById('btn-play').click();
    else if (state.screen === 'complete') document.getElementById('btn-next').click();
    else if (state.screen === 'failed') document.getElementById('btn-retry').click();
  }
});

// ---------- Staging (?shot=...) for screenshots ----------
// Staged moments freeze the clock: markers sit settled, the timer holds,
// so a screenshot captures the same frame every time.
function stageFromQuery() {
  const q = new URLSearchParams(location.search);
  const shot = q.get('shot');
  if (!shot) return;
  state.frozen = true;
  state.frozenNow = 100000;
  if (shot === 'title' || shot === 'levels') {
    buildLevelCards();
    showScreen('title');
    return;
  }
  const level = Math.min(SCENES.length - 1, Math.max(0, parseInt(q.get('level') || '0', 10) || 0));
  startLevel(level);
  state.frozen = true;
  state.frozenNow = 100000;
  if (shot === 'win') {
    for (const d of scene().diffs) {
      state.found.add(d.id);
      state.foundOrder.push(d.id);
      state.pops.push({ diff: d, at: 90000 });
      state.levelScore += 100;
    }
    state.timeLeft = parseInt(q.get('time') || '45', 10);
    state.mistakes = 0;
    const stars = starsFor(scene(), 0, state.timeLeft);
    const bonus = timeBonus(state.timeLeft);
    state.levelScore += bonus;
    document.getElementById('complete-title').textContent = `${scene().name} complete!`;
    document.getElementById('complete-stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    document.getElementById('complete-lines').innerHTML =
      `<li>Finds: ${state.found.size} × 100 + streak bonuses</li>` +
      `<li>Time bonus: ${Math.round(state.timeLeft)}s left × 10 — ${bonus} pts</li>` +
      `<li>Level score: ${state.levelScore}</li>`;
    document.getElementById('btn-next').textContent = 'Next level →';
    showScreen('complete');
    renderTimer();
    return;
  }
  // play / reef: mid-play with some differences already found.
  const foundIdx = (q.get('found') || '').split(',').filter(Boolean).map((v) => parseInt(v, 10));
  for (const idx of foundIdx) {
    const d = scene().diffs[idx];
    if (!d) continue;
    state.found.add(d.id);
    state.foundOrder.push(d.id);
    state.pops.push({ diff: d, at: 90000 });
    state.levelScore += 100;
  }
  state.timeLeft = parseInt(q.get('time') || '72', 10);
  const hintIdx = q.get('hint');
  if (hintIdx !== null && hintIdx !== '') {
    const d = scene().diffs[parseInt(hintIdx, 10)];
    if (d) state.hint = { diff: d, until: 200000 };
  }
  renderHud();
  renderTimer();
}

// ---------- Init ----------
buildLevelCards();
stageFromQuery();
if (!state.frozen && state.screen === 'title') showScreen('title');
renderHud();
requestAnimationFrame(frame);
