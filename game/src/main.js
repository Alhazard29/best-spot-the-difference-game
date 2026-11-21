// SPOTLIGHT — spot the difference. Controller: state, rendering,
// input, timer, scoring, overlays and the URL-parameter staging mode
// the screenshot recipe uses (?shot=play|reef|title|win).
import { SCENES, modsForAll } from './scenes.js';
import {
  playClick, playFind, playWrong, playHint, playWin, playFail,
  isMuted, setMuted,
} from './audio.js';
import { pointsForFind, timeBonus, starsFor, loadBest, saveBest } from './levels.js';

const PANEL = 600;
const LEFT = { x: 24, y: 88 };
const RIGHT = { x: 656, y: 88 };
const HINT_SECONDS = 2.5;
const WRONG_PENALTY = 3;
const HINT_COST = 5;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const el = (id) => document.getElementById(id);
const hudLevel = el('hud-level');
const hudScene = el('hud-scene');
const hudDots = el('hud-dots');
const hudCounter = el('hud-counter');
const hudTimer = el('hud-timer');
const hudTimerFill = el('hud-timerfill');
const hudScore = el('hud-score');
const btnHint = el('btn-hint');
const btnSound = el('btn-sound');
const btnPause = el('btn-pause');
const toastEl = el('toast');

const state = {
  screen: 'title', // title | play | pause | win | fail | final
  levelIdx: 0,
  found: new Set(),
  mistakes: 0,
  streak: 0,
  score: 0,
  levelScore: 0,
  timeLeft: 90,
  hintsLeft: 3,
  paused: false,
  frozen: false, // staging mode: clock stopped, markers settled
  hintDiff: -1,
  hintUntil: 0,
  sparkles: [],
  wrongMarks: [],
  shakeUntil: 0,
  lastTick: 0,
  dotsKey: '',
};

function scene() {
  return SCENES[state.levelIdx];
}

function fmtTime(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

function showScreen(name) {
  state.screen = name;
  document.querySelectorAll('.screen').forEach((s) => s.classList.add('hidden'));
  if (name !== 'play') {
    const target = el('screen-' + name);
    if (target) target.classList.remove('hidden');
  }
}

let toastTimer = 0;
function showToast(text) {
  if (state.frozen) return;
  toastEl.textContent = text;
  toastEl.classList.remove('hidden');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.add('hidden'), 2200);
}

function updateHud() {
  const sc = scene();
  hudLevel.textContent = 'Level ' + (state.levelIdx + 1);
  hudScene.textContent = sc.name;
  hudCounter.textContent =
    state.found.size + ' / ' + sc.differences.length + ' found · ' +
    (sc.differences.length - state.found.size) + ' to go';
  hudTimer.textContent = fmtTime(state.timeLeft);
  hudTimer.classList.toggle('low', state.timeLeft <= 10);
  const frac = Math.max(0, state.timeLeft / sc.timeLimit);
  hudTimerFill.style.width = Math.round(frac * 100) + '%';
  hudTimerFill.classList.toggle('low', state.timeLeft <= 10);
  hudScore.textContent = String(state.score);
  btnHint.textContent = 'Hint (' + state.hintsLeft + ')';
  btnHint.disabled = state.hintsLeft <= 0 || state.screen !== 'play';
  btnSound.textContent = isMuted() ? 'Sound: Off' : 'Sound: On';
  // found dots (rebuild only when the level or found set changes)
  const dotsKey = state.levelIdx + ':' + [...state.found].sort((a, b) => a - b).join(',');
  if (dotsKey !== state.dotsKey) {
    state.dotsKey = dotsKey;
    hudDots.innerHTML = '';
    sc.differences.forEach((d, i) => {
      const dot = document.createElement('span');
      dot.className = 'dot' + (state.found.has(i) ? ' found' : '');
      dot.title = d.label;
      hudDots.appendChild(dot);
    });
  }
}

function starRow(n) {
  let out = '';
  for (let i = 0; i < 3; i++) {
    out += i < n
      ? '<span>★</span>'
      : '<span class="dim">★</span>';
  }
  return out;
}

function buildTitleCards() {
  const best = loadBest();
  const wrap = el('level-cards');
  wrap.innerHTML = '';
  SCENES.forEach((sc, i) => {
    const card = document.createElement('div');
    card.className = 'level-card';
    const b = best[i] || { stars: 0, score: 0 };
    card.innerHTML =
      '<div class="lc-name">' + sc.name + '</div>' +
      '<div class="lc-meta">' + sc.differences.length + ' differences · ' +
      sc.timeLimit + 's</div>' +
      '<div class="lc-stars">' + '★'.repeat(b.stars) + '</div>';
    card.addEventListener('click', () => {
      playClick();
      startLevel(i);
    });
    wrap.appendChild(card);
  });
}

function startLevel(idx) {
  const sc = SCENES[idx];
  state.levelIdx = idx;
  state.found = new Set();
  state.mistakes = 0;
  state.streak = 0;
  state.levelScore = 0;
  state.timeLeft = sc.timeLimit;
  state.hintsLeft = 3;
  state.paused = false;
  state.hintDiff = -1;
  state.sparkles = [];
  state.wrongMarks = [];
  showScreen('play');
  updateHud();
  showToast(sc.name + ' — find ' + sc.differences.length + ' differences!');
}

function startLevelFromTitle() {
  buildTitleCards();
  startLevel(0);
}

function drawPanel(panel, mods) {
  ctx.save();
  ctx.translate(panel.x, panel.y);
  scene().draw(ctx, mods);
  ctx.restore();
}

function drawRingAt(panel, diff, gold) {
  const cx = panel.x + diff.x;
  const cy = panel.y + diff.y;
  ctx.save();
  ctx.lineWidth = 5;
  ctx.strokeStyle = gold ? '#ffd94d' : '#37c8e8';
  ctx.setLineDash(gold ? [] : [10, 7]);
  ctx.beginPath();
  ctx.arc(cx, cy, diff.r + 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawSparkles(now) {
  state.sparkles = state.sparkles.filter((s) => now - s.born < 650);
  state.sparkles.forEach((s) => {
    const age = (now - s.born) / 650;
    const alpha = 1 - age;
    const size = 4 + age * 10;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffe9a8';
    ctx.beginPath();
    ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawWrongMarks(now) {
  state.wrongMarks = state.wrongMarks.filter((m) => now - m.born < 700);
  state.wrongMarks.forEach((m) => {
    const age = (now - m.born) / 700;
    ctx.save();
    ctx.globalAlpha = 1 - age;
    ctx.strokeStyle = '#ff5a4a';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(m.x - 10, m.y - 10);
    ctx.lineTo(m.x + 10, m.y + 10);
    ctx.moveTo(m.x + 10, m.y - 10);
    ctx.lineTo(m.x - 10, m.y + 10);
    ctx.stroke();
    ctx.restore();
  });
}

function render(now) {
  ctx.clearRect(0, 0, 1280, 720);
  // panel frames
  ctx.fillStyle = '#1a2233';
  ctx.fillRect(LEFT.x - 6, LEFT.y - 6, PANEL + 12, PANEL + 12);
  ctx.fillRect(RIGHT.x - 6, RIGHT.y - 6, PANEL + 12, PANEL + 12);
  // shake on a wrong click
  let ox = 0;
  let oy = 0;
  if (now < state.shakeUntil) {
    ox = (Math.random() - 0.5) * 10;
    oy = (Math.random() - 0.5) * 10;
  }
  ctx.save();
  ctx.translate(ox, oy);
  drawPanel(LEFT, {});
  drawPanel(RIGHT, modsForAll(scene()));
  // found rings on both panels
  state.found.forEach((i) => {
    const d = scene().differences[i];
    drawRingAt(LEFT, d, true);
    drawRingAt(RIGHT, d, true);
  });
  // hint ring on both panels
  if (state.hintDiff >= 0 && now < state.hintUntil) {
    const d = scene().differences[state.hintDiff];
    drawRingAt(LEFT, d, false);
    drawRingAt(RIGHT, d, false);
  }
  drawSparkles(now);
  drawWrongMarks(now);
  ctx.restore();
}

function loop(now) {
  if (state.screen === 'play' && !state.paused && !state.frozen) {
    const dt = state.lastTick ? (now - state.lastTick) / 1000 : 0;
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      updateHud();
      failLevel();
    } else {
      updateHud();
    }
  }
  state.lastTick = now;
  render(now);
  window.requestAnimationFrame(loop);
}

function addSparkles(diff) {
  const now = performance.now();
  [LEFT, RIGHT].forEach((p) => {
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6;
      state.sparkles.push({
        x: p.x + diff.x + Math.cos(a) * (diff.r + 4),
        y: p.y + diff.y + Math.sin(a) * (diff.r + 4),
        born: now,
      });
    }
  });
}

function panelAt(x, y) {
  if (x >= LEFT.x && x < LEFT.x + PANEL && y >= LEFT.y && y < LEFT.y + PANEL) return LEFT;
  if (x >= RIGHT.x && x < RIGHT.x + PANEL && y >= RIGHT.y && y < RIGHT.y + PANEL) return RIGHT;
  return null;
}

function nearestDiff(sx, sy) {
  let best = -1;
  let bestDist = Infinity;
  scene().differences.forEach((d, i) => {
    if (state.found.has(i)) return;
    const dx = sx - d.x;
    const dy = sy - d.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= d.r + 8 && dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  return best;
}

function onCanvasClick(e) {
  if (state.screen !== 'play' || state.paused) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const panel = panelAt(x, y);
  if (!panel) return;
  const sx = x - panel.x;
  const sy = y - panel.y;
  const idx = nearestDiff(sx, sy);
  if (idx >= 0) {
    const d = scene().differences[idx];
    state.found.add(idx);
    const gained = pointsForFind(state.streak);
    state.streak += 1;
    state.score += gained;
    state.levelScore += gained;
    addSparkles(d);
    playFind();
    showToast('Found ' + d.label + '! +' + gained);
    updateHud();
    if (state.found.size === scene().differences.length) winLevel();
  } else {
    state.mistakes += 1;
    state.streak = 0;
    state.timeLeft = Math.max(0, state.timeLeft - WRONG_PENALTY);
    state.wrongMarks.push({ x, y, born: performance.now() });
    state.shakeUntil = performance.now() + 350;
    playWrong();
    showToast('Not there! −' + WRONG_PENALTY + 's');
    updateHud();
    if (state.timeLeft <= 0) failLevel();
  }
}

function useHint() {
  if (state.screen !== 'play' || state.paused) return;
  if (state.hintsLeft <= 0) return;
  const remaining = scene().differences
    .map((d, i) => i)
    .filter((i) => !state.found.has(i));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintDiff = pick;
  state.hintUntil = performance.now() + HINT_SECONDS * 1000;
  state.hintsLeft -= 1;
  state.timeLeft = Math.max(0, state.timeLeft - HINT_COST);
  playHint();
  showToast('Hint: look near ' + scene().differences[pick].label + ' (−' + HINT_COST + 's)');
  updateHud();
  if (state.timeLeft <= 0) failLevel();
}

function winLevel() {
  const sc = scene();
  const findsOnly = state.levelScore;
  const bonus = timeBonus(state.timeLeft);
  state.score += bonus;
  state.levelScore += bonus;
  const stars = starsFor(state.mistakes, state.timeLeft, sc.timeLimit);
  saveBest(state.levelIdx, stars, state.levelScore);
  playWin();
  el('win-title').textContent = sc.name + ' complete!';
  el('win-stars').innerHTML = starRow(stars);
  el('win-breakdown').textContent =
    'Finds ' + findsOnly + ' · time bonus +' + bonus +
    ' · ' + state.mistakes + ' mistake' + (state.mistakes === 1 ? '' : 's') +
    ' · total score ' + state.score;
  el('btn-next').textContent =
    state.levelIdx + 1 < SCENES.length ? 'Next level' : 'See results';
  showScreen('win');
  updateHud();
}

function failLevel() {
  const sc = scene();
  playFail();
  el('fail-text').textContent =
    'You found ' + state.found.size + ' of ' + sc.differences.length +
    ' differences in ' + sc.name + '. Give it another go!';
  showScreen('fail');
  updateHud();
}

function showFinal() {
  const best = loadBest();
  let stars = 0;
  let total = 0;
  SCENES.forEach((sc, i) => {
    stars += (best[i] || { stars: 0 }).stars;
    total += (best[i] || { score: 0 }).score;
  });
  el('final-stars').innerHTML = starRow(Math.round(stars / SCENES.length));
  el('final-score').textContent =
    'You earned ' + stars + ' of ' + SCENES.length * 3 + ' stars · best total ' + total + ' points';
  showScreen('final');
}

function togglePause() {
  if (state.screen === 'play') {
    state.paused = true;
    showScreen('pause');
  } else if (state.screen === 'pause') {
    state.paused = false;
    showScreen('play');
  }
}

function toggleMute() {
  setMuted(!isMuted());
  playClick();
  updateHud();
}

// ---------- staging mode (screenshot recipe) ----------
function applyStaging() {
  const q = new URLSearchParams(window.location.search);
  const shot = q.get('shot');
  if (!shot) return;
  state.frozen = true;
  const level = Math.min(SCENES.length - 1, Math.max(0, parseInt(q.get('level') || '0', 10)));
  const time = parseFloat(q.get('time') || '0');
  const foundList = (q.get('found') || '')
    .split(',')
    .filter((s) => s !== '')
    .map((s) => parseInt(s, 10))
    .filter((n) => !Number.isNaN(n));
  const hintIdx = parseInt(q.get('hint') || '-1', 10);
  state.levelIdx = level;
  state.found = new Set(foundList);
  state.mistakes = 0;
  state.timeLeft = time || SCENES[level].timeLimit;
  state.hintsLeft = 3;
  // score the staged finds as if found in order
  state.streak = foundList.length;
  state.score = foundList.reduce((sum, _v, k) => sum + pointsForFind(k), 0);
  state.levelScore = state.score;
  if (hintIdx >= 0) {
    state.hintDiff = hintIdx;
    state.hintUntil = performance.now() + 60 * 60 * 1000;
  }
  if (shot === 'title') {
    buildTitleCards();
    showScreen('title');
  } else if (shot === 'win') {
    state.found = new Set(SCENES[level].differences.map((d, i) => i));
    state.streak = SCENES[level].differences.length;
    const base = SCENES[level].differences.reduce(
      (sum, _d, k) => sum + pointsForFind(k), 0);
    const bonus = timeBonus(state.timeLeft);
    state.score = base + bonus;
    state.levelScore = state.score;
    const stars = starsFor(0, state.timeLeft, SCENES[level].timeLimit);
    el('win-title').textContent = SCENES[level].name + ' complete!';
    el('win-stars').innerHTML = starRow(stars);
    el('win-breakdown').textContent =
      'Finds ' + base + ' · time bonus +' + bonus +
      ' · 0 mistakes · total score ' + state.score;
    el('btn-next').textContent = 'Next level';
    showScreen('win');
  } else {
    // play / reef: mid-play staged shot
    showScreen('play');
  }
  updateHud();
}

// ---------- wiring ----------
canvas.addEventListener('click', onCanvasClick);
btnHint.addEventListener('click', useHint);
btnSound.addEventListener('click', toggleMute);
btnPause.addEventListener('click', togglePause);
el('btn-play').addEventListener('click', () => { playClick(); startLevelFromTitle(); });
el('btn-resume').addEventListener('click', () => { playClick(); togglePause(); });
el('btn-quit-pause').addEventListener('click', () => {
  playClick();
  state.paused = false;
  buildTitleCards();
  showScreen('title');
  updateHud();
});
el('btn-next').addEventListener('click', () => {
  playClick();
  if (state.levelIdx + 1 < SCENES.length) startLevel(state.levelIdx + 1);
  else showFinal();
});
el('btn-replay-win').addEventListener('click', () => { playClick(); startLevel(state.levelIdx); });
el('btn-retry').addEventListener('click', () => { playClick(); startLevel(state.levelIdx); });
el('btn-quit-fail').addEventListener('click', () => {
  playClick();
  buildTitleCards();
  showScreen('title');
  updateHud();
});
el('btn-again').addEventListener('click', () => { playClick(); startLevel(0); });

window.addEventListener('keydown', (e) => {
  if (e.key === 'h' || e.key === 'H') useHint();
  else if (e.key === 'm' || e.key === 'M') toggleMute();
  else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') togglePause();
  else if (e.key === 'Enter') {
    if (state.screen === 'title') startLevelFromTitle();
    else if (state.screen === 'win') el('btn-next').click();
    else if (state.screen === 'fail') el('btn-retry').click();
    else if (state.screen === 'final') startLevel(0);
  }
});

// ---------- init ----------
buildTitleCards();
applyStaging();
if (!state.frozen) showScreen('title');
updateHud();
window.requestAnimationFrame(loop);
