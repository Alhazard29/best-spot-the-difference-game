// Tiny WebAudio synthesizer for SPOTLIGHT. No audio files: every sound
// is built from oscillators with a short gain envelope.
let audioCtx = null;
let master = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = !!value;
  if (master) master.gain.value = muted ? 0 : 0.5;
}

function ensureCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
    master = audioCtx.createGain();
    master.gain.value = muted ? 0 : 0.5;
    master.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, startAt, dur, type, vol) {
  const ctx = ensureCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  const t0 = ctx.currentTime + startAt;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol || 0.5, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export function playClick() {
  tone(660, 0, 0.07, 'triangle', 0.25);
}

export function playFind() {
  tone(880, 0, 0.14, 'sine', 0.55);
  tone(1318, 0.09, 0.2, 'sine', 0.5);
}

export function playWrong() {
  tone(160, 0, 0.22, 'sawtooth', 0.4);
  tone(110, 0.05, 0.22, 'sawtooth', 0.35);
}

export function playHint() {
  tone(1046, 0, 0.1, 'sine', 0.4);
  tone(1568, 0.07, 0.12, 'sine', 0.35);
}

export function playWin() {
  const notes = [523, 659, 784, 1046];
  notes.forEach((n, i) => tone(n, i * 0.11, 0.24, 'triangle', 0.5));
}

export function playFail() {
  const notes = [392, 330, 262, 196];
  notes.forEach((n, i) => tone(n, i * 0.14, 0.26, 'sine', 0.45));
}
