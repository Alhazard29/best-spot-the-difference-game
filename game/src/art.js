// SPOTLIGHT — shared drawing helpers.
// Every helper draws in scene space (one panel is 600 x 600) with the
// context already translated to the panel's top-left corner. Nothing here
// knows about differences: scenes compose these pieces and switch small
// details on and off through their own `mods` maps.

export function rr(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export function disc(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function ring(ctx, x, y, r, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

export function star(ctx, cx, cy, rOuter, rInner, points, fill, rotation = -Math.PI / 2) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = rotation + (i * Math.PI) / points;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

export function cloud(ctx, x, y, s, fill = '#ffffff') {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, 22 * s, 0, Math.PI * 2);
  ctx.arc(x + 24 * s, y - 10 * s, 26 * s, 0, Math.PI * 2);
  ctx.arc(x + 52 * s, y, 22 * s, 0, Math.PI * 2);
  ctx.arc(x + 26 * s, y + 8 * s, 24 * s, 0, Math.PI * 2);
  ctx.fill();
}

export function sun(ctx, x, y, r, rays = 8, core = '#ffd93b', rayColor = '#ffb703') {
  ctx.strokeStyle = rayColor;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * (r + 8), y + Math.sin(a) * (r + 8));
    ctx.lineTo(x + Math.cos(a) * (r + 22), y + Math.sin(a) * (r + 22));
    ctx.stroke();
  }
  disc(ctx, x, y, r, core);
  disc(ctx, x - r * 0.3, y - r * 0.3, r * 0.55, 'rgba(255,255,255,0.45)');
}

export function flower(ctx, x, y, s, petal, center = '#ffcf3f') {
  ctx.fillStyle = petal;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(a) * 9 * s, y + Math.sin(a) * 9 * s, 8 * s, 5 * s, a, 0, Math.PI * 2);
    ctx.fill();
  }
  disc(ctx, x, y, 6 * s, center);
}

export function tree(ctx, x, y, s, trunk = '#8a5a2b', leaf = '#3f9e4d', leaf2 = '#57b25e') {
  ctx.fillStyle = trunk;
  ctx.fillRect(x - 9 * s, y - 60 * s, 18 * s, 62 * s);
  ctx.beginPath();
  ctx.moveTo(x - 9 * s, y - 58 * s);
  ctx.lineTo(x - 26 * s, y - 96 * s);
  ctx.lineTo(x - 4 * s, y - 84 * s);
  ctx.closePath();
  ctx.fill();
  disc(ctx, x, y - 118 * s, 44 * s, leaf);
  disc(ctx, x - 34 * s, y - 92 * s, 30 * s, leaf2);
  disc(ctx, x + 34 * s, y - 92 * s, 30 * s, leaf);
  disc(ctx, x, y - 84 * s, 32 * s, leaf2);
}

export function fish(ctx, x, y, s, body, dir = 1, stripe = null) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir, 1);
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(0, 0, 30 * s, 16 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-26 * s, 0);
  ctx.lineTo(-44 * s, -14 * s);
  ctx.lineTo(-44 * s, 14 * s);
  ctx.closePath();
  ctx.fill();
  if (stripe) {
    ctx.strokeStyle = stripe;
    ctx.lineWidth = 4 * s;
    ctx.beginPath();
    ctx.arc(2 * s, 0, 12 * s, -1.1, 1.1);
    ctx.stroke();
  }
  disc(ctx, 16 * s, -4 * s, 3.2 * s, '#10243a');
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(17 * s, -5 * s, 1.2 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function book(ctx, x, y, w, h, color, band = null) {
  ctx.fillStyle = color;
  rr(ctx, x, y, w, h, 3);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillRect(x + w - 5, y + 3, 2, h - 6);
  if (band) {
    ctx.fillStyle = band;
    ctx.fillRect(x, y + h * 0.45, w - 4, 6);
  }
}

export function candle(ctx, x, y, h, lit, wax = '#fff3d6') {
  ctx.fillStyle = wax;
  rr(ctx, x - 6, y - h, 12, h, 4);
  ctx.fill();
  ctx.fillStyle = '#d9a441';
  ctx.fillRect(x - 10, y - 3, 20, 5);
  if (lit) {
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.ellipse(x, y - h - 12, 5, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff3b0';
    ctx.beginPath();
    ctx.ellipse(x, y - h - 10, 2.5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.strokeStyle = '#5b5346';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - h);
    ctx.quadraticCurveTo(x + 3, y - h - 6, x + 6, y - h - 4);
    ctx.stroke();
  }
}

export function bubble(ctx, x, y, r) {
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.22, 0, Math.PI * 2);
  ctx.fill();
}

export function bird(ctx, x, y, s, color = '#2b2d42') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 14 * s, y);
  ctx.quadraticCurveTo(x - 5 * s, y - 10 * s, x, y);
  ctx.quadraticCurveTo(x + 5 * s, y - 10 * s, x + 14 * s, y);
  ctx.stroke();
}

export function butterfly(ctx, x, y, s, wing, body = '#3a2e2a') {
  ctx.fillStyle = wing;
  ctx.beginPath();
  ctx.ellipse(x - 9 * s, y - 6 * s, 10 * s, 13 * s, -0.5, 0, Math.PI * 2);
  ctx.ellipse(x + 9 * s, y - 6 * s, 10 * s, 13 * s, 0.5, 0, Math.PI * 2);
  ctx.ellipse(x - 7 * s, y + 9 * s, 7 * s, 9 * s, 0.4, 0, Math.PI * 2);
  ctx.ellipse(x + 7 * s, y + 9 * s, 7 * s, 9 * s, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(x, y, 3.5 * s, 11 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}
