// SPOTLIGHT — spot-the-difference game hand-in (make.fun program/v1).
// Copies game/ and screenshots/ into the output directory and writes
// dossier.json there with the kit's dossier builder. Everything is
// anchored to this file's own directory, never to the working directory.
// No network, no writes outside the output directory, exits quickly.
import { chmodSync, cpSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-game.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir =
  process.env.MAKEFUN_OUTPUT_DIR || join(repoRoot, "out");

mkdirSync(join(outputDir, "game"), { recursive: true });
mkdirSync(join(outputDir, "screenshots"), { recursive: true });

cpSync(join(repoRoot, "game"), join(outputDir, "game"), {
  recursive: true,
});
cpSync(join(repoRoot, "screenshots"), join(outputDir, "screenshots"), {
  recursive: true,
});

const dossier = await buildDossier(outputDir, {
  text_max_bytes: 163840,
  max_images: 4,
  image_max_bytes: 262144,
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});

writeFileSync(join(outputDir, "dossier.json"), dossier);

// The grader collects the output as another user, so every file under
// the output directory must be world-readable (0644) and every folder
// world-readable and traversable (0755), whatever the shell's umask is.
// Only the contents are chmodded — never the output directory itself,
// which is the grader's mount point.
const fixModes = (dir: string) => {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      chmodSync(path, 0o755);
      fixModes(path);
    } else {
      chmodSync(path, 0o644);
    }
  }
};
fixModes(outputDir);
