// Scoring, stars and best-result persistence for SPOTLIGHT.

export const BEST_KEY = 'spotlight-best-v1';

// Points for finding a difference. `streak` is how many consecutive
// finds came before this one: first find 100, then +25 each, capped
// at +200 bonus (300 per find at most). The cap is reached on the
// ninth consecutive find, so long streaks stay rewarding but bounded.
export function pointsForFind(streak) {
  return 100 + Math.min(streak, 8) * 25;
}

// Time bonus at the end of a level: seconds left times ten.
export function timeBonus(timeLeft) {
  return Math.max(0, Math.round(timeLeft)) * 10;
}

// Stars: 3 when no mistakes and at least 30% of the time is left,
// 2 when at most 2 mistakes and at least 15% is left, else 1.
export function starsFor(mistakes, timeLeft, timeLimit) {
  const frac = timeLeft / timeLimit;
  if (mistakes === 0 && frac >= 0.3) return 3;
  if (mistakes <= 2 && frac >= 0.15) return 2;
  return 1;
}

export function loadBest() {
  try {
    const raw = window.localStorage.getItem(BEST_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveBest(level, stars, score) {
  try {
    const best = loadBest();
    const cur = best[level] || { stars: 0, score: 0 };
    best[level] = {
      stars: Math.max(cur.stars, stars),
      score: Math.max(cur.score, score),
    };
    window.localStorage.setItem(BEST_KEY, JSON.stringify(best));
  } catch (e) {
    // Storage unavailable (private mode, blocked cookies): ignore.
  }
}
