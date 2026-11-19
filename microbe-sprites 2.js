/*!
 * MicrobeSprites v1.0 — ตัวละครเชื้อโรคสไตล์พิกเซล (วาดด้วยโค้ดล้วน ไม่ต้องใช้รูปภาพ)
 * 16 สายพันธุ์ • 7 สีหน้า (ยิ้ม ร้องไห้ เขิน เจ้าเล่ห์ สงสัย โกรธ ตกใจ) • 5 ระดับความหายาก
 *
 * วิธีใช้ในเกม (เบราว์เซอร์):
 *   <script src="microbe-sprites.js"></script>
 *
 *   // 1) แบบง่าย: ผูกกับ <canvas> แล้วเล่นอนิเมชันเอง
 *   const ctl = MicrobeSprites.attach('ecoli', document.querySelector('canvas'), { scale: 6 });
 *   ctl.setExpression('angry');   // ล็อกสีหน้า  |  ctl.setExpression('random') = สุ่มต่อ
 *   ctl.stop(); ctl.start();
 *
 *   // 2) แบบใช้ใน game loop ของคุณเอง
 *   const bug = MicrobeSprites.make('ebola');            // สร้างตัวละคร
 *   function loop(dt) { bug.update(dt); bug.draw(ctx, x, y, 4); }  // dt = วินาที
 *
 *   // ตัวเลือก: { rarity:'epic', seed:123, scale:6 }  — เปลี่ยนระดับความหายากได้ทุกตัว
 *   // รายชื่อ: MicrobeSprites.species  |  ระดับ: MicrobeSprites.rarities
 *
 * ใช้กับ Node/bundler ได้ด้วย: const MicrobeSprites = require('./microbe-sprites.js')
 * id ที่ใช้ได้: ecoli klebsiella saureus enterococcus pseudomonas lactobacillus bacillus
 *   spneumoniae hinfluenzae acinetobacter mycoplasma yersinia vibrio gardnerella sars2 ebola
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MicrobeSprites = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const W = 64, N = W * W, FPS = 12, INK = '#12102a', WHITE = '#ffffff';
  const PI = Math.PI, sin = Math.sin, cos = Math.cos;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const h01 = (a, b, c) => { const s = sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453; return s - Math.floor(s); };
  function mulberry(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const hashStr = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; };

  // hex -> ABGR (ใช้กับ ImageData)
  const _c = new Map();
  function rgb(h) {
    let v = _c.get(h);
    if (v === undefined) { const n = parseInt(h.slice(1), 16); v = (0xFF000000 | ((n & 255) << 16) | (n & 0xFF00) | (n >> 16)) >>> 0; _c.set(h, v); }
    return v;
  }
  // พาเลต: b=สีหลัก l=สว่าง d=เงา o=สีขอบ (ไม่ใส่ = ใช้ขอบของสายพันธุ์)
  const pal = (b, l, d, o, x) => Object.assign({ b: rgb(b), l: rgb(l), d: rgb(d), o: o ? rgb(o) : 0 }, x || {});

  // ───────────────────────── ระดับความหายาก ─────────────────────────
  const RARITY = {
    common:    { th: 'พบบ่อย', en: 'Common', color: '#9fb4cf', stars: 0, aura: 0, orbit: 0 },
    uncommon:  { th: 'พบไม่บ่อย', en: 'Uncommon', color: '#5fe3a1', stars: 3, aura: 0, orbit: 0, starCols: ['#ffffff', '#b8ffd9'] },
    rare:      { th: 'ค่อนข้างหายาก', en: 'Rare', color: '#5cb6ff', stars: 6, aura: 3, orbit: 0, starCols: ['#ffffff', '#a8dcff', '#6fb8ff'], auraCols: ['#8fd3ff', '#4a9bff'] },
    epic:      { th: 'หายาก', en: 'Epic', color: '#c77dff', stars: 10, aura: 4, orbit: 3, starCols: ['#ffffff', '#f3c8ff', '#a8f0ff'], auraCols: ['#e6b3ff', '#b36bff', '#7b3fd6'], orbitCols: ['#f3c8ff', '#a8f0ff', '#ffffff'], glint: '#f4d6ff' },
    legendary: { th: 'หายากมาก', en: 'Legendary', color: '#ffb23e', stars: 16, aura: 5, orbit: 6, rays: true, big: true, starCols: ['#fff2a8', '#ffd36a', '#ffffff', '#ff9f43'], auraCols: ['#ffe08a', '#ff9f43', '#ff5a5a', '#a8202f'], orbitCols: ['#fff2a8', '#ffd36a', '#ffffff'], glint: '#fff2a8' },
  };

  const EXPRESSIONS = [
    { id: 'smile', th: 'ยิ้ม' }, { id: 'cry', th: 'ร้องไห้' }, { id: 'shy', th: 'เขิน' }, { id: 'sly', th: 'เจ้าเล่ห์' },
    { id: 'curious', th: 'สงสัย' }, { id: 'angry', th: 'โกรธ' }, { id: 'shocked', th: 'ตกใจ' },
  ];
  const EXPR_W = { smile: 30, shy: 13, sly: 13, curious: 13, shocked: 10, angry: 10, cry: 11 };

  // ───────────────────────── กริดพิกเซล ─────────────────────────
  class Grid {
    constructor() {
      this.Z = new Uint8Array(N); this.P = new Uint8Array(N);
      this.AU = new Uint32Array(N); this.BK = new Uint32Array(N); this.FR = new Uint32Array(N); this.out = new Uint32Array(N);
      this.D = new Uint8Array(N); this.q1 = new Int16Array(N); this.q2 = new Int16Array(N);
      this.ox = 0; this.oy = 0; this.z = 0;
    }
    begin(m, f) {
      this.Z.fill(0); this.P.fill(0); this.AU.fill(0); this.BK.fill(0); this.FR.fill(0);
      this.z = 0; this.ox = 0; this.oy = 0; this.f = f; this.t = f / FPS; this.m = m;
      this.pals = m.sp.pal; this.face = { x: 32, y: 30, hg: 2 };
    }
    nz() { return ++this.z; }
    at(x, y) { x = Math.round(x + this.ox); y = Math.round(y + this.oy); return x < 0 || y < 0 || x >= W || y >= W ? 0 : this.Z[y * W + x]; }
    // ── ตัวถัง (มีเงา/ขอบอัตโนมัติ) ──
    fill(x0, y0, x1, y1, test, pi, z) {
      z = z || ++this.z; const ox = this.ox, oy = this.oy;
      const ax = Math.max(0, Math.floor(x0 + ox)), bx = Math.min(W - 1, Math.ceil(x1 + ox));
      const ay = Math.max(0, Math.floor(y0 + oy)), by = Math.min(W - 1, Math.ceil(y1 + oy));
      for (let y = ay; y <= by; y++) for (let x = ax; x <= bx; x++) if (test(x - ox + 0.5, y - oy + 0.5)) { const i = y * W + x; this.Z[i] = z; this.P[i] = pi; }
      return z;
    }
    ell(cx, cy, rx, ry, pi, z) { return this.fill(cx - rx - 1, cy - ry - 1, cx + rx + 1, cy + ry + 1, (x, y) => { const a = (x - cx) / rx, b = (y - cy) / ry; return a * a + b * b <= 1; }, pi, z); }
    cap(x1, y1, x2, y2, r, pi, z) {
      const dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy || 1;
      return this.fill(Math.min(x1, x2) - r - 1, Math.min(y1, y2) - r - 1, Math.max(x1, x2) + r + 1, Math.max(y1, y2) + r + 1, (x, y) => {
        const u = clamp(((x - x1) * dx + (y - y1) * dy) / l2, 0, 1), px = x1 + u * dx - x, py = y1 + u * dy - y; return px * px + py * py <= r * r;
      }, pi, z);
    }
    // ── พิกเซลลอย (ชั้นหน้า FR / ชั้นหลัง BK) ──
    put(L, x, y, c, world) {
      if (!world) { x += this.ox; y += this.oy; }
      x = Math.round(x); y = Math.round(y);
      if (x < 0 || y < 0 || x >= W || y >= W) return;
      L[y * W + x] = typeof c === 'number' ? c : rgb(c);
    }
    px(x, y, c) { this.put(this.FR, x, y, c); }
    bpx(x, y, c) { this.put(this.BK, x, y, c); }
    wpx(x, y, c, back) { this.put(back ? this.AU : this.FR, x, y, c, true); }
    rect(x, y, w, h, c, back) { const L = back ? this.BK : this.FR; for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.put(L, x + i, y + j, c); }
    spr(x, y, rows, map, back) {
      const L = back ? this.BK : this.FR;
      for (let j = 0; j < rows.length; j++) { const r = rows[j]; for (let i = 0; i < r.length; i++) { const c = map[r[i]]; if (c) this.put(L, x + i, y + j, c); } }
    }
    line(x0, y0, x1, y1, c, back) {
      const L = back ? this.BK : this.FR;
      x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
      const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let e = dx + dy;
      for (;;) { this.put(L, x0, y0, c); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
    }
    // เส้นหยัก (แฟลเจลลา/ควัน) วิ่งจากจุดเริ่ม ตามมุม ang
    wave(x, y, ang, len, amp, k, sp, col, back, ph) {
      const ca = cos(ang), sa = sin(ang); let lx = 0, ly = 0;
      for (let i = 0; i <= len; i++) {
        const off = sin(i * k - this.t * sp + (ph || 0)) * amp * Math.min(1, i / 8);
        const px = x + ca * i - sa * off, py = y + sa * i + ca * off;
        if (i) this.line(lx, ly, px, py, Array.isArray(col) ? col[(i >> 1) % col.length] : col, back);
        lx = px; ly = py;
      }
    }
    gloss(x, y) { this.px(x, y, WHITE); this.px(x + 1, y, WHITE); this.px(x, y + 1, '#e8f0ff'); }
    // ชั้นหลังแบบลายหมากรุก (เรืองแสง)
    bshape(x0, y0, x1, y1, test, c, mod) {
      const ox = this.ox, oy = this.oy, col = rgb(c);
      for (let y = Math.max(0, Math.floor(y0 + oy)); y <= Math.min(W - 1, Math.ceil(y1 + oy)); y++)
        for (let x = Math.max(0, Math.floor(x0 + ox)); x <= Math.min(W - 1, Math.ceil(x1 + ox)); x++) {
          if (mod === 1 && ((x + y) & 1)) continue;
          if (mod === 2 && (x % 2 || y % 2)) continue;
          if (test(x - ox + 0.5, y - oy + 0.5)) this.BK[y * W + x] = col;
        }
    }
    bell(cx, cy, rx, ry, c, mod) { this.bshape(cx - rx - 1, cy - ry - 1, cx + rx + 1, cy + ry + 1, (x, y) => { const a = (x - cx) / rx, b = (y - cy) / ry; return a * a + b * b <= 1; }, c, mod); }
    bcap(x1, y1, x2, y2, r, c, mod) {
      const dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy || 1;
      this.bshape(Math.min(x1, x2) - r - 1, Math.min(y1, y2) - r - 1, Math.max(x1, x2) + r + 1, Math.max(y1, y2) + r + 1, (x, y) => {
        const u = clamp(((x - x1) * dx + (y - y1) * dy) / l2, 0, 1), px = x1 + u * dx - x, py = y1 + u * dy - y; return px * px + py * py <= r * r;
      }, c, mod);
    }
    // หน้าตาแบบจุดเล็กๆ สำหรับเซลล์ข้างๆ (เลียนสีหน้าตัวหลัก)
    buddy(x, y) {
      const e = this.m.expr, K = INK;
      if (this.m.blink || e === 'sly') { this.rect(x, y + 1, 1, 1, K); this.rect(x + 4, y + 1, 1, 1, K); }
      else { this.rect(x, y, 1, 2, K); this.rect(x + 4, y, 1, 2, K); }
      if (e === 'cry' || e === 'angry') this.spr(x, y + 3, ['.kkk.', 'k...k'], { k: K });
      else if (e === 'shocked' || e === 'curious') this.spr(x + 1, y + 3, ['.kk.', '.kk.'], { k: K });
      else this.spr(x, y + 3, ['k...k', '.kkk.'], { k: K });
      if (e === 'shy') { this.px(x - 1, y + 2, '#ff8fb1'); this.px(x + 5, y + 2, '#ff8fb1'); }
    }
    // รัศมีเรืองแสงรอบตัว (ตามรูปร่างจริง) — ระดับ rare ขึ้นไป
    aura(r, f) {
      const R = r.aura, Z = this.Z, D = this.D, AU = this.AU; let cur = this.q1, nxt = this.q2, n = 0;
      D.fill(0);
      for (let i = 0; i < N; i++) if (Z[i]) { D[i] = 1; cur[n++] = i; }
      for (let k = 1; k <= R; k++) {
        let c = 0;
        const add = j => { if (!D[j]) { D[j] = k + 1; nxt[c++] = j; } };
        for (let a = 0; a < n; a++) { const i = cur[a], x = i & 63; if (x > 0) add(i - 1); if (x < 63) add(i + 1); if (i >= W) add(i - W); if (i < N - W) add(i + W); }
        const tmp = cur; cur = nxt; nxt = tmp; n = c;
      }
      const cols = r.auraCols.map(rgb);
      for (let i = 0; i < N; i++) {
        const dd = D[i]; if (dd < 3) continue;
        const d = dd - 1, x = i & 63, y = i >> 6; let on;
        if (d === 2) on = ((x + y + (f >> 1)) & 1) === 0;
        else { const h = (((x * 73856093) ^ (y * 19349663) ^ ((f >> 1) * 83492791)) >>> 0) % 100; on = h < 65 * (R - d + 1) / (R - 1); }
        if (on) AU[i] = cols[Math.min(cols.length - 1, d - 2)];
      }
    }
    // รวมทุกชั้น: ตัวถัง(เงา+ขอบ) → ชั้นหลัง → ออร่า
    finish(m) {
      const Z = this.Z, P = this.P, pals = this.pals, out = this.out, AU = this.AU, BK = this.BK, FR = this.FR;
      const sp = m.sp, rar = m.rar, f = this.f, t = this.t, ox = this.ox, oy = this.oy;
      const olDef = rgb(sp.ol), glint = rar.glint ? rgb(rar.glint) : 0;
      const zat = (x, y) => (x < 0 || y < 0 || x >= W || y >= W ? 0 : Z[y * W + x]);
      for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
        const i = y * W + x; let c = FR[i];
        if (!c) {
          const z = Z[i];
          if (z) {
            let pl = pals[P[i]];
            if (pl.pick) pl = pals[pl.pick(x - ox, y - oy, t)];
            c = pl.glass ? (((x + y) & 1) ? pl.l : pl.b) : pl.b;
            const chk = ((x + y) & 1) === 0;
            if (zat(x - 2, y - 2) !== z) c = pl.l;
            else if (zat(x + 2, y + 2) !== z) c = pl.d;
            else if (chk && zat(x - 3, y - 3) !== z) c = pl.l;
            else if (chk && zat(x + 3, y + 3) !== z) c = pl.d;
            const a = zat(x - 1, y), b = zat(x + 1, y), u = zat(x, y - 1), d = zat(x, y + 1);
            if ((a && a < z) || (b && b < z) || (u && u < z) || (d && d < z)) c = pl.o || olDef;
          } else {
            let nb = -1;
            if (x > 0 && Z[i - 1]) nb = i - 1; else if (x < W - 1 && Z[i + 1]) nb = i + 1; else if (y > 0 && Z[i - W]) nb = i - W; else if (y < W - 1 && Z[i + W]) nb = i + W;
            if (nb >= 0) {
              const pl = pals[P[nb]]; c = (pl && pl.o) || olDef;
              if (glint && (((x + y - f * 2) & 15) < 3)) c = glint;   // ประกายวิ่งตามขอบ (epic+)
            } else c = BK[i] || AU[i];
          }
        }
        out[i] = c;
      }
    }
  }

  // ───────────────────────── ลวดลายเล็กๆ ─────────────────────────
  const HEART = ['.r.r.', 'rrrrr', '.rrr.', '..r..'];
  const QM = ['.kkk.', 'k...k', '....k', '...k.', '..k..', '.....', '..k..'];
  const BANG = ['kk', 'kk', 'kk', 'kk', '..', 'kk'];
  const ANGER = ['rr.rr', 'r...r', '.....', 'r...r', 'rr.rr'];
  const RBC = ['.rrr.', 'rrDrr', 'rrDrr', '.rrr.'];
  const CROWN = ['l....l....l', 'ly..lyl..yl', 'yyyyyyyyyyy', 'yyryycyyryy', 'ddddddddddd'];
  const FLEA = ['.kk.', 'kkkk', 'k..k'];

  function glyph(g, x, y, rows, col) {
    const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (let j = 0; j < rows.length; j++) for (let i = 0; i < rows[j].length; i++) if (rows[j][i] !== '.') for (let k = 0; k < 4; k++) g.px(x + i + nb[k][0], y + j + nb[k][1], INK);
    for (let j = 0; j < rows.length; j++) for (let i = 0; i < rows[j].length; i++) if (rows[j][i] !== '.') g.px(x + i, y + j, col);
  }

  // ───────────────────────── สีหน้า ─────────────────────────
  function drawFace(g, m) {
    const fc = g.face, f = g.f, K = INK, Wh = WHITE;
    const L = fc.x - fc.hg - 4, R = fc.x + fc.hg, y = fc.y, my = y + 5, mx = fc.x - 3, bl = m.blink, lk = m.look;
    const eyes = (lx, ly) => {
      if (bl) { g.rect(L, y + 2, 4, 1, K); g.rect(R, y + 2, 4, 1, K); return; }
      [L, R].forEach(X => { g.rect(X, y, 4, 4, Wh); g.rect(X + lx, y + ly, 2, 2, K); });
    };
    switch (m.expr) {
      case 'smile':
        if ((f + m.ph0) % 60 < 15) {   // ดีใจตาหยี ปากเปิด
          g.spr(L, y + 1, ['.kk.', 'k..k'], { k: K }); g.spr(R, y + 1, ['.kk.', 'k..k'], { k: K });
          g.spr(mx, my, ['kkkkkk', '.kppk.', '..kk..'], { k: K, p: '#ff7a9a' });
        } else { eyes(lk, 1); g.spr(mx, my, ['k....k', '.kkkk.'], { k: K }); }
        break;
      case 'cry':
        eyes(1, 0);
        if (!bl) { g.rect(L, y + 3, 4, 1, '#9fe3ff'); g.rect(R, y + 3, 4, 1, '#9fe3ff'); }
        g.spr(L, y - 2, ['..kk', 'kk..'], { k: K }); g.spr(R, y - 2, ['kk..', '..kk'], { k: K });
        for (let i = 0; i < Math.min(4, f % 6); i++) g.px(L, y + 4 + i, '#8fdcff');
        for (let i = 0; i < Math.min(4, (f + 3) % 6); i++) g.px(R + 3, y + 4 + i, '#8fdcff');
        g.spr(mx, my, (f >> 1) & 1 ? ['.kkkk.', 'k....k'] : ['..kk..', '.k..k.'], { k: K });
        break;
      case 'shy':
        eyes(lk === 1 ? 2 : lk, 2);
        g.rect(L - 1, y + 4, 4, 2, '#ff8fb1'); g.rect(R + 1, y + 4, 4, 2, '#ff8fb1');
        g.px(L, y + 4, '#ffc2d6'); g.px(R + 3, y + 4, '#ffc2d6');
        g.spr(fc.x - 2, my, ['k..k', '.kk.'], { k: K });
        break;
      case 'sly': {
        const lx = ((f / FPS) | 0) % 4 < 2 ? 0 : 2;
        [L, R].forEach(X => { g.rect(X, y + 1, 4, 3, Wh); g.rect(X + lx, y + 2, 2, 2, K); g.rect(X, y, 4, 1, K); });
        g.px(L - 1, y + 1, K); g.px(R + 4, y + 1, K);
        g.spr(mx, my, ['...kkk', 'kkk...', '..w...'], { k: K, w: Wh });
        break; }
      case 'curious':
        eyes(2, 0);
        g.rect(L, y - 2, 4, 1, K); g.spr(R, y - 3, ['.kk.', 'k..k'], { k: K });
        g.spr(fc.x - 2, my, ['.kk.', 'k..k', '.kk.'], { k: K });
        break;
      case 'angry':
        eyes(1, 1);
        if (!bl) { g.spr(L, y - 1, ['kk..', '.kk.', '..kk'], { k: K }); g.spr(R, y - 1, ['..kk', '.kk.', 'kk..'], { k: K }); }
        g.spr(mx, my, ['kkkkkk', 'kwkkwk'], { k: K, w: Wh });
        break;
      case 'shocked':
        g.rect(L - 1, y - 1, 5, 5, Wh); g.rect(R, y - 1, 5, 5, Wh);
        g.px(L + 1, y + 1, K); g.px(R + 2, y + 1, K);
        g.rect(L - 1, y - 3, 4, 1, K); g.rect(R + 1, y - 3, 4, 1, K);
        g.spr(fc.x - 2, my, ['.kk.', 'kddk', 'kddk', '.kk.'], { k: K, d: '#5a1d3a' });
        break;
    }
  }

  // เอฟเฟกต์ประกอบสีหน้า: ?  !  ปรี๊ด  หัวใจ  เหงื่อ
  function drawFX(g, m) {
    const fc = g.face, f = g.f, e = m.expr, sp = m.sp;
    const gx = sp.gl ? sp.gl[0] : clamp(fc.x + 8, 1, 55), gy = sp.gl ? sp.gl[1] : clamp(fc.y - 13, 1, 50);
    if (e === 'curious') glyph(g, gx, gy + Math.round(sin(f * 0.5)), QM, '#ffe27a');
    else if (e === 'shocked') {
      glyph(g, gx + 2, gy + ((f & 2) ? 0 : 1), BANG, '#ff7a5c');
      const sy = fc.y + (f % 8); g.px(fc.x - 10, sy, '#8fdcff'); g.px(fc.x - 10, sy + 1, '#8fdcff'); g.px(fc.x - 11, sy + 1, '#8fdcff');
    } else if (e === 'angry') { if (f % 6 < 4) g.spr(gx, gy + 2, ANGER, { r: '#ff4d5e' }); }
    else if (e === 'shy') {
      for (let i = 0; i < 2; i++) {
        const ph = (f * 0.5 + i * 8) % 16, hy = Math.round(fc.y - 4 - ph), hx = Math.round(fc.x + 7 + i * 4 + sin(f * 0.3 + i * 2) * 1.5);
        if (hy > 0) g.spr(hx, hy, HEART, { r: ph > 10 ? '#ffc2d6' : '#ff7fa8' });
      }
    }
  }

  // ประกายระยิบระยับ / วงโคจร / รัศมี ตามระดับความหายาก
  function star(g, x, y, s, c, back) {
    x = Math.round(x); y = Math.round(y);
    const p = (dx, dy, cc) => g.wpx(x + dx, y + dy, cc || c, back);
    p(0, 0, s >= 2 ? WHITE : c);
    if (s >= 1) { p(1, 0); p(-1, 0); p(0, 1); p(0, -1); }
    if (s >= 2) { p(2, 0); p(-2, 0); p(0, 2); p(0, -2); }
    if (s >= 3) { p(3, 0); p(-3, 0); p(0, 3); p(0, -3); p(1, 1); p(-1, 1); p(1, -1); p(-1, -1); }
  }
  function effects(g, m) {
    const r = m.rar, f = g.f, t = g.t, sp = m.sp, sx = sp.sx || 26, sy = sp.sy || 22;
    if (r.aura) g.aura(r, f);
    if (r.rays) for (let k = 0; k < 8; k++) {
      const a = k * PI / 4 + t * 0.35;
      for (let d = 25; d <= 31; d++) if (((d + (f >> 1)) % 3) === 0) g.wpx(32 + cos(a) * d, 33 + sin(a) * d, (k & 1) ? '#ffd36a' : '#ff9f43', true);
    }
    for (let k = 0; k < r.orbit; k++) {
      const a = t * (0.9 + (k % 3) * 0.25) + k * (2 * PI / r.orbit);
      star(g, 32 + cos(a) * sx * 0.95, 33 + sin(a) * 9, (k & 1) ? 1 : 0, r.orbitCols[k % r.orbitCols.length], sin(a) <= 0);
    }
    if (!r.stars) return;
    const seq = [-1, 0, 1, 2, 1, 0, -1, -1], cols = r.starCols;
    m.stars.forEach((s, i) => {
      const u = t / s.T + s.ph, cn = Math.floor(u), st = seq[Math.floor((u - cn) * 8)];
      if (st < 0) return;
      const ang = h01(i, cn, 1) * 2 * PI, rr = 0.9 + 0.3 * h01(i, cn, 2);
      star(g, 32 + cos(ang) * sx * rr, 33 + sin(ang) * sy * rr, r.big && st === 2 ? 3 : st, cols[Math.floor(h01(i, cn, 3) * cols.length)], false);
    });
  }

  // ───────────────────────── สายพันธุ์ ─────────────────────────
  const S = {}, ORDER = [];
  const def = (id, o) => { o.id = id; S[id] = o; ORDER.push(id); };
  const lensT = (cx, cy, hw, hh) => {   // รูปหัวหอก (lancet) ปลายแหลม
    const R = (hw * hw + hh * hh) / (2 * hh), d = R - hh, R2 = R * R;
    return (x, y) => { const dx = x - cx, a = y - cy - d, b = y - cy + d; return dx * dx + a * a <= R2 && dx * dx + b * b <= R2; };
  };

  def('ecoli', {
    th: 'อีโคไล', sci: 'Escherichia coli', rarity: 'common', gram: 'แกรมลบ', shape: 'แท่งสั้น',
    trait: 'แท่งสั้น (bacillus) มีแฟลเจลลาโดยรอบตัว และขนเกาะ (fimbriae) พบได้ในลำไส้คนทั่วไป',
    ol: '#0e3b36', sx: 27, sy: 21, pal: [pal('#7ee2a8', '#c9ffdc', '#3fb283')],
    draw(g, t) {
      const r = 9 + 0.6 * sin(t * 2.6);
      [[22, 28, -2.4, 17], [31, 26, -1.65, 19], [42, 27, -0.85, 17], [23, 41, 2.3, 17], [34, 42, 1.55, 19], [45, 41, 0.8, 16]]
        .forEach((a, i) => g.wave(a[0], a[1], a[2], a[3], 2.4, 0.55, 5 + i * 0.4, ['#3fae7c', '#9af0c0'], true, i * 1.3));
      for (let x = 24; x <= 42; x += 3) { g.bpx(x, 23, '#c9ffdc'); g.bpx(x, 22 - (x % 2), '#9af0c0'); g.bpx(x + 1, 45, '#c9ffdc'); g.bpx(x + 1, 46 + (x % 2), '#9af0c0'); }
      g.cap(20, 34, 44, 34, r, 0);
      for (let x = 24; x <= 40; x++) g.px(x, 40 + ((x >> 1) & 1), '#3fb283');
      g.gloss(24, 28);
      g.face = { x: 32, y: 30, hg: 2 };
    },
  });

  def('klebsiella', {
    th: 'เคล็บซิเอลลา', sci: 'Klebsiella pneumoniae', rarity: 'common', gram: 'แกรมลบ', shape: 'แท่ง + แคปซูลหนา',
    trait: 'แท่งห่อด้วยแคปซูลวุ้นหนา (mucoid) เหนียวเป็นยาง ช่วยหลบภูมิคุ้มกัน ไม่มีแฟลเจลลา',
    ol: '#0f3d36', sx: 29, sy: 20,
    pal: [pal('#bfa9ff', '#f1eaff', '#8a74e3', '#4b3aa8', { glass: 1 }), pal('#74dcb8', '#c3ffe8', '#3aa686')],
    draw(g, t, f) {
      const zc = g.cap(18, 34, 46, 34, 13.5 + 0.5 * sin(t * 2), 0);
      g.cap(24, 34, 40, 34, 8.2, 1);
      for (let y = 21; y <= 47; y++) { const x = Math.round(((f * 2.3) % 96) - 24 + (y - 21) * 0.7); for (let d = 0; d < 2; d++) if (g.at(x + d, y) === zc) g.px(x + d, y, WHITE); }
      [[9, 38, 0], [54, 36, 5], [12, 29, 9]].forEach(b => { const y = b[1] - ((f * 0.35 + b[2]) % 9); if (g.at(b[0], y) === zc) { g.px(b[0], y, WHITE); g.px(b[0] + 1, y, '#e3d9ff'); g.px(b[0], y + 1, '#e3d9ff'); } });
      const L = 4 + Math.round(3 + 3 * sin(t * 2));   // เส้นเมือกยืดหยด (string test)
      g.line(31, 48, 31, 48 + L, '#bfa9ff'); g.px(31, 49 + L, '#f1eaff'); g.px(32, 49 + L, '#bfa9ff');
      g.gloss(21, 29);
      g.face = { x: 32, y: 30, hg: 2 };
    },
  });

  def('saureus', {
    th: 'สแตฟิโลค็อกคัส ออเรียส', sci: 'Staphylococcus aureus', rarity: 'common', gram: 'แกรมบวก', shape: 'กลมเกาะกันเป็นพวงองุ่น',
    trait: 'เซลล์กลมเกาะกลุ่มคล้ายพวงองุ่น และเม็ดสีทอง (aureus = สีทอง) ที่เป็นที่มาของชื่อ',
    ol: '#241a52', sx: 29, sy: 25, pal: [pal('#a98ff4', '#dcd0ff', '#6d51c8')],
    draw(g, t, f) {
      const C = [[22, 22], [42, 22], [14, 36], [50, 36], [24, 48], [40, 48]];
      C.forEach((c, i) => { const j = Math.round(sin(t * 3 + i * 1.7) * 0.9); g.oy += j; g.ell(c[0], c[1], 7.6, 7.6, 0); g.oy -= j; });
      g.ell(32, 35, 10.6, 10.6, 0);
      C.forEach((c, i) => { if (((f + i * 3) % 12) < 8) { g.px(c[0] - 3, c[1] + 2, '#ffd45e'); g.px(c[0] + 3, c[1] - 1, '#ffe48a'); g.px(c[0] + 1, c[1] + 4, '#ffd45e'); } g.gloss(c[0] - 5, c[1] - 5); });
      g.px(28, 41, '#ffd45e'); g.px(37, 40, '#ffd45e');
      g.face = { x: 32, y: 31, hg: 2 };
    },
  });

  def('enterococcus', {
    th: 'เอนเทอโรค็อกคัส', sci: 'Enterococcus faecium / faecalis', rarity: 'common', gram: 'แกรมบวก', shape: 'กลมรี เรียงเป็นสายสั้น',
    trait: 'เซลล์กลมรีต่อกันเป็นสายสั้น ผนังเซลล์หนา (วงแหวนชั้นนอก) จึงทนทานมาก',
    ol: '#2d1757', sx: 30, sy: 19, pal: [pal('#d6b4ff', '#f2e6ff', '#9a70de'), pal('#b985f0', '#e2c6ff', '#7d4fc9')],
    draw(g, t) {
      [15.5, 32, 48.5].forEach((x, i) => { const j = Math.round(sin(t * 3 - i * 1.2) * 1.3); g.oy += j; g.ell(x, 34, 9.2, 10.2, 0); g.ell(x, 34, 6.9, 8, 1); g.oy -= j; });
      g.gloss(12, 27); g.gloss(29, 27); g.gloss(45, 27);
      g.buddy(13, 31); g.buddy(46, 31);
      g.face = { x: 32, y: 30, hg: 1 };
    },
  });

  def('pseudomonas', {
    th: 'ซูโดโมแนส แอรูจิโนซา', sci: 'Pseudomonas aeruginosa', rarity: 'common', gram: 'แกรมลบ', shape: 'แท่งเรียว + แฟลเจลลาเส้นเดียว',
    trait: 'แท่งเรียว มีแฟลเจลลาเส้นเดียวที่ปลาย สร้างเม็ดสีน้ำเงินเขียว (pyocyanin) และเมือกไบโอฟิล์ม',
    ol: '#0b3a4a', sx: 29, sy: 19,
    pal: [{ pick: (x, y) => (x < 36 ? 2 : x < 41 ? (((x + y) & 1) ? 2 : 1) : 1) }, pal('#47d3c6', '#b6fff0', '#1c97a8'), pal('#4aa9f0', '#a8dcff', '#2a6fc0')],
    draw(g, t, f) {
      g.bcap(36, 33, 52, 33, 10.6, '#c9ff7a', 1);
      g.wave(29, 33, PI, 27, 4.6, 0.42, 9, ['#38c9c0', '#8ff3ea'], false, 0);
      g.wave(29, 34, PI, 27, 4.6, 0.42, 9, '#1c97a8', false, 0);
      [0, 7, 13].forEach((o, i) => { const x = 25 - ((f * 1.1 + o * 2) % 22); g.px(x, 37 + Math.round(sin(f * 0.4 + i) * 2), '#6fe8dc'); g.px(x + 1, 37 + Math.round(sin(f * 0.4 + i) * 2), '#bff'); });
      g.cap(36, 33, 52, 33, 7.8, 0);
      g.gloss(31, 28);
      g.face = { x: 45, y: 29, hg: 2 };
    },
  });

  def('lactobacillus', {
    th: 'แลคโตบาซิลลัส', sci: 'Lactobacillus', rarity: 'common', gram: 'แกรมบวก', shape: 'แท่งยาว ต่อกันเป็นสาย',
    trait: 'แท่งยาวเรียวต่อกันเป็นสาย สร้างกรดแลกติก พบในโยเกิร์ต อาหารหมัก และร่างกายบางส่วน',
    ol: '#2a1a5e', sx: 30, sy: 17, pal: [pal('#c6abff', '#eee3ff', '#8e6bdf')],
    draw(g, t, f) {
      g.cap(13, 35, 29, 35, 6.9, 0); g.cap(29, 35, 50, 35, 6.9, 0);
      g.gloss(10, 31); g.gloss(33, 30);
      g.buddy(18, 32);
      [16, 30, 45].forEach((x, i) => { const y = 24 - ((f * 0.55 + i * 5.3) % 14); g.spr(Math.round(x + sin(f * 0.3 + i) * 1.5), Math.round(y), HEART, { r: y < 14 ? '#ffb3cb' : '#ff7fa8' }); });
      g.face = { x: 41, y: 31, hg: 2 };
    },
  });

  def('bacillus', {
    th: 'บาซิลลัส ซับทิลิส', sci: 'Bacillus subtilis', rarity: 'common', gram: 'แกรมบวก', shape: 'แท่ง + สปอร์ทนทาน',
    trait: 'แท่งที่สร้างสปอร์ (endospore) เปลือกหนาทนความร้อนและแห้งแล้ง — เม็ดสีทองในตัว',
    ol: '#22134f', sx: 29, sy: 20,
    pal: [pal('#aa85f6', '#ddceff', '#6a45c8'), pal('#e8a93a', '#ffe08a', '#b97a1d', '#6b3c0b'), pal('#ffeeb5', '#fffbe4', '#f2c35c', '#6b3c0b')],
    draw(g, t, f) {
      [[8, 31, 3.55, 13], [9, 38, 2.75, 12], [20, 41, 1.9, 12], [34, 41, 1.3, 11]].forEach((a, i) => g.wave(a[0], a[1], a[2], a[3], 2, 0.6, 6 + i, '#8b6fe0', true, i * 2));
      g.cap(16, 34, 46, 34, 8.6, 0);
      const pr = 5.6 + 0.5 * sin(t * 3);
      g.ell(42, 34, pr, pr - 0.8, 1); g.ell(42, 34, pr - 2, pr - 2.6, 2);
      if (f % 30 < 5) { g.px(40, 32, WHITE); g.px(39, 32, WHITE); g.px(41, 32, WHITE); g.px(40, 31, WHITE); g.px(40, 33, WHITE); }
      g.gloss(12, 28);
      g.face = { x: 24, y: 30, hg: 2 };
    },
  });

  def('spneumoniae', {
    th: 'สเตรปโตค็อกคัส นิวโมเนียอี', sci: 'Streptococcus pneumoniae', rarity: 'uncommon', gram: 'แกรมบวก', shape: 'คู่รูปหัวหอก + แคปซูล',
    trait: 'เซลล์รูปหัวหอก (lancet) จับคู่กัน ปลายแหลมอยู่ด้านนอก ห่อด้วยแคปซูลน้ำตาลโพลิแซ็กคาไรด์',
    ol: '#241a52', sx: 30, sy: 22,
    pal: [pal('#e8dcff', '#ffffff', '#b8a0f0', '#5a3fc0', { glass: 1 }), pal('#a98cf5', '#d9ccff', '#6a4fc7')],
    draw(g, t, f) {
      g.ell(32, 34, 29.5, 19.5, 0);
      const A = lensT(24, 34, 16, 11.5), B = lensT(40, 34, 16, 11.5);
      g.fill(8, 22, 32, 46, (x, y) => x <= 31.5 && A(x, y), 1);
      g.fill(32, 22, 56, 46, (x, y) => x >= 32.5 && B(x, y), 1);
      g.gloss(11, 24); g.gloss(51, 43); g.gloss(14, 29);
      [[8, 34], [57, 32], [32, 16], [32, 52]].forEach((p, i) => { if ((f + i * 5) % 14 < 5) { g.px(p[0], p[1], WHITE); g.px(p[0] + 1, p[1], '#d9ccff'); g.px(p[0], p[1] + 1, '#d9ccff'); } });
      g.buddy(41, 31);
      g.face = { x: 21, y: 30, hg: 1 };
    },
  });

  def('hinfluenzae', {
    th: 'ฮีโมฟิลัส อินฟลูเอนเซ', sci: 'Haemophilus influenzae', rarity: 'uncommon', gram: 'แกรมลบ', shape: 'แท่งสั้นป้อม จิ๋ว',
    trait: 'แท่งสั้นป้อมตัวจิ๋ว ต้องการสาร X (ฮีมิน) และ V จากเลือด — เลี้ยงบนวุ้นช็อกโกแลต',
    ol: '#0f4040', sx: 27, sy: 21, pal: [pal('#86e8c4', '#d2fff0', '#41b08f')],
    draw(g, t, f) {
      g.bell(32, 36, 17.5, 15, '#8a5a3c', 1);
      for (let k = 0; k < 30; k++) { if (((k + (f >> 1)) & 3) === 0) continue; const a = k / 30 * 2 * PI, e = (k & 1) * 1.4; g.bpx(32 + cos(a) * (13.2 + e), 36 + sin(a) * (11.4 + e), (k & 1) ? '#bff5e0' : '#86e8c4'); }
      g.ell(32, 36, 11, 9.2, 0); g.gloss(25, 30);
      for (let k = 0; k < 3; k++) { const a = t * 1.1 + k * 2.094, d = sin(a); g.spr(Math.round(32 + cos(a) * 25 - 2), Math.round(36 + d * 11 - 2), RBC, { r: '#e8465a', D: '#9b2236' }, d < 0); }
      g.face = { x: 32, y: 32, hg: 1 };
    },
  });

  def('acinetobacter', {
    th: 'อะซิเนโตแบคเตอร์ บาวมานนี', sci: 'Acinetobacter baumannii', rarity: 'uncommon', gram: 'แกรมลบ', shape: 'แท่งสั้นป้อม จับคู่ + เกราะ',
    trait: 'แท่งสั้นป้อมมักอยู่เป็นคู่ ทนแห้งและดื้อยาสูง — จึงใส่เกราะเหล็กและหมวกนิรภัย',
    ol: '#10402f', sx: 29, sy: 20,
    pal: [pal('#7fdca5', '#ccffe2', '#41a874'), pal('#aebfd1', '#eef5ff', '#6f8399', '#2a3948')],
    draw(g, t, f) {
      const zh = [];
      [[22, 35, 11.5, 10.5], [42, 35, 11, 10]].forEach((c, i) => {
        const j = Math.round(sin(t * 3 + i * 2) * 0.8); g.oy += j;
        g.ell(c[0], c[1], c[2], c[3], 0);
        zh.push(g.fill(c[0] - c[2] - 1, c[1] - c[3] - 1, c[0] + c[2] + 1, c[1] - 3, (x, y) => { const a = (x - c[0]) / c[2], b = (y - c[1]) / c[3]; return a * a + b * b <= 1 && y < c[1] - 3.5; }, 1));
        g.px(c[0] - 6, c[1] - 6, '#4d6076'); g.px(c[0], c[1] - 8, '#4d6076'); g.px(c[0] + 6, c[1] - 6, '#4d6076');
        g.oy -= j;
      });
      for (let d = 0; d < 4; d++) { const x = Math.round(8 + ((f * 1.6) % 48)) + d, y = 26 + d, z = g.at(x, y); if (z && (z === zh[0] || z === zh[1])) g.px(x, y, WHITE); }
      g.buddy(40, 34);
      g.face = { x: 22, y: 33, hg: 1 };
    },
  });

  def('mycoplasma', {
    th: 'ไมโคพลาสมา นิวโมเนียอี', sci: 'Mycoplasma pneumoniae', rarity: 'uncommon', gram: 'ไม่มีผนังเซลล์', shape: 'ก้อนเจลลี่ไร้รูปทรง',
    trait: 'ไม่มีผนังเซลล์ จึงเป็นก้อนนิ่มเปลี่ยนรูปได้ (pleomorphic) มี "ปุ่มจมูก" ไว้เกาะและไถล — เพนิซิลลินจึงไม่ได้ผล',
    ol: '#5a1f3d', sx: 27, sy: 22, pal: [pal('#f8b4d0', '#ffe1ee', '#d9739f'), pal('#e58cb4', '#ffc4de', '#b24f80')],
    draw(g, t, f) {
      const cx = 29, cy = 34;
      for (let k = 0; k < 24; k += 2) { const a = k * PI / 12 + t * 0.4; g.bpx(cx + cos(a) * 19, cy + sin(a) * 18, '#f8b4d0'); }
      g.fill(cx - 19, cy - 19, cx + 19, cy + 19, (x, y) => { const dx = x - cx, dy = y - cy, a = Math.atan2(dy, dx), r = 12.5 + 2 * sin(2 * a + t * 1.8) + 1.5 * sin(3 * a - t * 2.4) + 0.9 * sin(5 * a + t * 3.1); return dx * dx + dy * dy <= r * r; }, 0);
      g.cap(38, 34, 46, 34, 3.2, 1);
      g.wave(49, 34, 0, 8, 1.5, 0.9, 6, '#e58cb4', false, 0);
      [[-8, 6], [7, 8], [-6, -8], [9, -6], [2, 10], [-11, -1]].forEach((p, i) => g.px(cx + p[0] + Math.round(sin(t * 1.5 + i) * 1), cy + p[1] + Math.round(cos(t * 1.3 + i)), '#d9739f'));
      g.gloss(21, 26);
      g.face = { x: 29, y: 30, hg: 2 };
    },
  });

  def('yersinia', {
    th: 'เยอร์ซิเนีย เพสทิส', sci: 'Yersinia pestis', rarity: 'uncommon', gram: 'แกรมลบ', shape: 'แท่งสั้นป้อม ย้อมติดสองขั้ว',
    trait: 'แท่งสั้นป้อมย้อมติดสีเข้มที่ปลายสองด้าน (เหมือนเข็มกลัด) ต้นเหตุกาฬโรค แพร่ผ่านหมัดหนู',
    ol: '#0f3d2c', sx: 28, sy: 24, gl: [46, 6],
    pal: [pal('#76dc9f', '#c5ffe0', '#3eaa77'), pal('#2f8c68', '#58bf96', '#1b5e45', '#0a2a20'), pal('#2b2845', '#524d82', '#15122a', '#07051a'), pal('#c4415a', '#f07a90', '#8a2538', '#07051a')],
    draw(g, t, f) {
      g.ell(32, 38, 14.2, 10.6, 0);
      g.fill(16, 26, 48, 50, (x, y) => { const a = (x - 32) / 14.2, b = (y - 38) / 10.6; return a * a + b * b <= 1 && Math.abs(x - 32) > 9.4; }, 1);
      g.ell(32, 27, 18, 3.4, 2);
      g.fill(23, 14, 41, 27, (x, y) => x >= 24 && x <= 40 && y >= 15 && y <= 26, 2);
      g.fill(23, 21, 41, 26, (x, y) => x >= 24 && x <= 40 && y >= 22 && y <= 25, 3);
      [[40, 21], [41, 20], [42, 19], [43, 18], [43, 17], [42, 16]].forEach(p => g.px(p[0], p[1], '#e8465a'));
      g.px(43, 16, '#ff9aa8');
      const u = (f % 24) / 24, hy = 50 - 9 * 4 * u * (1 - u);
      g.spr(52, Math.round(hy) - 2, FLEA, { k: '#5a2a1a' });
      g.face = { x: 32, y: 34, hg: 2 };
    },
  });

  def('vibrio', {
    th: 'วิบริโอ คอเลอรี', sci: 'Vibrio cholerae', rarity: 'uncommon', gram: 'แกรมลบ', shape: 'แท่งโค้งคล้ายจุลภาค',
    trait: 'แท่งโค้งเหมือนเครื่องหมายจุลภาค (comma) มีแฟลเจลลาปลายเดียว ว่ายพุ่งเร็ว อยู่ในน้ำ ต้นเหตุอหิวาตกโรค',
    ol: '#0c3c3c', sx: 28, sy: 22, pal: [pal('#62e3c2', '#bdfff0', '#2aa88f')],
    draw(g, t, f) {
      const pts = [], bow = 1 + 0.12 * sin(t * 2.1);
      for (let i = 0; i <= 20; i++) { const u = i / 20; pts.push([14 + 34 * u, 29 + 11 * sin(PI * u) * bow, 8.2 - 3.2 * u]); }
      for (let x = 3; x < 61; x++) { g.bpx(x, 54 + Math.round(sin(x * 0.4 - t * 3)), '#3f8fe0'); if (x % 2) g.bpx(x, 58 + Math.round(sin(x * 0.4 - t * 3 + 2)), '#2a63b8'); }
      g.wave(49, 28, -0.75, 19, 3.6, 0.5, 11, ['#2aa88f', '#9ff5e0'], false, 0);
      const z = g.nz();
      for (let i = 0; i < 20; i++) g.cap(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], pts[i][2], 0, z);
      [[8, 14], [56, 46], [6, 44]].forEach((d, i) => { const y = d[1] + ((f * 0.5 + i * 4) % 8); g.px(d[0], y, '#bfe8ff'); g.px(d[0], y + 1, '#6fb8ff'); g.px(d[0] + 1, y + 1, '#6fb8ff'); });
      g.gloss(17, 31);
      g.face = { x: 24, y: 34, hg: 1 };
    },
  });

  def('gardnerella', {
    th: 'การ์ดเนอเรลลา วาจินาลิส', sci: 'Gardnerella vaginalis', rarity: 'rare', gram: 'แกรมแปรผัน', shape: 'แท่งสั้นป้อม เกาะเซลล์เยื่อบุ',
    trait: 'ย้อมแกรมได้ทั้งบวกและลบ (สีม่วงผสมเขียว) เกาะผิวเซลล์เยื่อบุเกิด "clue cell" และปล่อยกลิ่นคาวปลา',
    ol: '#1f1a4a', sx: 28, sy: 24,
    pal: [{ pick: (x, y) => (x < 27 ? 1 : x > 36 ? 2 : (((x + y) & 1) ? 1 : 2)) }, pal('#a98cf5', '#dcd0ff', '#6b4fc7'), pal('#78dca0', '#c8ffe0', '#3ca874')],
    draw(g, t, f) {
      g.bell(32, 34, 29, 23, '#f6c7da', 2);
      for (let k = 0; k < 18; k++) if (((f >> 1) + k) % 5) { const a = k / 18 * 2 * PI + 0.2, x = 32 + cos(a) * 28, y = 34 + sin(a) * 22, c = (k & 1) ? '#a98cf5' : '#78dca0'; g.bpx(x, y, c); g.bpx(x + 1, y, c); }
      [22, 32, 42].forEach((x, i) => g.wave(x, 22, -PI / 2, 12, 2.2, 0.6, 5, ['#9be36a', '#d7ff9f'], false, i * 1.7));
      g.ell(32, 35, 13.5, 11, 0); g.gloss(24, 28);
      g.face = { x: 32, y: 31, hg: 2 };
    },
  });

  def('sars2', {
    th: 'SARS-CoV-2', sci: 'COVID-19', rarity: 'epic', gram: 'ไวรัส', shape: 'ทรงกลม + หนามรูปมงกุฎ',
    trait: 'ไวรัสทรงกลมมีเยื่อหุ้ม หนามโปรตีน S ล้อมรอบเหมือนมงกุฎ (corona) ข้างในมีสาย RNA ขดอยู่',
    ol: '#0d3b45', sx: 28, sy: 26, gl: [47, 5],
    pal: [pal('#8ceee0', '#d6fff8', '#35b9b0', '#0d3b45'), pal('#33406b', '#4d60a0', '#1e2749', '#0d3b45')],
    draw(g, t) {
      const cx = 32, cy = 37;
      g.ell(cx, cy, 14, 14, 0); g.ell(cx, cy, 10.6, 10.6, 1);
      for (let k = 0; k < 44; k++) { const a = k * 0.2 + t * 0.9, rr = 8.2 + sin(k * 0.8) * 1.2; g.px(cx + cos(a) * rr, cy + sin(a) * rr * 0.95, (k & 1) ? '#7be3d4' : '#4fb3b9'); }
      for (let i = 0; i < 16; i++) {
        const a = i * PI / 8 + t * 0.35, len = 7 + 1.2 * sin(t * 3 + i * 0.9), ca = cos(a), sa = sin(a);
        for (let d = 0; d <= len; d++) g.px(cx + ca * (13.4 + d), cy + sa * (13.4 + d), '#e6f1ff');
        const ex = cx + ca * (14.4 + len), ey = cy + sa * (14.4 + len);
        g.px(ex, ey, '#d6fff8'); g.px(ex + 1, ey, '#4fe6cf'); g.px(ex - 1, ey, '#4fe6cf'); g.px(ex, ey + 1, '#4fe6cf'); g.px(ex, ey - 1, '#4fe6cf');
      }
      g.spr(27, 3 + Math.round(sin(t * 2.5)), CROWN, { y: '#ffd24a', l: '#fff0a0', d: '#c98a1a', r: '#ff4d6d', c: '#5ff0d6' });
      g.face = { x: 32, y: 33, hg: 2 };
    },
  });

  def('ebola', {
    th: 'Ebola virus', sci: 'Ebola disease', rarity: 'legendary', gram: 'ไวรัส', shape: 'เส้นยาว ปลายขดเป็นตะขอ',
    trait: 'ไวรัสรูปเส้นด้ายยาว (filovirus) ปลายงอเป็นตะขอคล้ายไม้เท้าคนเลี้ยงแกะ มีหนามไกลโคโปรตีนเต็มผิว',
    ol: '#4a0f2b', sx: 30, sy: 26, gl: [4, 4], pal: [pal('#ffb79b', '#ffe3d3', '#e0687e', '#4a0f2b')],
    draw(g, t, f) {
      const pts = [];
      for (let x = 4; x <= 40; x += 1.5) { const k = 1 - (x - 4) / 36; pts.push([x, 46 + 3.6 * k * sin(x * 0.3 - t * 3.2)]); }
      const end = -150 - 8 * sin(t * 1.3);
      for (let a = 90; a >= end; a -= 7) { const r = a * PI / 180; pts.push([40 + 13 * cos(r), 33 + 13 * sin(r)]); }
      const z = g.nz();
      for (let i = 0; i < pts.length - 1; i++) g.cap(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], 6.3, 0, z);
      for (let i = 2; i < pts.length - 2; i += 2) {
        const p = pts[i], a = pts[i - 1], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
        for (let s = -1; s <= 1; s += 2) { const tx = p[0] + nx * 11.2 * s, ty = p[1] + ny * 11.2 * s; g.line(p[0] + nx * 7 * s, p[1] + ny * 7 * s, tx, ty, '#ff4f6e'); g.px(tx, ty, '#ffe08a'); g.px(tx + nx * s, ty + ny * s, '#fff2c4'); }
      }
      [[8, 0], [20, 3], [34, 5], [48, 2], [56, 6], [14, 8], [40, 9]].forEach((e, i) => {
        const y = 56 - ((f * 0.8 + e[1] * 5.3) % 50);
        g.px(e[0] + Math.round(sin(f * 0.25 + i) * 2), y, i % 3 === 0 ? '#ffd23f' : i % 3 === 1 ? '#ff9f40' : '#ff5a5a');
      });
      g.gloss(50, 26);
      g.face = { x: 53, y: 29, hg: 1 };
    },
  });

  // ───────────────────────── ตัวละคร (state + แอนิเมชัน) ─────────────────────────
  class Microbe {
    constructor(id, opts) {
      const sp = S[id]; if (!sp) throw new Error('ไม่รู้จักเชื้อ: ' + id);
      opts = opts || {};
      this.id = id; this.sp = sp; this.rar = RARITY[opts.rarity || sp.rarity] || RARITY.common;
      this.rarity = opts.rarity || sp.rarity;
      this.rng = mulberry(opts.seed != null ? opts.seed : hashStr(id));
      this.g = new Grid();
      this.f = (this.rng() * 60) | 0; this.acc = 0; this.ph = this.rng() * 6.28; this.ph0 = (this.rng() * 60) | 0;
      this.expr = 'smile'; this.t0 = this.f; this.look = 1; this.blink = false; this.blinkEnd = 0;
      this.nextBlink = this.f + 20; this.nextLook = this.f + 12; this.nextExpr = this.f + 20 + ((this.rng() * 30) | 0);
      this.auto = opts.autoExpression !== false; this.dirty = true;
      this.stars = []; for (let i = 0; i < this.rar.stars; i++) this.stars.push({ T: 1.2 + this.rng() * 1.5, ph: this.rng() });
      this.pixels = this.g.out;
      if (!opts.headless && typeof document !== 'undefined') {
        this.canvas = document.createElement('canvas'); this.canvas.width = this.canvas.height = W;
        this.ctx = this.canvas.getContext('2d'); this.img = this.ctx.createImageData(W, W); this.u32 = new Uint32Array(this.img.data.buffer);
      }
    }
    setExpression(name) {
      if (!name || name === 'random') { this.auto = true; this.nextExpr = this.f; }
      else if (EXPR_W[name]) { this.auto = false; this.expr = name; this.t0 = this.f; }
      this.dirty = true;
    }
    pickExpr() {
      let tot = 0; for (const k in EXPR_W) if (k !== this.expr) tot += EXPR_W[k];
      let x = this.rng() * tot;
      for (const k in EXPR_W) { if (k === this.expr) continue; x -= EXPR_W[k]; if (x <= 0) { this.expr = k; break; } }
      this.t0 = this.f; this.nextExpr = this.f + 30 + ((this.rng() * 36) | 0);
    }
    tick() {
      const f = this.f, r = this.rng;
      if (f >= this.blinkEnd && f >= this.nextBlink) { this.blinkEnd = f + 2; this.nextBlink = f + 26 + ((r() * 40) | 0); }
      this.blink = f < this.blinkEnd;
      if (f >= this.nextLook) { this.look = (r() * 3) | 0; this.nextLook = f + 10 + ((r() * 30) | 0); }
      if (this.auto && f >= this.nextExpr) this.pickExpr();
    }
    update(dt) {
      this.acc = Math.min(0.5, this.acc + dt); let adv = false;
      while (this.acc >= 1 / FPS) { this.acc -= 1 / FPS; this.f++; this.tick(); adv = true; }
      if (adv) this.dirty = true;
      return adv;
    }
    render() {
      const g = this.g, f = this.f, e = this.expr, age = f - this.t0;
      g.begin(this, f);
      g.oy = Math.round(sin(g.t * 2.4 + this.ph) * 1.4);
      if (e === 'angry') g.ox += (f & 1) ? 1 : -1;
      else if (e === 'cry') g.ox += ((f >> 1) & 1) ? 1 : 0;
      else if (e === 'shy') g.ox += Math.round(sin(g.t * 2));
      else if (e === 'shocked' && age < 4) g.oy -= [5, 3, 1, 0][age];
      this.sp.draw(g, g.t, f);
      drawFace(g, this);
      if (this.sp.top) this.sp.top(g, g.t, f);
      drawFX(g, this);
      effects(g, this);
      g.finish(this);
      this.dirty = false;
      return this.pixels;
    }
    paint() { this.render(); this.u32.set(this.g.out); this.ctx.putImageData(this.img, 0, 0); }
    // วาดลง canvas ของเกมคุณ: x,y = มุมซ้ายบน, scale = ขยายกี่เท่า (ขนาดจริง 64×64 พิกเซล)
    draw(ctx, x, y, scale) {
      scale = scale || 4;
      if (this.dirty) this.paint();
      const old = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.canvas, x, y, W * scale, W * scale);
      ctx.imageSmoothingEnabled = old;
    }
  }

  const species = ORDER.map(id => { const s = S[id]; return { id, th: s.th, sci: s.sci, rarity: s.rarity, gram: s.gram, shape: s.shape, trait: s.trait }; });

  return {
    W, FPS, species, rarities: RARITY, expressions: EXPRESSIONS, ids: ORDER.slice(),
    make: (id, opts) => new Microbe(id, opts),
    attach(id, canvas, opts) {
      opts = opts || {};
      const m = new Microbe(id, opts), scale = opts.scale || 6, ctx = canvas.getContext('2d');
      canvas.width = canvas.height = W * scale;
      let raf = 0, last = 0, run = false;
      const paint = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); m.draw(ctx, 0, 0, scale); };
      const loop = now => { if (!run) return; const dt = (now - last) / 1000; last = now; if (m.update(dt)) paint(); raf = requestAnimationFrame(loop); };
      const ctl = {
        microbe: m,
        start() { if (run) return; run = true; last = performance.now(); raf = requestAnimationFrame(loop); },
        stop() { run = false; cancelAnimationFrame(raf); },
        setExpression(n) { m.setExpression(n); paint(); },
        destroy() { ctl.stop(); },
      };
      paint();
      if (opts.autoplay !== false) ctl.start();
      return ctl;
    },
  };
});
