/* Among the Microbes – Pixel Backgrounds
 * วาดฉากพิกเซลอาร์ตด้วยโค้ด (ไม่ต้องใช้ไฟล์รูป) ความสูงตรรกะคงที่ 180px
 * ความกว้างปรับตามสัดส่วนหน้าจอ จึงไม่ยืด ไม่เบี้ยว ไม่ถูกตัดบนทุกอุปกรณ์
 */
(function () {
  const H = 180;
  const NAMES = {
    gut: 'ลำไส้',
    skin: 'ผิวหนัง',
    urinary: 'ทางเดินปัสสาวะ',
    respiratory: 'ทางเดินหายใจ',
    soil: 'ดินและสิ่งแวดล้อม',
    farm: 'ฟาร์มเลี้ยงสัตว์',
    sewer: 'น้ำเสีย/ท่อระบายน้ำ',
    water: 'แม่น้ำและทะเล',
    ward: 'หอผู้ป่วยทั่วไป',
    icu: 'หอผู้ป่วยวิกฤต (ICU)',
  };

  /* ---------- เครื่องมือวาด ---------- */
  function rng(s) {
    return function () {
      s |= 0; s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const hx = (c) => [1, 3, 5].map((i) => parseInt(c.substr(i, 2), 16));
  const mix = (a, b, t) => {
    const A = hx(a), B = hx(b);
    return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * t)).join() + ')';
  };
  function kit(g, W, r) {
    const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
    const grad = (y0, y1, c0, c1, n = 8) => {
      const h = (y1 - y0) / n;
      for (let i = 0; i < n; i++) R(0, y0 + i * h, W, h + 1, mix(c0, c1, i / (n - 1)));
    };
    const dot = (x, y, c) => R(x, y, 1, 1, c);
    const speck = (x, y, w, h, n, cols) => { for (let i = 0; i < n; i++) dot(x + r() * w, y + r() * h, cols[(r() * cols.length) | 0]); };
    const circ = (cx, cy, rad, c) => {
      for (let y = -rad; y <= rad; y++) {
        const d = Math.round(Math.sqrt(rad * rad - y * y));
        R(cx - d, cy + y, d * 2 + 1, 1, c);
      }
    };
    const line = (x0, y0, x1, y1, t, c) => {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
      for (let i = 0; i <= n; i++) R(x0 + ((x1 - x0) * i) / n - t / 2, y0 + ((y1 - y0) * i) / n - t / 2, t, t, c);
    };
    const cloud = (x, y) => { R(x, y, 26, 6, '#fff'); R(x + 5, y - 4, 14, 5, '#fff'); R(x + 2, y + 6, 20, 2, '#e4f2fa'); };
    const glow = (x, y, rad, c, a) => { g.globalAlpha = a; circ(x, y, rad, c); circ(x, y, rad * 0.65, c); g.globalAlpha = 1; };
    return { g, R, grad, dot, speck, circ, line, cloud, glow };
  }

  const SCENES = {};

  /* ---------- 1. ลำไส้ ---------- */
  SCENES.gut = (k, W, H, r) => {
    const { R, grad, speck, circ, glow } = k;
    grad(0, H, '#4a0f24', '#8a2a40', 12);
    speck(0, 0, W, H, W * 3, ['#6a1a30', '#a03a52', '#3a0a1c']);
    for (let x = -4; x < W; x += 6) { const h = 24 + r() * 10; R(x, 0, 5, h, '#7a2038'); R(x, H - h, 5, h, '#7a2038'); }
    glow(W / 2, H / 2, 60, '#ff9ab0', 0.12);
    for (let i = 0; i < W / 40; i++) {
      const x = r() * W, y = 60 + r() * 60, s = 2 + ((r() * 3) | 0);
      circ(x, y, s, '#b9a24c'); circ(x - 1, y - 1, s >> 1, '#e6d27a');
    }
    for (let x = 0; x < W; x += 9) {
      const h = 14 + r() * 14;
      [0, 1].forEach((top) => {
        const y = top ? 0 : H - h;
        R(x, y, 7, h, '#d9667a'); R(x + 1, y, 2, h, '#f2a0ae'); R(x + 6, y, 1, h, '#a8435a');
        R(x + 1, top ? h : y - 1, 5, 1, '#d9667a');
      });
    }
    return { parts: { n: 28, cols: ['#f6c9d0', '#ffe9a8'], vx: 0.15, vy: -0.1, sway: 3 } };
  };

  /* ---------- 2. ผิวหนัง ---------- */
  SCENES.skin = (k, W, H, r) => {
    const { R, grad, speck, circ, line } = k;
    const sy = 52;
    grad(0, sy + 4, '#f7e3cf', '#f0cfae', 6);
    for (let x = 0; x < W; x++) { const y = sy + Math.round(Math.sin(x / 9) * 1.5); R(x, y, 1, 4, '#f4d3b3'); }
    R(0, sy + 4, W, 26, '#e9b48c');
    for (let y = sy + 8, row = 0; y < sy + 30; y += 6, row++) for (let x = (row % 2) * 4; x < W; x += 8) R(x, y, 1, 6, '#d99d74');
    const dy = (H * 0.78) | 0;
    grad(sy + 30, dy, '#e8a094', '#d9847e', 6);
    speck(0, sy + 30, W, dy - sy - 30, W * 2, ['#f0b4a8', '#c8706c']);
    R(0, dy, W, H - dy, '#f3d98a');
    for (let x = 0; x < W + 14; x += 14) for (let y = dy + 5; y < H + 8; y += 12) {
      const ox = ((y - dy) / 12) % 2 ? 7 : 0;
      circ(x + ox, y, 6, '#e6c05c'); circ(x + ox, y, 5, '#fbe9a8');
    }
    for (let x = 0; x < W; x++) { const y = Math.round(H * 0.55 + Math.sin(x / 14) * 4); R(x, y, 1, 3, '#b8323a'); R(x, y, 1, 1, '#e0606a'); }
    const fx = Math.round(W * 0.3);
    line(fx, sy + 2, fx, H * 0.68, 5, '#c98a6a');
    line(fx, sy - 24, fx, H * 0.68, 2, '#3b2616');
    circ(fx, H * 0.7, 8, '#b86a5a'); circ(fx, H * 0.7, 4, '#3b2616');
    const gx = Math.round(W * 0.72);
    R(gx - 1, sy + 1, 3, 3, '#b86a5a');
    for (let y = sy + 4, i = 0; y < H * 0.62; y++, i++) R(gx + Math.round(Math.sin(i / 3) * 2), y, 2, 1, '#b86a7a');
    circ(gx, H * 0.68, 8, '#b86a7a'); circ(gx, H * 0.68, 5, '#e8a0a8'); circ(gx, H * 0.68, 2, '#b86a7a');
    for (let x = 6; x < W; x += 16 + ((r() * 10) | 0)) {
      const h = 14 + r() * 14, lean = (r() - 0.5) * 8;
      line(x, sy, x + lean, sy - h, 1, '#3b2616');
    }
    return { parts: { n: 14, cols: ['#fff6e8'], vx: 0.05, vy: -0.05, sway: 2 } };
  };

  /* ---------- 3. ทางเดินปัสสาวะ ---------- */
  SCENES.urinary = (k, W, H, r) => {
    const { R, grad, circ, g } = k;
    const t = 46, b = H - 46;
    grad(t, b, '#fbe98a', '#e0b23a', 9);
    g.globalAlpha = 0.18;
    for (let x = -40; x < W; x += 34) for (let i = 0; i < 6; i++) R(x + i * 6, t + i * 14, 14, 3, '#fff');
    g.globalAlpha = 1;
    [1, 0].forEach((top) => {
      const y0 = top ? 0 : b;
      R(0, y0, W, 46, '#cf8052');
      for (let row = 0; row < 8; row++) for (let x = (row % 2) * 6 - 6; x < W; x += 12) {
        const edge = top ? row === 7 : row === 0;
        R(x, y0 + row * 6, 11, 5, edge ? '#a8603a' : r() < 0.5 ? '#e29a68' : '#d88c5c');
      }
    });
    for (let i = 0; i < W / 50; i++) {
      const x = r() * W, y = b - 3;
      R(x, y, 3, 3, '#fffbe8'); R(x + 1, y - 2, 1, 2, '#fffbe8'); R(x + 1, y + 3, 1, 1, '#c8b890');
    }
    return { parts: { n: 30, cols: ['#fffbe0', '#fff4b0'], vx: 0.25, vy: -0.25, sway: 3, band: [t, b] } };
  };

  /* ---------- 4. ทางเดินหายใจ ---------- */
  SCENES.respiratory = (k, W, H, r) => {
    const { R, grad, speck, circ, line } = k;
    grad(0, H, '#1a2547', '#3b3a6b', 10);
    speck(0, 0, W, H, W, ['#2a3560', '#4a4a80']);
    const alv = (x, y) => {
      [[0, 0], [-5, 3], [5, 3], [0, 6]].forEach(([dx, dy]) => { circ(x + dx, y + dy, 5, '#e87a8e'); circ(x + dx - 1, y + dy - 1, 2, '#ffb0bc'); });
    };
    for (let x = 8; x < W; x += 24) alv(x, H - 14 - ((r() * 6) | 0));
    const cx = W >> 1, L = Math.min(W, 320) / 6;
    const branch = (x, y, a, len, th, d) => {
      const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
      line(x, y, x2, y2, th, '#e9a3ab'); line(x, y, x2, y2, Math.max(1, th - 2), '#f6c4c8');
      if (!d) { alv(x2, y2); return; }
      branch(x2, y2, a - 0.55 - r() * 0.2, len * 0.74, Math.max(2, th - 1), d - 1);
      branch(x2, y2, a + 0.55 + r() * 0.2, len * 0.74, Math.max(2, th - 1), d - 1);
    };
    R(cx - 7, 0, 14, 42, '#e9a3ab'); R(cx - 4, 0, 8, 42, '#f6c4c8');
    for (let y = 3; y < 42; y += 6) R(cx - 7, y, 14, 2, '#c8808a');
    branch(cx, 42, Math.PI / 2 - 0.85, L, 7, 3);
    branch(cx, 42, Math.PI / 2 + 0.85, L, 7, 3);
    return { parts: { n: 24, cols: ['#cfe8ff', '#ffffff'], vx: 0.05, vy: 0.25, sway: 4 } };
  };

  /* ---------- 5. ดินและสิ่งแวดล้อม ---------- */
  SCENES.soil = (k, W, H, r) => {
    const { R, grad, speck, circ, line, cloud } = k;
    const gy = 48;
    grad(0, gy, '#7fcdf0', '#d6f0f2', 6);
    for (let i = 0; i < Math.ceil(W / 90); i++) cloud(i * 90 + r() * 40, 10 + r() * 14);
    grad(gy, H, '#7b5232', '#2f1d10', 12);
    speck(0, gy, W, H - gy, W * 5, ['#5a3a20', '#94683f', '#3a2412']);
    for (let i = 0; i < W / 18; i++) {
      const x = r() * W, y = gy + 16 + r() * (H - gy - 24), s = 2 + ((r() * 4) | 0);
      circ(x, y, s, '#8a8478'); circ(x - 1, y - 1, s >> 1, '#b5ae9e');
    }
    for (let x = 10; x < W; x += 26) {
      let px = x;
      const depth = 30 + r() * 50;
      for (let y = gy; y < gy + depth; y++) { px += (r() - 0.5) * 1.6; R(px, y, 1, 1, '#c9a06a'); if (r() < 0.04) line(px, y, px + (r() - 0.5) * 14, y + 6, 1, '#b08a58'); }
    }
    for (let i = 0; i < W / 70; i++) {
      const x = r() * (W - 30), y = gy + 24 + r() * (H - gy - 40);
      for (let j = 0; j < 24; j++) R(x + j, y + Math.round(Math.sin(j / 2) * 2), 2, 2, '#e59aa4');
    }
    R(0, gy - 3, W, 5, '#4fa83a');
    for (let x = 0; x < W; x += 3) R(x, gy - 3 - ((r() * 4) | 0), 1, 3, '#6cc94e');
    for (let x = 14; x < W; x += 40 + ((r() * 30) | 0)) { R(x, gy - 12, 1, 9, '#3f8a2e'); R(x - 3, gy - 12, 3, 2, '#6cc94e'); R(x + 1, gy - 10, 3, 2, '#6cc94e'); }
    return { parts: { n: 16, cols: ['#d8c8a0', '#fff'], vx: 0.1, vy: 0, sway: 2, band: [0, gy - 4] } };
  };

  /* ---------- 6. ฟาร์มเลี้ยงสัตว์ ---------- */
  SCENES.farm = (k, W, H, r) => {
    const { R, grad, circ, speck, cloud } = k;
    const gy = 112;
    grad(0, gy, '#6fc3f0', '#fbe6b8', 9);
    circ(W * 0.2, 30, 12, '#fff3a0'); circ(W * 0.2, 30, 9, '#ffe45c');
    for (let i = 0; i < Math.ceil(W / 110); i++) cloud(i * 110 + 40 + r() * 30, 14 + r() * 22);
    for (let x = 0; x < W; x++) {
      R(x, gy - 24 + Math.round(Math.sin(x / 40) * 8 + Math.sin(x / 17) * 3), 1, 40, '#5fa24a');
      R(x, gy - 10 + Math.round(Math.sin(x / 28 + 2) * 5), 1, 30, '#4a8a3c');
    }
    grad(gy, H, '#6cb84a', '#3f8a34', 8);
    speck(0, gy, W, H - gy, W * 2, ['#7ccc58', '#2f7a2c']);
    const bx = Math.round(W * 0.62), by = gy - 40;
    R(bx - 22, by - 6, 16, 54, '#c8ccd0'); R(bx - 22, by - 6, 3, 54, '#e4e8ec'); R(bx - 24, by - 10, 20, 4, '#9aa0a6'); R(bx - 20, by - 14, 12, 4, '#9aa0a6');
    R(bx, by + 8, 50, 40, '#b8362e');
    for (let i = 0; i < 14; i++) R(bx - 3 + 2 * i, by + 8 - i, 56 - 4 * i, 1, '#8a2620');
    R(bx + 17, by + 26, 16, 22, '#f3e6d0');
    for (let i = 0; i < 16; i++) { R(bx + 17 + i, by + 26 + Math.round(i * 1.35), 1, 1, '#b8362e'); R(bx + 33 - i, by + 26 + Math.round(i * 1.35), 1, 1, '#b8362e'); }
    for (let x = 4; x < W; x += 14) R(x, gy + 4, 2, 14, '#8a5a30');
    R(0, gy + 8, W, 2, '#a87040'); R(0, gy + 13, W, 2, '#a87040');
    const cow = (x, y) => {
      R(x, y, 18, 9, '#f6f6f0'); R(x + 3, y + 1, 5, 4, '#222'); R(x + 11, y + 4, 4, 4, '#222');
      R(x - 5, y + 1, 6, 6, '#f6f6f0'); R(x - 5, y + 4, 6, 3, '#f0a8a8'); R(x - 3, y + 2, 1, 1, '#222');
      R(x + 2, y + 9, 2, 5, '#d8d8d0'); R(x + 13, y + 9, 2, 5, '#d8d8d0'); R(x + 18, y + 1, 1, 6, '#222');
    };
    cow(W * 0.18, H - 40); cow(W * 0.42, H - 26);
    const px = Math.round(W * 0.8), py = H - 22;
    R(px, py, 14, 8, '#f4a8b4'); R(px + 12, py + 1, 5, 5, '#f4a8b4'); R(px + 16, py + 3, 2, 2, '#d8808c'); R(px + 2, py + 8, 2, 4, '#d8808c'); R(px + 10, py + 8, 2, 4, '#d8808c');
    R(W * 0.55, H - 12, 22, 5, '#7a5230');
    return { parts: { n: 8, cols: ['#2a2a2a'], vx: 0.3, vy: 0, sway: 6, band: [gy - 10, H] } };
  };

  /* ---------- 7. น้ำเสีย/ท่อระบายน้ำ ---------- */
  SCENES.sewer = (k, W, H, r) => {
    const { R, grad, speck, circ, g } = k;
    grad(0, H, '#2a403c', '#1a2a28', 8);
    const cols = ['#35504a', '#2f4842', '#3a5650'];
    for (let row = 0; row * 8 < H - 54; row++) for (let x = (row % 2) * 8 - 8; x < W; x += 16) R(x, row * 8, 15, 7, cols[(r() * 3) | 0]);
    speck(0, 60, W, 70, W, ['#4a7a3a', '#3a6a30']);
    const py = 44;
    R(0, py, W, 26, '#6a5a48'); R(0, py, W, 4, '#8a7660'); R(0, py + 22, W, 4, '#4a3e30');
    for (let x = 20; x < W; x += 56) R(x, py - 3, 6, 32, '#5a4c3c');
    speck(0, py, W, 26, 60, ['#8a4a2a', '#a8603a']);
    const dx = Math.round(W * 0.4);
    R(dx, py + 26, 2, H - 54 - py - 26, '#7aa03a');
    R(0, H - 58, W, 8, '#6a706c'); R(0, H - 50, W, 3, '#404644');
    grad(H - 46, H, '#5f7a2e', '#35481c', 6);
    for (let y = H - 42; y < H; y += 6) for (let x = ((r() * 10) | 0); x < W; x += 18) R(x, y, 8, 1, '#8aa84a');
    const lx = Math.round(W * 0.85), ly = 16;
    g.globalAlpha = 0.1; circ(lx, ly, 30, '#ffe08a'); circ(lx, ly, 20, '#ffe08a'); g.globalAlpha = 1;
    R(lx - 5, ly - 4, 10, 8, '#fff2a8'); R(lx - 6, ly - 6, 12, 2, '#222'); R(lx - 1, 0, 2, ly - 6, '#222');
    return { parts: { n: 18, cols: ['#a8d85a', '#cfe89a'], vx: 0, vy: -0.2, sway: 2, band: [H - 46, H] } };
  };

  /* ---------- 8. แม่น้ำและทะเล ---------- */
  SCENES.water = (k, W, H, r) => {
    const { R, grad, circ, speck, cloud, dot } = k;
    const sy = 70;
    grad(0, sy, '#5db8ee', '#ffd9a0', 10);
    circ(W * 0.7, sy, 18, '#ffe066'); circ(W * 0.7, sy, 13, '#fff0a0');
    for (let i = 0; i < Math.ceil(W / 100); i++) cloud(i * 100 + 20 + r() * 40, 12 + r() * 22);
    grad(sy, H, '#2f8fc8', '#082a55', 14);
    for (let x = 0; x < W * 0.3; x += 2) for (let y = sy; y < sy + 30; y += 2) if (r() < (1 - x / (W * 0.3)) * 0.6) R(x, y, 2, 2, '#9a8a4a');
    for (let y = sy + 4; y < sy + 44; y += 5) for (let x = (r() * 12) | 0; x < W; x += 16 + ((r() * 8) | 0)) R(x, y, 6 + r() * 8, 1, '#bfe6ff');
    for (let i = 0; i < 6; i++) R(W * 0.7 - 8 + i, sy + 3 + i * 5, 16 - i * 2, 1, '#ffe9a0');
    for (let x = 0; x < W * 0.2; x++) {
      const h = Math.round((1 - x / (W * 0.2)) * 14);
      R(x, sy - h, 1, h + 3, '#4f8a3a');
      if (x % 5 === 0) R(x, sy - h - 5, 1, 5, '#6aa04a');
    }
    R(0, H - 14, W, 14, '#d8c488'); speck(0, H - 14, W, 14, W, ['#b8a468', '#efe0a8']);
    for (let x = 6; x < W; x += 18 + ((r() * 14) | 0)) for (let i = 0; i < 14; i++) R(x + Math.round(Math.sin(i / 2) * 2), H - 14 - i, 2, 1, '#2f8a4a');
    for (let x = 30; x < W; x += 70) { R(x, H - 20, 8, 7, '#e0607a'); R(x + 2, H - 25, 4, 5, '#e0607a'); R(x + 1, H - 20, 2, 2, '#f8a0b0'); }
    const fish = (x, y, c) => { R(x, y, 8, 4, c); R(x - 3, y - 1, 3, 6, c); dot(x + 6, y + 1, '#111'); };
    ['#f0a040', '#f06060', '#f0d040', '#80e0d0', '#f08ad0'].forEach((c, i) => fish(((i + 0.5) * W) / 5 + r() * 10, sy + 36 + r() * (H - sy - 70), c));
    return { parts: { n: 22, cols: ['#bfe8ff', '#ffffff'], vx: 0, vy: -0.4, sway: 3, band: [sy + 6, H - 16] } };
  };

  /* ---------- 9. หอผู้ป่วยทั่วไป ---------- */
  SCENES.ward = (k, W, H, r) => {
    const { R, circ, g } = k;
    const fy = Math.round(H * 0.72);
    R(0, 0, W, fy, '#efe7d4'); R(0, fy - 34, W, 34, '#8fc2bc'); R(0, fy - 36, W, 2, '#fff');
    for (let y = fy, j = 0; y < H; y += 8, j++) for (let x = 0, i = 0; x < W; x += 8, i++) R(x, y, 8, 8, (i + j) % 2 ? '#c8d2d4' : '#b8c4c8');
    const wx = Math.round(W / 2) - 24;
    R(wx - 2, 14, 52, 40, '#fff'); R(wx, 16, 48, 36, '#8fd0f2'); R(wx, 16, 48, 12, '#b8e4f8');
    R(wx + 6, 32, 14, 4, '#fff'); R(wx + 28, 24, 12, 4, '#fff'); R(wx + 23, 16, 2, 36, '#fff'); R(wx, 33, 48, 2, '#fff');
    for (let x = W * 0.15; x < W; x += W * 0.3) { g.globalAlpha = 0.18; R(x - 22, 3, 44, 22, '#fffbe0'); g.globalAlpha = 1; R(x - 14, 0, 28, 3, '#fffbe0'); }
    R(0, 40, W, 1, '#9aa0a6');
    const n = W < 200 ? 1 : W < 340 ? 2 : 3, gap = W / n;
    for (let i = 1; i < n; i++) {
      const xc = gap * i;
      R(xc - 6, 41, 12, fy - 52, '#9ac8e8');
      for (let f = 0; f < 12; f += 3) R(xc - 6 + f, 41, 1, fy - 52, '#7ab0d8');
    }
    for (let i = 0; i < n; i++) {
      const x = gap * (i + 0.5);
      R(x - 27, fy - 28, 3, 28, '#6a6f74'); R(x - 25, fy - 12, 52, 4, '#8a8f94');
      R(x - 24, fy - 20, 48, 8, '#fdfdfd'); R(x - 23, fy - 25, 12, 5, '#fff'); R(x - 23, fy - 21, 12, 1, '#dfe6ea');
      R(x - 10, fy - 22, 34, 10, '#7fb4dd'); R(x - 10, fy - 22, 34, 2, '#a8d0ee');
      R(x - 25, fy - 8, 2, 8, '#6a6f74'); R(x + 23, fy - 8, 2, 8, '#6a6f74');
      R(x + 32, fy - 40, 1, 40, '#9aa0a6'); R(x + 30, fy - 46, 5, 8, '#dff4ff'); R(x + 32, fy - 38, 1, 12, '#bfe6ff');
    }
    return { parts: { n: 12, cols: ['#fffbe0'], vx: 0.03, vy: 0.03, sway: 2 } };
  };

  /* ---------- 10. ICU ---------- */
  SCENES.icu = (k, W, H, r) => {
    const { R, grad, circ, line, g } = k;
    const fy = Math.round(H * 0.74);
    grad(0, fy, '#142a44', '#1f3f5e', 8);
    for (let y = fy, j = 0; y < H; y += 8, j++) for (let x = 0, i = 0; x < W; x += 8, i++) R(x, y, 8, 8, (i + j) % 2 ? '#27394a' : '#202f3e');
    for (let x = 30; x < W; x += 70) { R(x, 0, 1, fy - 20, '#2a4a6a'); }
    for (let x = W * 0.15; x < W; x += W * 0.3) { g.globalAlpha = 0.14; R(x - 24, 3, 48, 30, '#8ad0ff'); g.globalAlpha = 1; R(x - 16, 0, 32, 3, '#cfeaff'); }
    const bx = Math.round(W * 0.36);
    R(bx - 34, fy - 14, 68, 5, '#9aa6b0'); R(bx - 30, fy - 9, 2, 9, '#6a7680'); R(bx + 28, fy - 9, 2, 9, '#6a7680');
    R(bx - 32, fy - 24, 64, 10, '#e8f0f5');
    circ(bx - 22, fy - 30, 5, '#e8b894'); R(bx - 28, fy - 36, 10, 3, '#5a3a24');
    R(bx - 14, fy - 28, 44, 14, '#5aa0a8'); R(bx - 14, fy - 28, 44, 2, '#8ac8c8');
    const vx = bx + 50;
    R(vx, fy - 40, 22, 40, '#8a96a2'); R(vx + 3, fy - 36, 16, 10, '#0a2018');
    for (let i = 0; i < 6; i++) R(vx + 4 + i * 2, fy - 31 - (i % 3), 1, 1, '#4aff8a');
    circ(vx + 7, fy - 18, 3, '#c8d0d6'); circ(vx + 15, fy - 18, 3, '#c8d0d6');
    line(bx - 20, fy - 30, vx + 4, fy - 40, 1, '#aee0f0');
    R(bx - 48, fy - 46, 1, 46, '#9aa0a6'); R(bx - 51, fy - 44, 7, 20, '#c8d0d6'); R(bx - 50, fy - 42, 5, 6, '#0a2018');
    const mx = Math.min(W - 62, Math.round(W * 0.62)), my = 30;
    R(mx - 2, my - 2, 60, 38, '#0c1420'); R(mx + 26, my + 36, 4, 8, '#3a4a5a');
    R(mx, my, 56, 34, '#04140c');
    R(Math.round(W * 0.06), 10, 24, 10, '#c02030'); R(Math.round(W * 0.06) + 10, 12, 4, 6, '#fff'); R(Math.round(W * 0.06) + 8, 14, 8, 2, '#fff');
    const pumpX = bx - 51;
    return {
      parts: { n: 10, cols: ['#8ad0ff'], vx: 0, vy: -0.03, sway: 2 },
      anim: (c, t) => {
        c.fillStyle = '#04140c'; c.fillRect(mx, my, 56, 34);
        c.fillStyle = '#12482e';
        for (let y = my + 4; y < my + 34; y += 8) c.fillRect(mx, y, 56, 1);
        c.fillStyle = '#4aff8a';
        const wave = (p) => (p === 11 ? -3 : p === 12 ? -13 : p === 13 ? 6 : p === 14 ? 1 : p >= 18 && p <= 20 ? -3 : 0);
        let prev = 0;
        for (let i = 0; i < 56; i++) {
          const y = wave(((i + Math.floor(t * 28)) % 28 + 28) % 28);
          const a = Math.min(prev, y), b = Math.max(prev, y);
          c.fillRect(mx + i, my + 20 + a, 1, b - a + 1);
          prev = y;
        }
        c.fillStyle = Math.floor(t * 2) % 2 ? '#ff4a4a' : '#5a1a1a';
        c.fillRect(pumpX + 2, fy - 30, 3, 3);
        c.fillStyle = '#ffd24a'; c.fillRect(mx + 46, my + 3, 6, 3);
      },
    };
  };

  /* ---------- ตัวควบคุม ---------- */
  const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; };

  function create(canvas, id) {
    const g = canvas.getContext('2d');
    const base = document.createElement('canvas');
    const bg = base.getContext('2d');
    const still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cur = id || 'gut', cfg = {}, parts = [], W = 0, timer = 0, rt = 0, t0 = performance.now();

    function build() {
      const box = (canvas.parentElement || document.body).getBoundingClientRect();
      const asp = box.width / Math.max(1, box.height) || 16 / 9;
      W = Math.max(140, Math.min(480, Math.ceil(H * asp)));
      canvas.width = base.width = W; canvas.height = base.height = H;
      const r = rng(hash(cur));
      cfg = SCENES[cur](kit(bg, W, r), W, H, r) || {};
      const p = cfg.parts, pr = rng(7);
      parts = p ? Array.from({ length: p.n }, () => ({ x: pr() * W, y: pr() * H, ph: pr() * 6.28, c: p.cols[(pr() * p.cols.length) | 0] })) : [];
      frame();
    }
    function frame() {
      const t = (performance.now() - t0) / 1000, p = cfg.parts;
      g.drawImage(base, 0, 0);
      if (p) {
        const [y0, y1] = p.band || [0, H];
        for (const q of parts) {
          const x = (((q.x + p.vx * t * 20) % W) + W) % W + Math.sin(t * 1.5 + q.ph) * p.sway;
          const y = y0 + ((((q.y + p.vy * t * 20) % (y1 - y0)) + (y1 - y0)) % (y1 - y0));
          g.fillStyle = q.c; g.fillRect(Math.round(x), Math.round(y), 1, 1);
        }
      }
      if (cfg.anim) cfg.anim(g, t);
    }
    function start() { clearInterval(timer); if (!still) timer = setInterval(() => { if (!document.hidden) frame(); }, 100); }
    const onResize = () => { clearTimeout(rt); rt = setTimeout(build, 120); };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    build(); start();
    return {
      set(next) { if (SCENES[next]) { cur = next; build(); } },
      get id() { return cur; },
      destroy() { clearInterval(timer); clearTimeout(rt); window.removeEventListener('resize', onResize); window.removeEventListener('orientationchange', onResize); },
    };
  }

  let active = null;
  function clear() {
    if (!active) return;
    active.background.destroy();
    active.canvas.remove();
    active = null;
  }
  function show(target, id) {
    if (!(target instanceof Element)) throw new TypeError('A habitat background needs a target element');
    clear();
    const canvas = document.createElement('canvas');
    canvas.className = 'habitat-pixel-background';
    canvas.setAttribute('aria-hidden', 'true');
    target.prepend(canvas);
    active = { canvas, background: create(canvas, id) };
    return active.background;
  }

  const api = { create, show, clear, names: NAMES, ids: Object.keys(NAMES), _scenes: SCENES, _kit: kit, _rng: rng, H };
  if (typeof module !== 'undefined') module.exports = api;
  else window.PixelBG = api;
})();
