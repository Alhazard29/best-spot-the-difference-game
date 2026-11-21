# best-spot-the-difference-game

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Alhazard29/best-spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Alhazard29/best-spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A spot-the-difference game with five original scenes.

SPOTLIGHT is a complete spot-the-difference game you play in a desktop browser. Two near-identical pictures sit side by side; click a difference on either panel to mark it with a gold ring and earn points. Five original hand-drawn scenes — Sunny Park, Cozy Kitchen, Coral Reef, Space Station and Wizard's Library — hold 39 differences in total. Each level has a countdown timer, a streak bonus, hints, synthesized sound effects (no audio files), and a star rating at the end. Your best stars and scores per level are saved in the browser.

## Run it

```sh
python3 -m http.server 8080 --directory game
```

Then open http://localhost:8080 in a desktop browser and press Play.

## How to play

- Click a difference on either picture: +100 points, plus a streak bonus of +25 per consecutive find (capped at +200, so at most 300 per find).
- Wrong click: −3 seconds and a mistake is counted.
- Hint (H key or the Hint button, 3 per level): highlights a random unfound difference for 2.5 seconds and costs −5 seconds.
- Keys: H hint, M mute, Esc/P pause, Enter start / next level.
- Stars: 3 stars with 0 mistakes and at least 30% of the time left, 2 stars with at most 2 mistakes and at least 15% left, otherwise 1 star. Seconds left are worth +10 points each as a time bonus.

## Scenes

| Scene | Differences | Time limit |
| --- | --- | --- |
| Sunny Park | 7 | 90 s |
| Cozy Kitchen | 7 | 90 s |
| Coral Reef | 8 | 100 s |
| Space Station | 8 | 100 s |
| Wizard's Library | 9 | 110 s |

## Layout

- `game/` — the game itself, static files with no build step (`index.html` plus `src/`).
- `screenshots/` — four screenshots of the game running in a browser.
- `main.ts` — the entrypoint: copies `game/` and `screenshots/` to the output directory and writes `dossier.json` there.
- `vendor/makefun-game.ts` — the kit's dossier builder, unchanged.

## License

MIT — see [LICENSE](LICENSE).

---

<sub>Entered on [make.fun](https://make.fun/?ref=4zhb3zrh&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
