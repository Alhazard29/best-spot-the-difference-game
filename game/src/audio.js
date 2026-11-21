// SPOTLIGHT — tiny synth sounds, no audio files.
// Everything is an oscillator through one AudioContext, created lazily on
// the first user gesture (browsers block audio before that). Mute is a
// plain flag; nothing is fetched, nothing is stored.

let ctx = null;
let muted = false;

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, at, dur, type, vol, slideTo = null) {
  const c = ac();
  if (!c || muted) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime + at);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + at + dur);
  g.gain.setValueAtTime(0.0001, c.currentTime + at);
  g.gain.exponentialRampToValueAtTime(vol, c.currentTime + at + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + at + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start(c.currentTime + at);
  o.stop(c.currentTime + at + dur + 0.05);
}

export const sfx = {
  unlock() { ac(); },
  click() { tone(660, 0, 0.06, 'sine', 0.08); },
  found(streak = 0) {
    const base = 523 + Math.min(streak, 8) * 24;
    tone(base, 0, 0.12, 'sine', 0.16);
    tone(base * 1.5, 0.07, 0.16, 'sine', 0.16);
    tone(base * 2, 0.14, 0.2, 'triangle', 0.1);
  },
  wrong() { tone(160, 0, 0.18, 'sawtooth', 0.1, 110); },
  hint() { tone(880, 0, 0.1, 'sine', 0.1); tone(1174, 0.09, 0.14, 'sine', 0.1); },
  tick() { tone(980, 0, 0.05, 'square', 0.05); },
  win() {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.22, 'triangle', 0.14));
    tone(1318, 0.48, 0.4, 'triangle', 0.12);
  },
  lose() {
    [392, 330, 262].forEach((f, i) => tone(f, i * 0.16, 0.24, 'triangle', 0.12));
  },
};

export function isMuted() { return muted; }
export function toggleMute() { muted = !muted; return muted; }
