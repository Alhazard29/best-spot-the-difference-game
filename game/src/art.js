// Shared drawing helpers for SPOTLIGHT scenes.
// Every helper paints with the current fill/stroke styles it is given
// (or its own colours) and never touches the rest of the canvas.

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
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) ctx.fill();
  else ctx.stroke();
}

export function ring(ctx, x, y, r, w, stroke) {
  ctx.save();
  ctx.lineWidth = w;
  ctx.strokeStyle = stroke;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function star(ctx, x, y, r, fill, points) {
  const n = points || 5;
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (Math.PI * i) / n - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  if (fill) ctx.fill();
  else ctx.stroke();
}

export function cloud(ctx, x, y, s, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, 22 * s, 0, Math.PI * 2);
  ctx.arc(x + 24 * s, y + 6 * s, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 48 * s, y, 20 * s, 0, Math.PI * 2);
  ctx.arc(x + 24 * s, y + 12 * s, 20 * s, 0, Math.PI * 2);
  ctx.fill();
}

export function sun(ctx, x, y, r) {
  ctx.save();
  ctx.strokeStyle = '#f6b73c';
  ctx.lineWidth = 4;
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * i) / 12;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * (r + 6), y + Math.sin(a) * (r + 6));
    ctx.lineTo(x + Math.cos(a) * (r + 18), y + Math.sin(a) * (r + 18));
    ctx.stroke();
  }
  ctx.fillStyle = '#ffd94d';
  disc(ctx, x, y, r, true);
  ctx.fillStyle = '#fff3c4';
  disc(ctx, x - r * 0.25, y - r * 0.25, r * 0.45, true);
  ctx.restore();
}

export function flower(ctx, x, y, s, petal, center) {
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    disc(ctx, x + Math.cos(a) * 9 * s, y + Math.sin(a) * 9 * s, 7 * s, true);
  }
  ctx.fillStyle = center;
  disc(ctx, x, y, 6 * s, true);
}

export function tree(ctx, x, y, s) {
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(x - 6 * s, y, 12 * s, 52 * s);
  ctx.fillStyle = '#3f9e4d';
  disc(ctx, x, y - 12 * s, 34 * s, true);
  disc(ctx, x - 24 * s, y + 6 * s, 22 * s, true);
  disc(ctx, x + 24 * s, y + 6 * s, 22 * s, true);
  ctx.fillStyle = '#57c785';
  disc(ctx, x - 12 * s, y - 26 * s, 14 * s, true);
  disc(ctx, x + 14 * s, y - 18 * s, 12 * s, true);
}

export function fish(ctx, x, y, s, color, flip) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, 26 * s, 14 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-22 * s, 0);
  ctx.lineTo(-36 * s, -12 * s);
  ctx.lineTo(-36 * s, 12 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#10233f';
  disc(ctx, 12 * s, -3 * s, 3 * s, true);
  ctx.restore();
}

export function bird(ctx, x, y, s) {
  ctx.fillStyle = '#3d7bd6';
  ctx.beginPath();
  ctx.ellipse(x, y, 16 * s, 10 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  disc(ctx, x + 13 * s, y - 7 * s, 7 * s, true);
  ctx.fillStyle = '#f6b73c';
  ctx.beginPath();
  ctx.moveTo(x + 19 * s, y - 8 * s);
  ctx.lineTo(x + 27 * s, y - 5 * s);
  ctx.lineTo(x + 19 * s, y - 3 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#10233f';
  disc(ctx, x + 15 * s, y - 9 * s, 1.8 * s, true);
  ctx.fillStyle = '#2f6bc2';
  ctx.beginPath();
  ctx.ellipse(x - 2 * s, y - 8 * s, 12 * s, 5 * s, -0.5, 0, Math.PI * 2);
  ctx.fill();
}

export function book(ctx, x, y, w, h, cover, pages) {
  ctx.fillStyle = cover;
  rr(ctx, x, y, w, h, 3);
  ctx.fill();
  ctx.fillStyle = pages;
  ctx.fillRect(x + w - 8, y + 4, 5, h - 8);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(x + 4, y + 6, 3, h - 12);
}

export function candle(ctx, x, y, s, lit) {
  ctx.fillStyle = '#f4efe4';
  rr(ctx, x - 5 * s, y, 10 * s, 34 * s, 3);
  ctx.fill();
  ctx.fillStyle = '#d9a441';
  ctx.fillRect(x - 8 * s, y + 34 * s, 16 * s, 4 * s);
  if (lit) {
    ctx.fillStyle = '#ff9d2e';
    ctx.beginPath();
    ctx.ellipse(x, y - 10 * s, 5 * s, 9 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffe9a8';
    ctx.beginPath();
    ctx.ellipse(x, y - 7 * s, 2.5 * s, 5 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function bubble(ctx, x, y, r) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 2;
  disc(ctx, x, y, r, false);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  disc(ctx, x - r * 0.35, y - r * 0.35, r * 0.2, true);
  ctx.restore();
}

export function butterfly(ctx, x, y, s, c1, c2) {
  ctx.fillStyle = c1;
  ctx.beginPath();
  ctx.ellipse(x - 10 * s, y - 6 * s, 11 * s, 8 * s, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x - 10 * s, y + 7 * s, 9 * s, 6 * s, 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = c2;
  ctx.beginPath();
  ctx.ellipse(x + 10 * s, y - 6 * s, 11 * s, 8 * s, 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 10 * s, y + 7 * s, 9 * s, 6 * s, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2b2118';
  ctx.fillRect(x - 2 * s, y - 10 * s, 4 * s, 20 * s);
}
