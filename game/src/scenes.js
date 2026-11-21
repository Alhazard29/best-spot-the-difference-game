// The five SPOTLIGHT scenes. Each scene paints a 600x600 picture from one
// draw function: the left panel calls draw(ctx, {}) and the right panel
// calls draw(ctx, ALL) where ALL marks every difference applied, so the
// two pictures are pixel-aligned by construction. A difference is an
// object { name, x, y, r, label }: its centre and hit radius in the
// 600x600 scene space, plus a short label for the HUD toast.
import {
  rr, disc, ring, star, cloud, sun, flower, tree, fish, bird, book,
  candle, bubble, butterfly,
} from './art.js';

function vgrad(ctx, c1, c2) {
  const g = ctx.createLinearGradient(0, 0, 0, 600);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 600, 600);
}

function allMods(n) {
  const m = {};
  for (let i = 0; i < n; i++) m[i] = true;
  return m;
}

export function modsForAll(scene) {
  return allMods(scene.differences.length);
}

const PALETTE = ['#c94f4f', '#4f7ec9', '#4fc94f', '#e8b93c', '#9b59d0', '#e07b39'];

function bookRow(ctx, x, y, w, count, hBase) {
  const bw = w / count;
  for (let i = 0; i < count; i++) {
    const h = hBase + ((i * 37) % 22);
    book(ctx, x + i * bw + 1, y - h, bw - 2, h, PALETTE[i % PALETTE.length], '#f4efe4');
  }
}

function drawPark(ctx, mods) {
  vgrad(ctx, '#aee2ff', '#e8f7ff');
  sun(ctx, 520, 70, 38);
  if (!mods[1]) cloud(ctx, 120, 70, 1, '#ffffff');
  cloud(ctx, 300, 48, 0.8, '#ffffff');
  cloud(ctx, 470, 116, 0.7, '#f2f8ff');
  // hills
  ctx.fillStyle = '#7cc46a';
  ctx.beginPath();
  ctx.ellipse(150, 640, 330, 130, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#5da94f';
  ctx.beginPath();
  ctx.ellipse(480, 650, 330, 120, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  // winding path
  ctx.fillStyle = '#e8d3a0';
  ctx.beginPath();
  ctx.moveTo(270, 600);
  ctx.quadraticCurveTo(300, 480, 260, 420);
  ctx.quadraticCurveTo(330, 470, 330, 600);
  ctx.closePath();
  ctx.fill();
  // tree with apple
  tree(ctx, 90, 300, 1.15);
  if (!mods[6]) {
    ctx.fillStyle = '#d93838';
    disc(ctx, 110, 285, 9, true);
    ctx.fillStyle = '#8c1f1f';
    disc(ctx, 107, 282, 3, true);
  }
  // bench with three back slats
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(336, 408, 92, 10);
  ctx.fillRect(344, 418, 8, 46);
  ctx.fillRect(412, 418, 8, 46);
  ctx.fillStyle = '#a06a33';
  ctx.fillRect(336, 372, 92, 12);
  ctx.fillRect(348, 384, 10, 26);
  if (!mods[4]) ctx.fillRect(377, 384, 10, 26);
  ctx.fillRect(406, 384, 10, 26);
  // kite with tail bows
  ctx.fillStyle = '#e84a7a';
  ctx.beginPath();
  ctx.moveTo(450, 108);
  ctx.lineTo(478, 140);
  ctx.lineTo(450, 172);
  ctx.lineTo(422, 140);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#5b4636';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(450, 172);
  ctx.quadraticCurveTo(440, 200, 428, 226);
  ctx.stroke();
  ctx.fillStyle = '#ffd94d';
  disc(ctx, 446, 183, 6, true);
  if (!mods[2]) disc(ctx, 440, 200, 6, true);
  disc(ctx, 433, 216, 6, true);
  // bird (difference 0)
  if (!mods[0]) bird(ctx, 305, 92, 1);
  // flowers along the bottom
  flower(ctx, 80, 470, 1, '#e84a7a', '#ffd94d');
  flower(ctx, 180, 470, 1, mods[3] ? '#ffd94d' : '#e84a7a', '#7a4a21');
  flower(ctx, 280, 470, 1, '#9b59d0', '#ffd94d');
  flower(ctx, 540, 480, 1, '#e84a7a', '#ffd94d');
  butterfly(ctx, 250, 540, 0.9, '#e07b39', '#e8b93c');
  // pond with duck
  ctx.fillStyle = '#5fb2e8';
  ctx.beginPath();
  ctx.ellipse(470, 530, 90, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8fd0f5';
  ctx.beginPath();
  ctx.ellipse(470, 524, 60, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  if (!mods[5]) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(470, 528, 20, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    disc(ctx, 486, 516, 9, true);
    ctx.fillStyle = '#f6b73c';
    ctx.beginPath();
    ctx.moveTo(494, 514);
    ctx.lineTo(504, 517);
    ctx.lineTo(494, 520);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#10233f';
    disc(ctx, 488, 513, 1.8, true);
  }
  // grass tufts
  ctx.strokeStyle = '#3f9e4d';
  ctx.lineWidth = 3;
  [[60, 560], [200, 580], [340, 560], [540, 560]].forEach(([gx, gy]) => {
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx - 6, gy - 14);
    ctx.moveTo(gx + 6, gy);
    ctx.lineTo(gx + 10, gy - 12);
    ctx.stroke();
  });
}

function drawKitchen(ctx, mods) {
  vgrad(ctx, '#f7e8c8', '#f0d9a8');
  // floor
  ctx.fillStyle = '#b07a45';
  ctx.fillRect(0, 440, 600, 160);
  ctx.fillStyle = '#96682f';
  for (let x = 0; x < 600; x += 90) ctx.fillRect(x, 440, 4, 160);
  // window with curtain
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(396, 66, 108, 108);
  ctx.fillStyle = '#aee2ff';
  ctx.fillRect(406, 76, 88, 88);
  ctx.fillStyle = '#ffffff';
  cloud(ctx, 430, 100, 0.45, '#ffffff');
  ctx.fillStyle = '#ffd94d';
  disc(ctx, 470, 96, 10, true);
  if (mods[6]) {
    ctx.fillStyle = '#c94f6d';
    ctx.fillRect(406, 76, 88, 88);
    ctx.fillStyle = '#a83a56';
    ctx.fillRect(446, 76, 8, 88);
  } else {
    ctx.fillStyle = '#c94f6d';
    ctx.fillRect(396, 66, 16, 108);
    ctx.fillRect(488, 66, 16, 108);
  }
  // wall clock
  ctx.fillStyle = '#2b2118';
  disc(ctx, 300, 100, 30, true);
  ctx.fillStyle = '#ffffff';
  disc(ctx, 300, 100, 25, true);
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 100);
  if (mods[2]) ctx.lineTo(318, 100);
  else ctx.lineTo(300, 82);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(300, 100);
  ctx.lineTo(300, 114);
  ctx.stroke();
  ctx.fillStyle = '#2b2118';
  disc(ctx, 300, 100, 3, true);
  // shelf with jars
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(40, 196, 180, 10);
  ctx.fillStyle = '#c9a86a';
  rr(ctx, 60, 158, 34, 38, 4);
  ctx.fill();
  ctx.fillStyle = '#7a9e4d';
  rr(ctx, 108, 164, 34, 32, 4);
  ctx.fill();
  ctx.fillStyle = '#c94f4f';
  rr(ctx, 156, 160, 34, 36, 4);
  ctx.fill();
  // hanging plant
  if (!mods[5]) {
    ctx.strokeStyle = '#5b4636';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 130);
    ctx.lineTo(80, 160);
    ctx.stroke();
    ctx.fillStyle = '#c96a3b';
    ctx.beginPath();
    ctx.moveTo(62, 160);
    ctx.lineTo(98, 160);
    ctx.lineTo(90, 188);
    ctx.lineTo(70, 188);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#3f9e4d';
    disc(ctx, 66, 152, 12, true);
    disc(ctx, 80, 142, 14, true);
    disc(ctx, 94, 152, 12, true);
  }
  // stove with flame
  ctx.fillStyle = '#5b6470';
  rr(ctx, 130, 330, 150, 110, 8);
  ctx.fill();
  ctx.fillStyle = '#2b2f36';
  disc(ctx, 175, 360, 22, true);
  disc(ctx, 235, 360, 22, true);
  if (!mods[0]) {
    ctx.fillStyle = '#ff9d2e';
    ctx.beginPath();
    ctx.ellipse(175, 350, 10, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffe9a8';
    ctx.beginPath();
    ctx.ellipse(175, 354, 5, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#e8e2d2';
  ctx.fillRect(150, 392, 110, 26);
  ctx.fillStyle = '#c94f4f';
  disc(ctx, 165, 405, 6, true);
  disc(ctx, 190, 405, 6, true);
  // counter
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(0, 440, 600, 16);
  // mug on the counter
  if (!mods[1]) {
    ctx.fillStyle = '#4f7ec9';
    rr(ctx, 402, 424, 36, 30, 4);
    ctx.fill();
    ctx.strokeStyle = '#4f7ec9';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(442, 439, 10, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }
  // plate with cookie
  ctx.fillStyle = '#f4efe4';
  ctx.beginPath();
  ctx.ellipse(150, 500, 44, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  if (!mods[3]) {
    ctx.fillStyle = '#b07a45';
    disc(ctx, 150, 494, 13, true);
    ctx.fillStyle = '#5b4636';
    disc(ctx, 145, 491, 2.5, true);
    disc(ctx, 155, 497, 2.5, true);
    disc(ctx, 150, 489, 2, true);
  }
  // cat sitting on the floor
  ctx.fillStyle = '#e8a13c';
  ctx.beginPath();
  ctx.ellipse(500, 512, 34, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  disc(ctx, 505, 462, 22, true);
  ctx.beginPath();
  ctx.moveTo(488, 448);
  ctx.lineTo(494, 428);
  ctx.lineTo(502, 446);
  ctx.closePath();
  ctx.fill();
  if (!mods[4]) {
    ctx.beginPath();
    ctx.moveTo(512, 446);
    ctx.lineTo(520, 428);
    ctx.lineTo(526, 448);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#2b2118';
  disc(ctx, 497, 458, 2.5, true);
  disc(ctx, 513, 458, 2.5, true);
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(505, 466);
  ctx.lineTo(505, 470);
  ctx.stroke();
  // rug
  ctx.fillStyle = '#9b59d0';
  rr(ctx, 240, 540, 140, 40, 6);
  ctx.fill();
  ctx.fillStyle = '#ffd94d';
  ctx.fillRect(250, 552, 120, 6);
}

export const SCENES = [
  {
    name: 'Sunny Park',
    blurb: 'A bright afternoon in the park.',
    timeLimit: 90,
    differences: [
      { name: 'bird', x: 305, y: 92, r: 20, label: 'the bird' },
      { name: 'cloud', x: 120, y: 70, r: 30, label: 'the cloud' },
      { name: 'kite bow', x: 440, y: 200, r: 14, label: 'the kite bow' },
      { name: 'flower', x: 180, y: 470, r: 16, label: 'the flower' },
      { name: 'bench slat', x: 380, y: 400, r: 16, label: 'the bench slat' },
      { name: 'duck', x: 470, y: 530, r: 24, label: 'the duck' },
      { name: 'apple', x: 110, y: 285, r: 14, label: 'the apple' },
    ],
    draw: drawPark,
  },
  {
    name: 'Cozy Kitchen',
    blurb: 'Tea is on, the cat is in.',
    timeLimit: 90,
    differences: [
      { name: 'flame', x: 175, y: 350, r: 22, label: 'the stove flame' },
      { name: 'mug', x: 420, y: 440, r: 18, label: 'the mug' },
      { name: 'clock hand', x: 300, y: 100, r: 26, label: 'the clock hand' },
      { name: 'cookie', x: 150, y: 494, r: 16, label: 'the cookie' },
      { name: 'cat ear', x: 516, y: 438, r: 16, label: 'the cat ear' },
      { name: 'plant', x: 80, y: 165, r: 24, label: 'the plant' },
      { name: 'curtain', x: 450, y: 120, r: 40, label: 'the curtain' },
    ],
    draw: drawKitchen,
  },
];

function drawReef(ctx, mods) {
  vgrad(ctx, '#0b5e8a', '#0a3a5c');
  // light rays from the surface
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  [[80, 0, 40], [220, 0, 30], [380, 0, 44], [500, 0, 26]].forEach(([rx, ry, rw]) => {
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx + rw, ry);
    ctx.lineTo(rx + rw + 60, 420);
    ctx.lineTo(rx + 60, 420);
    ctx.closePath();
    ctx.fill();
  });
  // sand
  ctx.fillStyle = '#e8d49a';
  ctx.beginPath();
  ctx.ellipse(300, 640, 420, 110, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d9c184';
  ctx.beginPath();
  ctx.ellipse(120, 600, 130, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(480, 610, 150, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  // rocks
  ctx.fillStyle = '#6b6f75';
  ctx.beginPath();
  ctx.ellipse(60, 560, 60, 30, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(560, 570, 54, 26, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  // pink coral (difference 3: pink vs orange)
  ctx.fillStyle = mods[3] ? '#e07b39' : '#f27bb1';
  ctx.beginPath();
  ctx.ellipse(100, 470, 16, 60, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(76, 480, 12, 44, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(124, 484, 12, 40, -0.35, 0, Math.PI * 2);
  ctx.fill();
  // seaweed (difference 5: tall vs short)
  const weedH = mods[5] ? 60 : 120;
  ctx.strokeStyle = '#2e8b57';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(520, 520);
  ctx.quadraticCurveTo(500, 460, 520, 520 - weedH);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(536, 520);
  ctx.quadraticCurveTo(552, 470, 540, 520 - weedH + 24);
  ctx.stroke();
  // yellow fish (difference 0)
  if (!mods[0]) fish(ctx, 150, 200, 1, '#ffd94d', false);
  // blue fish with stripe (difference 6)
  fish(ctx, 250, 350, 0.9, '#4f9ed6', true);
  if (!mods[6]) {
    ctx.strokeStyle = '#1d5a8a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(250, 338);
    ctx.lineTo(250, 362);
    ctx.stroke();
  }
  // turtle (difference 7: flipper)
  ctx.fillStyle = '#4f9e57';
  ctx.beginPath();
  ctx.ellipse(420, 250, 42, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3a7d44';
  disc(ctx, 420, 250, 18, true);
  disc(ctx, 462, 244, 12, true);
  ctx.fillStyle = '#2b2118';
  disc(ctx, 466, 240, 2.5, true);
  ctx.fillStyle = '#4f9e57';
  ctx.beginPath();
  ctx.ellipse(388, 232, 16, 7, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(388, 268, 16, 7, 0.6, 0, Math.PI * 2);
  ctx.fill();
  if (!mods[7]) {
    ctx.beginPath();
    ctx.ellipse(448, 232, 16, 7, 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  // bubbles (difference 2: three vs one)
  bubble(ctx, 292, 140, 10);
  bubble(ctx, 312, 158, 8);
  if (!mods[2]) bubble(ctx, 300, 122, 7);
  // starfish (difference 1)
  if (!mods[1]) {
    ctx.fillStyle = '#e07b39';
    star(ctx, 450, 500, 22, true);
    ctx.fillStyle = '#b85a24';
    disc(ctx, 450, 500, 5, true);
  }
  // shell (difference 4)
  if (!mods[4]) {
    ctx.fillStyle = '#f2c9d8';
    ctx.beginPath();
    ctx.arc(350, 540, 18, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#c98aa5';
    ctx.lineWidth = 2;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(350 + i * 7, 540);
      ctx.lineTo(350 + i * 4, 524);
      ctx.stroke();
    }
  }
  // small background fish
  fish(ctx, 90, 320, 0.55, '#7fb8d9', false);
  fish(ctx, 520, 120, 0.6, '#c9a86a', true);
}

function drawSpace(ctx, mods) {
  vgrad(ctx, '#0a0f24', '#131c3f');
  // deterministic star field
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 46; i++) {
    const sx = (i * 137 + 41) % 600;
    const sy = (i * 89 + 23) % 420;
    const sr = i % 5 === 0 ? 2.4 : 1.4;
    disc(ctx, sx, sy, sr, true);
  }
  // bright star (difference 0)
  if (!mods[0]) {
    ctx.fillStyle = '#ffe9a8';
    star(ctx, 120, 80, 14, true);
  }
  // Saturn with ring (difference 5)
  ctx.fillStyle = '#e8c87a';
  disc(ctx, 350, 90, 20, true);
  ctx.fillStyle = '#d9a441';
  disc(ctx, 350, 90, 12, true);
  if (!mods[5]) {
    ctx.strokeStyle = '#e8d49a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(350, 90, 38, 10, -0.35, 0, Math.PI * 2);
    ctx.stroke();
  }
  // big window with Earth (difference 3)
  ctx.fillStyle = '#3a4152';
  disc(ctx, 500, 120, 52, true);
  ctx.fillStyle = '#0a0f24';
  disc(ctx, 500, 120, 44, true);
  if (!mods[3]) {
    ctx.fillStyle = '#3d7bd6';
    disc(ctx, 500, 120, 30, true);
    ctx.fillStyle = '#57c785';
    disc(ctx, 490, 112, 10, true);
    disc(ctx, 512, 130, 8, true);
    ctx.fillStyle = '#ffffff';
    disc(ctx, 492, 108, 5, true);
    disc(ctx, 510, 122, 4, true);
  }
  // wall panel with indicator (difference 1)
  ctx.fillStyle = '#2b3247';
  rr(ctx, 360, 120, 80, 60, 6);
  ctx.fill();
  ctx.fillStyle = mods[1] ? '#2b3247' : '#57c785';
  disc(ctx, 380, 140, 7, true);
  ctx.fillStyle = '#e8b93c';
  disc(ctx, 400, 140, 7, true);
  ctx.fillStyle = '#c94f4f';
  disc(ctx, 420, 140, 7, true);
  ctx.fillStyle = '#8a93a8';
  ctx.fillRect(372, 160, 56, 6);
  // antenna (difference 6) — mounted on a small wall box
  if (!mods[6]) {
    ctx.fillStyle = '#3a4152';
    ctx.fillRect(68, 296, 24, 12);
    ctx.strokeStyle = '#8a93a8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(80, 300);
    ctx.lineTo(80, 226);
    ctx.stroke();
    ctx.fillStyle = '#ff6b5e';
    disc(ctx, 80, 220, 7, true);
    ctx.strokeStyle = '#ff6b5e';
    ctx.lineWidth = 2;
    ring(ctx, 80, 220, 14, 2, '#ff6b5e');
  }
  // astronaut (difference 2: arm up vs down)
  ctx.fillStyle = '#f4efe4';
  ctx.beginPath();
  ctx.ellipse(250, 320, 34, 42, 0, 0, Math.PI * 2);
  ctx.fill();
  disc(ctx, 250, 262, 20, true);
  ctx.fillStyle = '#1d2a44';
  disc(ctx, 250, 260, 13, true);
  ctx.fillStyle = '#ffffff';
  disc(ctx, 254, 256, 4, true);
  ctx.strokeStyle = '#f4efe4';
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(224, 310);
  if (mods[2]) ctx.lineTo(200, 350);
  else ctx.lineTo(204, 272);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(276, 310);
  ctx.lineTo(300, 344);
  ctx.stroke();
  ctx.fillStyle = '#c94f4f';
  disc(ctx, 250, 320, 8, true);
  // floor
  ctx.fillStyle = '#232a3d';
  ctx.fillRect(0, 520, 600, 80);
  ctx.fillStyle = '#2e3750';
  for (let x = 0; x < 600; x += 100) ctx.fillRect(x, 520, 3, 80);
  // console with button (difference 4: red vs green)
  ctx.fillStyle = '#2b3247';
  rr(ctx, 120, 452, 160, 68, 8);
  ctx.fill();
  ctx.fillStyle = mods[4] ? '#57c785' : '#e84a4a';
  disc(ctx, 180, 480, 12, true);
  ctx.fillStyle = '#e8b93c';
  disc(ctx, 210, 480, 8, true);
  ctx.fillStyle = '#4f9ed6';
  disc(ctx, 234, 480, 8, true);
  ctx.fillStyle = '#8a93a8';
  ctx.fillRect(140, 500, 120, 6);
  // porthole (difference 7: open vs shuttered)
  ctx.fillStyle = '#3a4152';
  disc(ctx, 520, 420, 36, true);
  if (mods[7]) {
    ctx.fillStyle = '#5b6470';
    disc(ctx, 520, 420, 30, true);
    ctx.strokeStyle = '#2b3247';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(520, 392);
    ctx.lineTo(520, 448);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#0a0f24';
    disc(ctx, 520, 420, 30, true);
    ctx.fillStyle = '#ffffff';
    disc(ctx, 508, 410, 2, true);
    disc(ctx, 532, 428, 2, true);
    disc(ctx, 526, 406, 1.6, true);
  }
}

SCENES.push(
  {
    name: 'Coral Reef',
    blurb: 'Down where the fish play.',
    timeLimit: 100,
    differences: [
      { name: 'yellow fish', x: 150, y: 200, r: 26, label: 'the yellow fish' },
      { name: 'starfish', x: 450, y: 500, r: 22, label: 'the starfish' },
      { name: 'bubble', x: 300, y: 145, r: 26, label: 'the bubble' },
      { name: 'coral', x: 100, y: 470, r: 30, label: 'the coral' },
      { name: 'shell', x: 350, y: 534, r: 18, label: 'the shell' },
      { name: 'seaweed', x: 524, y: 460, r: 30, label: 'the seaweed' },
      { name: 'fish stripe', x: 250, y: 350, r: 26, label: 'the fish stripe' },
      { name: 'turtle flipper', x: 448, y: 232, r: 28, label: 'the turtle flipper' },
    ],
    draw: drawReef,
  },
  {
    name: 'Space Station',
    blurb: 'One small float for an astronaut.',
    timeLimit: 100,
    differences: [
      { name: 'star', x: 120, y: 80, r: 18, label: 'the bright star' },
      { name: 'panel light', x: 380, y: 140, r: 18, label: 'the panel light' },
      { name: 'astronaut arm', x: 213, y: 310, r: 40, label: 'the astronaut arm' },
      { name: 'Earth', x: 500, y: 120, r: 45, label: 'the Earth' },
      { name: 'console button', x: 180, y: 480, r: 16, label: 'the console button' },
      { name: 'Saturn ring', x: 350, y: 90, r: 30, label: 'the Saturn ring' },
      { name: 'antenna', x: 80, y: 235, r: 26, label: 'the antenna' },
      { name: 'porthole', x: 520, y: 420, r: 30, label: 'the porthole' },
    ],
    draw: drawSpace,
  },
);

function drawLibrary(ctx, mods) {
  vgrad(ctx, '#6b4a2f', '#54371f');
  // bookshelves
  ctx.fillStyle = '#4a2f1a';
  ctx.fillRect(30, 60, 240, 300);
  ctx.fillRect(330, 60, 240, 300);
  bookRow(ctx, 44, 150, 212, 7, 62);
  bookRow(ctx, 44, 240, 212, 6, 58);
  bookRow(ctx, 44, 330, 212, 7, 60);
  bookRow(ctx, 344, 150, 212, 6, 60);
  bookRow(ctx, 344, 240, 212, 7, 62);
  bookRow(ctx, 344, 330, 212, 6, 58);
  ctx.fillStyle = '#3a2412';
  ctx.fillRect(30, 150, 240, 8);
  ctx.fillRect(30, 240, 240, 8);
  ctx.fillRect(30, 330, 240, 8);
  ctx.fillRect(330, 150, 240, 8);
  ctx.fillRect(330, 240, 240, 8);
  ctx.fillRect(330, 330, 240, 8);
  // owl on the left shelf (difference 0)
  if (!mods[0]) {
    ctx.fillStyle = '#8a6a4a';
    ctx.beginPath();
    ctx.ellipse(150, 150, 20, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(134, 132);
    ctx.lineTo(138, 116);
    ctx.lineTo(146, 130);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(156, 130);
    ctx.lineTo(164, 116);
    ctx.lineTo(166, 132);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    disc(ctx, 143, 144, 7, true);
    disc(ctx, 157, 144, 7, true);
    ctx.fillStyle = '#2b2118';
    disc(ctx, 143, 144, 3, true);
    disc(ctx, 157, 144, 3, true);
    ctx.fillStyle = '#f6b73c';
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.lineTo(145, 156);
    ctx.lineTo(155, 156);
    ctx.closePath();
    ctx.fill();
  }
  // wizard hat on the right shelf (difference 5)
  if (!mods[5]) {
    ctx.fillStyle = '#4f3a8a';
    ctx.beginPath();
    ctx.moveTo(350, 180);
    ctx.quadraticCurveTo(360, 120, 392, 112);
    ctx.quadraticCurveTo(380, 150, 372, 180);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(366, 180, 34, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d9a441';
    ctx.fillRect(352, 162, 26, 8);
  }
  // window with moon (difference 6) — set into the wall gap
  // between the two bookshelves, so it never covers the books
  ctx.fillStyle = '#2b2118';
  ctx.fillRect(272, 70, 56, 88);
  ctx.fillStyle = '#0a0f24';
  ctx.fillRect(278, 76, 44, 76);
  if (!mods[6]) {
    ctx.fillStyle = '#f4efe4';
    disc(ctx, 300, 108, 14, true);
    ctx.fillStyle = '#d9d2c2';
    disc(ctx, 295, 104, 3, true);
    disc(ctx, 304, 112, 2.5, true);
  }
  ctx.fillStyle = '#ffffff';
  disc(ctx, 284, 92, 1.6, true);
  disc(ctx, 314, 138, 1.6, true);
  // desk
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(60, 470, 480, 22);
  ctx.fillStyle = '#5b3413';
  ctx.fillRect(80, 492, 18, 108);
  ctx.fillRect(502, 492, 18, 108);
  // rug (difference 7: stripe)
  ctx.fillStyle = '#7a2e3a';
  rr(ctx, 200, 540, 200, 44, 8);
  ctx.fill();
  if (!mods[7]) {
    ctx.fillStyle = '#d9a441';
    ctx.fillRect(210, 556, 180, 6);
  }
  // candle (difference 1: flame) — base sits on the desk top (y 470)
  candle(ctx, 300, 432, 1, !mods[1]);
  // book on the desk (difference 2: red vs blue)
  book(ctx, 380, 452, 44, 26, mods[2] ? '#4f7ec9' : '#c94f4f', '#f4efe4');
  // potion bottle (difference 3) — base sits on the desk top (y 470)
  if (!mods[3]) {
    ctx.fillStyle = '#7a4fd0';
    rr(ctx, 488, 430, 24, 40, 6);
    ctx.fill();
    ctx.fillStyle = '#5b3413';
    ctx.fillRect(494, 418, 12, 12);
    ctx.fillStyle = '#c9a8f5';
    disc(ctx, 496, 442, 4, true);
    disc(ctx, 504, 454, 3, true);
  }
  // scroll (difference 4: rolled vs unrolled) — both rest on the desk
  if (mods[4]) {
    ctx.fillStyle = '#f4e8c8';
    rr(ctx, 170, 444, 70, 26, 4);
    ctx.fill();
    ctx.strokeStyle = '#8a7a5a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(180, 452);
    ctx.lineTo(230, 452);
    ctx.moveTo(180, 462);
    ctx.lineTo(220, 462);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#f4e8c8';
    ctx.beginPath();
    ctx.ellipse(200, 458, 26, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d9c184';
    disc(ctx, 200, 458, 8, true);
  }
  // key on the desk (difference 8)
  if (!mods[8]) {
    ctx.strokeStyle = '#d9a441';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(450, 520, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(457, 520);
    ctx.lineTo(478, 520);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(470, 520);
    ctx.lineTo(470, 528);
    ctx.moveTo(476, 520);
    ctx.lineTo(476, 527);
    ctx.stroke();
  }
}

SCENES.push({
  name: "Wizard's Library",
  blurb: 'Shh — the books are listening.',
  timeLimit: 110,
  differences: [
    { name: 'owl', x: 150, y: 146, r: 26, label: 'the owl' },
    { name: 'candle flame', x: 300, y: 424, r: 18, label: 'the candle flame' },
    { name: 'book', x: 402, y: 465, r: 20, label: 'the book' },
    { name: 'potion', x: 500, y: 445, r: 18, label: 'the potion' },
    { name: 'scroll', x: 205, y: 458, r: 20, label: 'the scroll' },
    { name: 'hat', x: 366, y: 150, r: 26, label: 'the wizard hat' },
    { name: 'moon', x: 300, y: 108, r: 26, label: 'the moon' },
    { name: 'rug stripe', x: 300, y: 559, r: 30, label: 'the rug stripe' },
    { name: 'key', x: 462, y: 520, r: 14, label: 'the key' },
  ],
  draw: drawLibrary,
});
