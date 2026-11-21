// SPOTLIGHT — the five scenes.
// Each scene draws itself twice: the left panel with no mods, the right
// panel with every difference applied. A difference is a small conditional
// inside the draw code, so both panels stay pixel-aligned by construction.
// diffs: { id, x, y, r, label } — x/y/r in scene space (600 x 600), the
// label is what the "found" toast names. Keep radii generous and fair:
// every difference is visible if you study the picture, none is a pixel hunt.

import { rr, disc, ring, star, cloud, sun, flower, tree, bird, butterfly, book, candle, fish, bubble } from './art.js';

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 600);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 600, 600);
}

function hills(ctx) {
  ctx.fillStyle = '#7ec850';
  ctx.beginPath();
  ctx.ellipse(140, 640, 340, 150, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#69b844';
  ctx.beginPath();
  ctx.ellipse(470, 660, 360, 170, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8fd45f';
  ctx.beginPath();
  ctx.ellipse(300, 700, 420, 130, 0, Math.PI, Math.PI * 2);
  ctx.fill();
}

export const SCENES = [
  {
    id: 'park',
    name: 'Sunny Park',
    tagline: 'A lazy afternoon in the park',
    timeLimit: 90,
    diffs: [
      { id: 'bird', x: 305, y: 92, r: 30, label: 'the sky bird' },
      { id: 'cloud', x: 428, y: 74, r: 34, label: 'the middle cloud' },
      { id: 'kiteTail', x: 505, y: 152, r: 28, label: 'the kite tail bow' },
      { id: 'flower', x: 150, y: 548, r: 26, label: 'the purple flower' },
      { id: 'bench', x: 382, y: 428, r: 30, label: 'the bench slat' },
      { id: 'duck', x: 492, y: 498, r: 30, label: 'the pond duck' },
      { id: 'apple', x: 108, y: 302, r: 24, label: 'the tree apple' },
    ],
    draw(ctx, m) {
      sky(ctx, '#8ec9ee', '#d8f0c8');
      sun(ctx, 84, 82, 34, 8);
      cloud(ctx, 180, 66, 1);
      if (!m.cloud) cloud(ctx, 400, 62, 0.9);
      cloud(ctx, 520, 120, 0.7);
      if (!m.bird) bird(ctx, 305, 92, 1);
      // Kite, top right, with a string and two tail bows.
      ctx.save();
      ctx.translate(505, 108);
      ctx.rotate(0.5);
      ctx.fillStyle = '#e63946';
      ctx.beginPath();
      ctx.moveTo(0, -26); ctx.lineTo(22, 0); ctx.lineTo(0, 26); ctx.lineTo(-22, 0);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffd93b';
      ctx.beginPath();
      ctx.moveTo(0, -26); ctx.lineTo(22, 0); ctx.lineTo(0, 0); ctx.lineTo(-22, 0);
      ctx.closePath(); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = '#5b5346';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(505, 128); ctx.quadraticCurveTo(500, 170, 505, 205);
      ctx.stroke();
      ctx.fillStyle = '#457b9d';
      disc(ctx, 503, 158, 6, '#457b9d');
      if (!m.kiteTail) disc(ctx, 505, 186, 6, '#e63946');
      hills(ctx);
      // Pond, bottom right.
      ctx.fillStyle = '#5aa9d6';
      ctx.beginPath();
      ctx.ellipse(490, 505, 105, 42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#8ec9ee';
      ctx.beginPath();
      ctx.ellipse(462, 494, 52, 14, -0.15, 0, Math.PI * 2);
      ctx.fill();
      if (!m.duck) {
        ctx.fillStyle = '#ffd93b';
        ctx.beginPath();
        ctx.ellipse(492, 498, 20, 13, 0, 0, Math.PI * 2);
        ctx.fill();
        disc(ctx, 508, 486, 9, '#ffd93b');
        ctx.fillStyle = '#f77f00';
        ctx.beginPath();
        ctx.moveTo(516, 484); ctx.lineTo(526, 487); ctx.lineTo(516, 490);
        ctx.closePath(); ctx.fill();
        disc(ctx, 510, 483, 2, '#10243a');
      }
      // Tree, left.
      tree(ctx, 110, 470, 1.15);
      disc(ctx, 82, 300, 9, '#e63946');
      disc(ctx, 138, 322, 9, '#e63946');
      if (!m.apple) disc(ctx, 108, 302, 9, '#e63946');
      // Bench, centre right.
      ctx.fillStyle = '#8a5a2b';
      ctx.fillRect(330, 420, 108, 12);
      if (!m.bench) ctx.fillRect(330, 444, 108, 12);
      ctx.fillRect(330, 468, 108, 12);
      ctx.fillRect(338, 480, 10, 46);
      ctx.fillRect(420, 480, 10, 46);
      ctx.fillStyle = '#6b4423';
      ctx.fillRect(330, 402, 10, 22);
      ctx.fillRect(428, 402, 10, 22);
      // Flower row along the bottom.
      const petals = ['#e63946', '#ff8fa3', '#ffd93b', '#c77dff', '#ff8fa3', '#e63946'];
      for (let i = 0; i < 6; i++) {
        const fx = 60 + i * 52;
        const col = i === 2 && m.flower ? '#7b2cbf' : petals[i];
        flower(ctx, fx, 548, 1, col);
        ctx.strokeStyle = '#3f9e4d';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(fx, 556); ctx.lineTo(fx, 578);
        ctx.stroke();
      }
      butterfly(ctx, 250, 520, 1, '#ff8fa3');
    },
  },
  {
    id: 'kitchen',
    name: 'Cozy Kitchen',
    tagline: 'Tea is on, the cat is asleep',
    timeLimit: 90,
    diffs: [
      { id: 'clock', x: 482, y: 118, r: 30, label: 'the clock hands' },
      { id: 'steam', x: 302, y: 330, r: 28, label: 'the teapot steam' },
      { id: 'apple', x: 208, y: 428, r: 26, label: 'the missing apple' },
      { id: 'catTail', x: 432, y: 522, r: 30, label: 'the cat tail' },
      { id: 'jarLabel', x: 520, y: 208, r: 26, label: 'the jar label' },
      { id: 'plant', x: 138, y: 298, r: 26, label: 'the plant flower' },
      { id: 'rugStripe', x: 300, y: 562, r: 30, label: 'the rug stripe' },
    ],
    draw(ctx, m) {
      // Wall and floor.
      ctx.fillStyle = '#f6e7c8';
      ctx.fillRect(0, 0, 600, 420);
      ctx.fillStyle = '#c89b6a';
      ctx.fillRect(0, 420, 600, 180);
      ctx.fillStyle = '#b3855a';
      for (let i = 0; i < 6; i++) ctx.fillRect(0, 448 + i * 26, 600, 3);
      // Window, left, with curtains and sun outside.
      ctx.fillStyle = '#8ec9ee';
      rr(ctx, 84, 84, 150, 170, 8);
      ctx.fill();
      sun(ctx, 150, 140, 26, 6);
      cloud(ctx, 108, 110, 0.55);
      ctx.strokeStyle = '#8a5a2b';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(159, 84); ctx.lineTo(159, 254);
      ctx.moveTo(84, 169); ctx.lineTo(234, 169);
      ctx.stroke();
      ctx.fillStyle = '#e63946';
      ctx.beginPath();
      ctx.moveTo(84, 84); ctx.lineTo(116, 84); ctx.lineTo(104, 254); ctx.lineTo(84, 254);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(234, 84); ctx.lineTo(202, 84); ctx.lineTo(214, 254); ctx.lineTo(234, 254);
      ctx.closePath(); ctx.fill();
      // Plant on the windowsill.
      ctx.fillStyle = '#c96f4a';
      rr(ctx, 122, 254, 40, 30, 4);
      ctx.fill();
      ctx.strokeStyle = '#3f9e4d';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(142, 254); ctx.lineTo(142, 224);
      ctx.moveTo(142, 238); ctx.lineTo(128, 224);
      ctx.moveTo(142, 238); ctx.lineTo(156, 222);
      ctx.stroke();
      if (!m.plant) flower(ctx, 142, 214, 0.8, '#ff8fa3');
      // Wall clock, right.
      disc(ctx, 482, 118, 40, '#fffdf5');
      ring(ctx, 482, 118, 40, '#8a5a2b', 5);
      disc(ctx, 482, 118, 4, '#2b2d42');
      ctx.strokeStyle = '#2b2d42';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(482, 118); ctx.lineTo(482, 92);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(482, 118);
      if (m.clock) ctx.lineTo(506, 118);
      else ctx.lineTo(502, 134);
      ctx.stroke();
      // Shelf with three jars, right.
      ctx.fillStyle = '#8a5a2b';
      ctx.fillRect(452, 236, 136, 10);
      const jars = [
        { x: 462, c: '#f4a261', l: '#e63946' },
        { x: 500, c: '#a8dadc', l: m.jarLabel ? '#2a9d8f' : '#e63946' },
        { x: 538, c: '#e9c46a', l: '#457b9d' },
      ];
      for (const j of jars) {
        ctx.fillStyle = j.c;
        rr(ctx, j.x, 196, 28, 40, 5);
        ctx.fill();
        ctx.fillStyle = '#fffdf5';
        ctx.fillRect(j.x + 4, 208, 20, 14);
        ctx.fillStyle = j.l;
        ctx.fillRect(j.x + 4, 212, 20, 6);
      }
      // Hanging lamp.
      ctx.strokeStyle = '#5b5346';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(330, 0); ctx.lineTo(330, 66);
      ctx.stroke();
      ctx.fillStyle = '#ffb703';
      ctx.beginPath();
      ctx.moveTo(300, 96); ctx.lineTo(360, 96); ctx.lineTo(344, 62); ctx.lineTo(316, 62);
      ctx.closePath(); ctx.fill();
      disc(ctx, 330, 100, 8, '#fff3b0');
      // Counter, teapot, fruit bowl.
      ctx.fillStyle = '#7a5c3e';
      ctx.fillRect(0, 380, 600, 40);
      ctx.fillStyle = '#5b4632';
      ctx.fillRect(0, 380, 600, 6);
      // Teapot.
      ctx.fillStyle = '#457b9d';
      ctx.beginPath();
      ctx.ellipse(300, 358, 42, 26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(258, 352); ctx.quadraticCurveTo(232, 342, 240, 326);
      ctx.quadraticCurveTo(252, 336, 262, 344);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#2f5d7a';
      rr(ctx, 330, 340, 10, 30, 4);
      ctx.fill();
      disc(ctx, 300, 330, 7, '#2f5d7a');
      if (!m.steam) {
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(296, 322); ctx.quadraticCurveTo(288, 302, 298, 288);
        ctx.moveTo(310, 322); ctx.quadraticCurveTo(318, 304, 308, 290);
        ctx.stroke();
      }
      // Fruit bowl.
      ctx.fillStyle = '#e63946';
      ctx.beginPath();
      ctx.ellipse(208, 428, 62, 18, 0, 0, Math.PI);
      ctx.fill();
      disc(ctx, 182, 414, 13, '#e63946');
      if (!m.apple) disc(ctx, 208, 406, 13, '#e63946');
      disc(ctx, 234, 414, 13, '#f77f00');
      disc(ctx, 196, 402, 2.5, '#7a1f1f');
      disc(ctx, 232, 412, 2.5, '#7a4a00');
      // Rug and sleeping cat.
      ctx.fillStyle = '#b56576';
      rr(ctx, 380, 520, 180, 62, 30);
      ctx.fill();
      ctx.fillStyle = '#e5989b';
      rr(ctx, 396, 532, 148, 38, 18);
      ctx.fill();
      if (!m.rugStripe) {
        ctx.strokeStyle = '#b56576';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(396, 551); ctx.lineTo(544, 551);
        ctx.stroke();
      }
      // Cat, curled up; tail up on the right panel.
      ctx.fillStyle = '#f4a261';
      ctx.beginPath();
      ctx.ellipse(452, 540, 52, 26, 0, 0, Math.PI * 2);
      ctx.fill();
      disc(ctx, 500, 528, 20, '#f4a261');
      ctx.beginPath();
      ctx.moveTo(486, 512); ctx.lineTo(482, 496); ctx.lineTo(496, 508);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(508, 510); ctx.lineTo(512, 494); ctx.lineTo(518, 510);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#2b2d42';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(508, 528); ctx.quadraticCurveTo(512, 530, 516, 528);
      ctx.stroke();
      ctx.strokeStyle = '#f4a261';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (m.catTail) {
        ctx.moveTo(404, 548); ctx.quadraticCurveTo(392, 516, 410, 500);
      } else {
        ctx.moveTo(404, 548); ctx.quadraticCurveTo(392, 566, 372, 560);
      }
      ctx.stroke();
    },
  },
  {
    id: 'reef',
    name: 'Coral Reef',
    tagline: 'Down where the fish go to hide',
    timeLimit: 100,
    diffs: [
      { id: 'fish', x: 150, y: 150, r: 30, label: 'the yellow fish' },
      { id: 'starfish', x: 470, y: 520, r: 28, label: 'the starfish arm' },
      { id: 'bubble', x: 330, y: 130, r: 24, label: 'the big bubble' },
      { id: 'coral', x: 90, y: 430, r: 30, label: 'the pink coral' },
      { id: 'shell', x: 540, y: 500, r: 26, label: 'the shell' },
      { id: 'seaweed', x: 570, y: 300, r: 28, label: 'the tall seaweed' },
      { id: 'stripe', x: 350, y: 330, r: 28, label: 'the blue fish stripe' },
      { id: 'turtle', x: 250, y: 420, r: 30, label: 'the turtle flipper' },
    ],
    draw(ctx, m) {
      // Water.
      const g = ctx.createLinearGradient(0, 0, 0, 600);
      g.addColorStop(0, '#1d6fb8');
      g.addColorStop(0.6, '#2a93c4');
      g.addColorStop(1, '#155a8a');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 600, 600);
      // Sandy bottom.
      ctx.fillStyle = '#e8d29a';
      ctx.beginPath();
      ctx.ellipse(300, 640, 420, 110, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d9bf7f';
      ctx.beginPath();
      ctx.ellipse(120, 660, 220, 70, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      // Light rays.
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      ctx.beginPath();
      ctx.moveTo(120, 0); ctx.lineTo(190, 0); ctx.lineTo(90, 600); ctx.lineTo(20, 600);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(380, 0); ctx.lineTo(430, 0); ctx.lineTo(360, 600); ctx.lineTo(310, 600);
      ctx.closePath(); ctx.fill();
      // Corals, left and right.
      ctx.strokeStyle = m.coral ? '#ff70a6' : '#ff8fa3';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(90, 540);
      ctx.quadraticCurveTo(70, 470, 92, 430);
      ctx.moveTo(90, 500);
      ctx.quadraticCurveTo(120, 460, 112, 420);
      ctx.moveTo(90, 500);
      ctx.quadraticCurveTo(60, 460, 66, 428);
      ctx.stroke();
      ctx.fillStyle = '#ff9e00';
      ctx.beginPath();
      ctx.moveTo(520, 540);
      ctx.quadraticCurveTo(540, 460, 505, 420);
      ctx.quadraticCurveTo(545, 460, 560, 540);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#e07b00';
      ctx.lineWidth = 3;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(522 + i * 9, 540);
        ctx.quadraticCurveTo(524 + i * 9, 490, 516 + i * 10, 448);
        ctx.stroke();
      }
      // Seaweed, right edge.
      ctx.strokeStyle = '#2a9d8f';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(570, 540);
      ctx.quadraticCurveTo(556, 430, 570, 330);
      ctx.stroke();
      if (!m.seaweed) {
        ctx.beginPath();
        ctx.moveTo(586, 540);
        ctx.quadraticCurveTo(600, 450, 588, 380);
        ctx.stroke();
      }
      // Turtle, centre.
      ctx.fillStyle = '#5a9e4b';
      ctx.beginPath();
      ctx.ellipse(250, 420, 52, 34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#7ec850';
      ctx.beginPath();
      ctx.ellipse(250, 414, 34, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      disc(ctx, 306, 414, 14, '#5a9e4b');
      disc(ctx, 310, 410, 2.5, '#10243a');
      ctx.fillStyle = '#5a9e4b';
      ctx.beginPath();
      ctx.ellipse(216, 448, 16, 7, 0.5, 0, Math.PI * 2);
      ctx.ellipse(216, 392, 16, 7, -0.5, 0, Math.PI * 2);
      ctx.fill();
      if (!m.turtle) {
        ctx.beginPath();
        ctx.ellipse(288, 448, 16, 7, -0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      // Fish.
      if (!m.fish) fish(ctx, 150, 150, 1, '#ffd93b', 1, '#f77f00');
      fish(ctx, 350, 330, 1.1, '#4cc9f0', -1, m.stripe ? null : '#2b2d42');
      fish(ctx, 460, 220, 0.85, '#c77dff', 1, '#7b2cbf');
      // Bubbles.
      bubble(ctx, 300, 200, 12);
      if (!m.bubble) bubble(ctx, 330, 130, 18);
      bubble(ctx, 360, 170, 8);
      bubble(ctx, 420, 300, 10);
      // Starfish on the sand (5 arms left, 4 right).
      ctx.fillStyle = '#ff8fa3';
      ctx.save();
      ctx.translate(470, 520);
      star(ctx, 0, 0, 30, 13, 5, '#ff8fa3');
      if (m.starfish) {
        ctx.fillStyle = '#e8d29a';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-6, -34); ctx.lineTo(8, -32);
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      // Shell.
      if (!m.shell) {
        ctx.fillStyle = '#fff3d6';
        ctx.beginPath();
        ctx.arc(540, 500, 20, Math.PI, 0);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#e0a458';
        ctx.lineWidth = 2;
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath();
          ctx.moveTo(540, 500);
          ctx.lineTo(540 + i * 8, 482);
          ctx.stroke();
        }
      }
    },
  },
  {
    id: 'space',
    name: 'Space Station',
    tagline: 'One small blink for a spaceman',
    timeLimit: 100,
    diffs: [
      { id: 'ring', x: 300, y: 180, r: 32, label: 'the planet ring' },
      { id: 'star', x: 520, y: 90, r: 24, label: 'the bright star' },
      { id: 'patch', x: 210, y: 400, r: 26, label: 'the suit patch' },
      { id: 'window', x: 430, y: 330, r: 26, label: 'the rocket window' },
      { id: 'dish', x: 520, y: 480, r: 28, label: 'the satellite dish' },
      { id: 'crater', x: 120, y: 500, r: 26, label: 'the moon crater' },
      { id: 'light', x: 380, y: 540, r: 24, label: 'the panel light' },
      { id: 'tether', x: 300, y: 460, r: 28, label: 'the tether cord' },
    ],
    draw(ctx, m) {
      // Deep space.
      ctx.fillStyle = '#0d1b3e';
      ctx.fillRect(0, 0, 600, 600);
      // Stars.
      const stars = [
        [60, 60, 2], [140, 40, 1.5], [220, 90, 2], [330, 50, 1.5], [420, 70, 2],
        [500, 140, 1.5], [80, 180, 1.5], [560, 220, 2], [40, 300, 2], [580, 330, 1.5],
        [160, 250, 1.5], [460, 260, 2], [90, 420, 1.5], [560, 420, 2], [240, 540, 1.5],
      ];
      for (const [sx, sy, sr] of stars) disc(ctx, sx, sy, sr, '#ffffff');
      if (!m.star) star(ctx, 520, 90, 12, 5, 4, '#fff3b0');
      // Ringed planet, top centre.
      disc(ctx, 300, 180, 62, '#e07a5f');
      disc(ctx, 278, 164, 22, '#f4a261');
      disc(ctx, 322, 200, 14, '#c96f4a');
      if (!m.ring) {
        ctx.strokeStyle = '#f4d35e';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.ellipse(300, 180, 104, 26, -0.35, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Moon, bottom left.
      disc(ctx, 120, 500, 46, '#e8e8e8');
      disc(ctx, 104, 488, 9, '#c9c9c9');
      disc(ctx, 136, 514, 12, '#c9c9c9');
      if (!m.crater) disc(ctx, 128, 484, 7, '#c9c9c9');
      // Rocket, right.
      ctx.fillStyle = '#e8e8e8';
      ctx.beginPath();
      ctx.moveTo(430, 280);
      ctx.quadraticCurveTo(414, 320, 414, 360);
      ctx.lineTo(446, 360);
      ctx.quadraticCurveTo(446, 320, 430, 280);
      ctx.fill();
      ctx.fillStyle = '#e63946';
      ctx.beginPath();
      ctx.moveTo(430, 280);
      ctx.quadraticCurveTo(420, 300, 418, 312);
      ctx.lineTo(442, 312);
      ctx.quadraticCurveTo(440, 300, 430, 280);
      ctx.fill();
      ctx.fillStyle = '#457b9d';
      disc(ctx, 430, 330, m.window ? 9 : 13, '#457b9d');
      ctx.fillStyle = '#fff3b0';
      disc(ctx, 430, 330, 4, '#fff3b0');
      ctx.fillStyle = '#e63946';
      ctx.beginPath();
      ctx.moveTo(414, 360); ctx.lineTo(398, 392); ctx.lineTo(414, 380);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(446, 360); ctx.lineTo(462, 392); ctx.lineTo(446, 380);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffb703';
      ctx.beginPath();
      ctx.moveTo(422, 360); ctx.lineTo(438, 360); ctx.lineTo(434, 392); ctx.lineTo(426, 392);
      ctx.closePath(); ctx.fill();
      // Astronaut, centre left.
      ctx.fillStyle = '#f1faee';
      rr(ctx, 180, 370, 62, 74, 22);
      ctx.fill();
      disc(ctx, 211, 348, 26, '#f1faee');
      disc(ctx, 211, 348, 18, '#457b9d');
      disc(ctx, 218, 342, 5, '#ffffff');
      ctx.fillStyle = '#e63946';
      rr(ctx, 196, 392, 30, 16, 4);
      ctx.fill();
      if (!m.patch) {
        ctx.fillStyle = '#ffd93b';
        star(ctx, 211, 400, 7, 3, 5, '#ffd93b');
      }
      ctx.strokeStyle = '#f1faee';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(186, 392); ctx.lineTo(164, 420);
      ctx.moveTo(236, 392); ctx.lineTo(258, 420);
      ctx.stroke();
      ctx.strokeStyle = '#c9c9c9';
      ctx.lineWidth = 3;
      if (!m.tether) {
        ctx.beginPath();
        ctx.moveTo(240, 440);
        ctx.quadraticCurveTo(300, 470, 330, 450);
        ctx.stroke();
      }
      // Satellite, bottom right.
      ctx.fillStyle = '#8d99ae';
      ctx.fillRect(500, 460, 44, 26);
      ctx.fillStyle = '#457b9d';
      ctx.fillRect(462, 466, 34, 14);
      ctx.fillRect(548, 466, 34, 14);
      ctx.strokeStyle = '#8d99ae';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(522, 460); ctx.lineTo(522, 442);
      ctx.stroke();
      ctx.fillStyle = '#e8e8e8';
      ctx.beginPath();
      if (m.dish) ctx.arc(522, 436, 14, 0, Math.PI);
      else ctx.arc(522, 436, 14, Math.PI, 0);
      ctx.closePath(); ctx.fill();
      // Control panel, bottom centre.
      ctx.fillStyle = '#2b2d42';
      rr(ctx, 330, 520, 110, 56, 8);
      ctx.fill();
      disc(ctx, 352, 540, 7, '#2a9d8f');
      disc(ctx, 380, 540, 7, m.light ? '#e63946' : '#2a9d8f');
      disc(ctx, 408, 540, 7, '#ffd93b');
      ctx.fillStyle = '#457b9d';
      ctx.fillRect(348, 556, 74, 8);
    },
  },
  {
    id: 'library',
    name: "Wizard's Library",
    tagline: 'Shh — the owl is watching',
    timeLimit: 110,
    diffs: [
      { id: 'owl', x: 500, y: 150, r: 28, label: 'the owl eyes' },
      { id: 'candle', x: 120, y: 380, r: 26, label: 'the lit candle' },
      { id: 'potion', x: 330, y: 470, r: 26, label: 'the potion colour' },
      { id: 'book', x: 250, y: 180, r: 26, label: 'the missing book' },
      { id: 'catTail', x: 470, y: 500, r: 28, label: 'the cat tail' },
      { id: 'hatStar', x: 300, y: 90, r: 26, label: 'the hat star' },
      { id: 'moon', x: 90, y: 110, r: 28, label: 'the moon phase' },
      { id: 'ribbon', x: 420, y: 470, r: 26, label: 'the scroll ribbon' },
      { id: 'diamond', x: 300, y: 550, r: 26, label: 'the rug diamond' },
    ],
    draw(ctx, m) {
      // Walls and floor.
      ctx.fillStyle = '#4a3226';
      ctx.fillRect(0, 0, 600, 430);
      ctx.fillStyle = '#6b4a2f';
      ctx.fillRect(0, 430, 600, 170);
      ctx.fillStyle = '#5b3d26';
      for (let i = 0; i < 5; i++) ctx.fillRect(0, 452 + i * 30, 600, 3);
      // Window with moon, top left.
      ctx.fillStyle = '#1d2b53';
      rr(ctx, 56, 70, 110, 130, 8);
      ctx.fill();
      if (m.moon) {
        disc(ctx, 111, 122, 26, '#fff3b0');
      } else {
        disc(ctx, 111, 122, 26, '#fff3b0');
        disc(ctx, 124, 116, 22, '#1d2b53');
      }
      star(ctx, 80, 92, 6, 2.5, 4, '#ffffff');
      star(ctx, 146, 176, 5, 2, 4, '#ffffff');
      ctx.strokeStyle = '#8a5a2b';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(111, 70); ctx.lineTo(111, 200);
      ctx.moveTo(56, 135); ctx.lineTo(166, 135);
      ctx.stroke();
      // Bookshelves, centre and right.
      ctx.fillStyle = '#8a5a2b';
      ctx.fillRect(200, 60, 200, 300);
      ctx.fillStyle = '#6b4423';
      ctx.fillRect(200, 60, 200, 12);
      ctx.fillRect(200, 348, 200, 12);
      const shelfCols = ['#e63946', '#457b9d', '#2a9d8f', '#f4a261', '#c77dff', '#e9c46a'];
      for (let row = 0; row < 3; row++) {
        const y = 92 + row * 86;
        for (let i = 0; i < 7; i++) {
          if (row === 1 && i === 3 && m.book) continue;
          const bx = 212 + i * 26;
          book(ctx, bx, y, 20, 62, shelfCols[(row * 7 + i) % 6], i % 3 === 0 ? '#fff3b0' : null);
        }
        ctx.fillStyle = '#6b4423';
        ctx.fillRect(200, y + 66, 200, 8);
      }
      // Wizard hat on a hook, top centre.
      ctx.fillStyle = '#5a189a';
      ctx.beginPath();
      ctx.moveTo(300, 30);
      ctx.quadraticCurveTo(286, 70, 282, 92);
      ctx.lineTo(318, 92);
      ctx.quadraticCurveTo(312, 66, 300, 30);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(300, 94, 42, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      if (!m.hatStar) star(ctx, 300, 66, 9, 4, 5, '#ffd93b');
      // Owl on the right shelf top.
      ctx.fillStyle = '#8d6e4a';
      ctx.beginPath();
      ctx.ellipse(500, 150, 30, 38, 0, 0, Math.PI * 2);
      ctx.fill();
      disc(ctx, 478, 128, 10, '#8d6e4a');
      disc(ctx, 522, 128, 10, '#8d6e4a');
      if (m.owl) {
        ctx.strokeStyle = '#2b2d42';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(492, 148); ctx.quadraticCurveTo(497, 152, 502, 148);
        ctx.moveTo(512, 148); ctx.quadraticCurveTo(517, 152, 522, 148);
        ctx.stroke();
      } else {
        disc(ctx, 497, 148, 5, '#ffd93b');
        disc(ctx, 517, 148, 5, '#ffd93b');
        disc(ctx, 497, 148, 2.5, '#2b2d42');
        disc(ctx, 517, 148, 2.5, '#2b2d42');
      }
      ctx.fillStyle = '#f77f00';
      ctx.beginPath();
      ctx.moveTo(507, 158); ctx.lineTo(514, 158); ctx.lineTo(510, 166);
      ctx.closePath(); ctx.fill();
      // Table with candles, potions, scrolls.
      ctx.fillStyle = '#7a5c3e';
      rr(ctx, 80, 440, 440, 26, 6);
      ctx.fill();
      ctx.fillStyle = '#5b4632';
      ctx.fillRect(96, 466, 14, 90);
      ctx.fillRect(490, 466, 14, 90);
      candle(ctx, 120, 440, 52, !m.candle);
      candle(ctx, 180, 440, 38, true, '#ff8fa3');
      // Potion bottles.
      ctx.fillStyle = m.potion ? '#7b2cbf' : '#2a9d8f';
      rr(ctx, 316, 396, 28, 44, 8);
      ctx.fill();
      ctx.fillStyle = '#e9c46a';
      ctx.fillRect(324, 388, 12, 10);
      ctx.fillStyle = '#e63946';
      rr(ctx, 352, 406, 24, 34, 7);
      ctx.fill();
      ctx.fillStyle = '#e9c46a';
      ctx.fillRect(359, 398, 10, 10);
      // Scrolls.
      ctx.fillStyle = '#f6e7c8';
      rr(ctx, 400, 408, 60, 20, 9);
      ctx.fill();
      ctx.fillStyle = m.ribbon ? '#457b9d' : '#e63946';
      ctx.fillRect(426, 408, 10, 20);
      ctx.fillStyle = '#f6e7c8';
      rr(ctx, 400, 432, 44, 16, 8);
      ctx.fill();
      // Rug with diamond pattern.
      ctx.fillStyle = '#7b2cbf';
      rr(ctx, 180, 520, 240, 60, 12);
      ctx.fill();
      ctx.fillStyle = '#ffd93b';
      ctx.save();
      ctx.translate(300, 550);
      ctx.rotate(Math.PI / 4);
      if (!m.diamond) ctx.fillRect(-14, -14, 28, 28);
      ctx.restore();
      ctx.fillStyle = '#9d4edd';
      ctx.fillRect(210, 542, 40, 16);
      ctx.fillRect(350, 542, 40, 16);
      // Black cat on the rug, right.
      ctx.fillStyle = '#2b2d42';
      ctx.beginPath();
      ctx.ellipse(470, 500, 46, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      disc(ctx, 512, 488, 18, '#2b2d42');
      ctx.beginPath();
      ctx.moveTo(500, 474); ctx.lineTo(496, 460); ctx.lineTo(508, 470);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(520, 472); ctx.lineTo(524, 458); ctx.lineTo(530, 472);
      ctx.closePath(); ctx.fill();
      disc(ctx, 516, 486, 3, '#2a9d8f');
      disc(ctx, 506, 486, 3, '#2a9d8f');
      ctx.strokeStyle = '#2b2d42';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (m.catTail) {
        ctx.moveTo(428, 506); ctx.quadraticCurveTo(412, 480, 428, 462);
      } else {
        ctx.moveTo(428, 506); ctx.quadraticCurveTo(408, 516, 392, 506);
      }
      ctx.stroke();
    },
  },
];

