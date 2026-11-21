// SPOTLIGHT — level progression, scoring and stars.
// One job: turn raw play (finds, mistakes, seconds left, hints used) into
// a score and a star rating, and remember each level's best. Storage is
// guarded: the game plays fine with it unavailable.

import { SCENES } from './scenes.js';

const STORE_KEY = 'spotlight-best-v1';

function loadBest() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveBest(best) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(best));
  } catch {
    // Private mode or no storage: best scores just do not persist.
  }
}

export function getBest() {
  return loadBest();
}

export function sceneCount() {
  return SCENES.length;
}

export function totalDiffs() {
  return SCENES.reduce((n, s) => n + s.diffs.length, 0);
}

// Stars: 3 for a clean, fast clear; 2 for a solid clear; else 1.
export function starsFor(scene, mistakes, secondsLeft) {
  const timeShare = secondsLeft / scene.timeLimit;
  if (mistakes === 0 && timeShare >= 0.3) return 3;
  if (mistakes <= 2 && timeShare >= 0.15) return 2;
  return 1;
}

export function findPoints(streak) {
  return 100 + Math.min(streak, 8) * 25;
}

export function timeBonus(secondsLeft) {
  return Math.round(secondsLeft) * 10;
}

export function recordLevelResult(index, stars, score) {
  const best = loadBest();
  const key = SCENES[index].id;
  const prev = best[key] || { stars: 0, score: 0 };
  best[key] = {
    stars: Math.max(prev.stars, stars),
    score: Math.max(prev.score, score),
  };
  saveBest(best);
  return best[key];
}

export function totalStars() {
  const best = loadBest();
  return SCENES.reduce((n, s) => n + ((best[s.id] || {}).stars || 0), 0);
}
