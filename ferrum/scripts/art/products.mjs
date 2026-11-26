// Générateur de visuels produits FERRUM (SVG paramétriques, rendu "studio").
// Chaque fonction renvoie un fragment SVG pour un canevas 1200x1200.
// `p` = préfixe d'identifiants (évite les collisions quand on compose un pack).

export const PALETTES = {
  noir: { base: "#24252a", hi: "#4a4c53", lo: "#0d0e10", stitch: "#8d8f96", accent: "#e0262f" },
  rouge: { base: "#a3161d", hi: "#e0393f", lo: "#4d070b", stitch: "#f0b9b9", accent: "#1c1d21" },
  gris: { base: "#5c6068", hi: "#9095a0", lo: "#2a2c31", stitch: "#d6d8dc", accent: "#e0262f" },
  kaki: { base: "#4b5236", hi: "#7b8460", lo: "#23271a", stitch: "#c9cfb0", accent: "#e0262f" },
  sable: { base: "#c9bba0", hi: "#efe5d1", lo: "#8b7d63", stitch: "#ffffff", accent: "#1c1d21" },
  marron: { base: "#5a3521", hi: "#8e5a3a", lo: "#28150b", stitch: "#d8b48d", accent: "#e0262f" },
  blanc: { base: "#d9d6cf", hi: "#ffffff", lo: "#8e8b85", stitch: "#55575d", accent: "#e0262f" },
};

const METAL = (p) => `
  <linearGradient id="${p}metal" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f4f5f7"/><stop offset=".35" stop-color="#9aa0a8"/>
    <stop offset=".55" stop-color="#5b6068"/><stop offset=".8" stop-color="#c9ced4"/><stop offset="1" stop-color="#6d727a"/>
  </linearGradient>
  <linearGradient id="${p}metalH" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#5b6068"/><stop offset=".3" stop-color="#e9ecef"/>
    <stop offset=".6" stop-color="#8a9098"/><stop offset="1" stop-color="#3f434a"/>
  </linearGradient>`;

const cyl = (id, c, dir = "x") => `
  <linearGradient id="${id}" x1="0" y1="0" x2="${dir === "x" ? 1 : 0}" y2="${dir === "x" ? 0 : 1}">
    <stop offset="0" stop-color="${c.lo}"/><stop offset=".28" stop-color="${c.base}"/>
    <stop offset=".46" stop-color="${c.hi}"/><stop offset=".62" stop-color="${c.base}"/>
    <stop offset="1" stop-color="${c.lo}"/>
  </linearGradient>`;

// Contour cousu : bord sombre + points de couture + face principale.
const stitched = (d, w, c, extra = "") => `
  <path d="${d}" fill="none" stroke="${c.hi}" stroke-width="${w + 5}" stroke-linecap="round" stroke-linejoin="round" opacity=".55" ${extra}/>
  <path d="${d}" fill="none" stroke="${c.lo}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>
  <path d="${d}" fill="none" stroke="${c.stitch}" stroke-width="${w - 12}" stroke-dasharray="9 7" stroke-linecap="butt" stroke-linejoin="round" opacity=".9" ${extra}/>
  <path d="${d}" fill="none" stroke="${c.base}" stroke-width="${w - 18}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

const label = (x, y, w, h, text, c, size = 30, rot = 0) => `
  <g transform="translate(${x} ${y}) rotate(${rot})">
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="6" fill="#121316" stroke="${c.stitch}" stroke-width="2" stroke-dasharray="5 4"/>
    <text x="0" y="${size * 0.36}" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="${size}" letter-spacing="3" fill="#edeae3">${text}</text>
  </g>`;

/* ---------------------------------------------------------------- Sangles Figure 8 */
export function figure8(c, p = "f8") {
  const strap = (tx, ty, rot, s) => `
    <g transform="translate(${tx} ${ty}) rotate(${rot}) scale(${s})">
      ${stitched("M0,0 C-150,-40 -170,-330 0,-330 C170,-330 150,-40 0,0 C-150,40 -170,330 0,330 C170,330 150,40 0,0 Z", 96, c)}
      <path d="M0,0 C-150,-40 -170,-330 0,-330 C170,-330 150,-40 0,0" fill="none" stroke="url(#${p}sheen)" stroke-width="70" opacity=".55"/>
      <rect x="-62" y="-46" width="124" height="92" rx="14" fill="${c.lo}"/>
      ${label(0, 0, 112, 64, "FERRUM", c, 26)}
    </g>`;
  return `
  <defs>
    <linearGradient id="${p}sheen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".45" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  ${strap(470, 560, -28, 0.95)}
  ${strap(740, 600, 22, 0.95)}`;
}

/* ---------------------------------------------------------------- Sangles lasso */
export function lasso(c, p = "ls") {
  const one = (tx, ty, rot) => `
    <g transform="translate(${tx} ${ty}) rotate(${rot})">
      ${stitched("M0,-120 C-95,-120 -95,40 0,40 C95,40 95,-120 0,-120", 64, c)}
      ${stitched("M0,40 C10,200 -40,420 30,620", 74, c)}
      <rect x="-70" y="10" width="140" height="230" rx="38" fill="${c.lo}"/>
      <rect x="-62" y="18" width="124" height="214" rx="32" fill="url(#${p}pad)"/>
      <path d="M-50,30 L-50,220 M50,30 L50,220" stroke="${c.stitch}" stroke-width="3" stroke-dasharray="8 6" opacity=".8"/>
      <text transform="translate(8 128) rotate(-90)" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="46" letter-spacing="4" fill="#edeae3">FERRUM</text>
    </g>`;
  return `
  <defs>${cyl(`${p}pad`, c)}</defs>
  ${one(470, 360, 14)}
  ${one(720, 330, -10)}`;
}

/* ---------------------------------------------------------------- Ceinture à levier */
export function leverBelt(c, p = "lb", lining = "#8f1d22") {
  const cx = 600, top = 440, bot = 680, rx = 400, ry = 160;
  const arcF = (y) => `M${cx - rx},${y} A${rx},${ry} 0 0 0 ${cx + rx},${y}`;
  return `
  <defs>
    ${METAL(p)}
    <linearGradient id="${p}leather" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${c.lo}"/><stop offset=".22" stop-color="${c.base}"/><stop offset=".5" stop-color="${c.hi}"/>
      <stop offset=".78" stop-color="${c.base}"/><stop offset="1" stop-color="${c.lo}"/>
    </linearGradient>
    <linearGradient id="${p}lining" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${lining}" stop-opacity=".55"/><stop offset=".5" stop-color="${lining}"/><stop offset="1" stop-color="${lining}" stop-opacity=".55"/>
    </linearGradient>
    <linearGradient id="${p}shadeV" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/>
    </linearGradient>
    <path id="${p}txt" d="${arcF(575)}"/>
  </defs>
  <!-- intérieur (doublure) -->
  <path d="M${cx - rx},${top} A${rx},${ry} 0 0 1 ${cx + rx},${top} L${cx + rx},${bot} A${rx},${ry} 0 0 0 ${cx - rx},${bot} Z" fill="url(#${p}lining)"/>
  <path d="M${cx - rx},${top} A${rx},${ry} 0 0 1 ${cx + rx},${top} L${cx + rx},${bot} A${rx},${ry} 0 0 0 ${cx - rx},${bot} Z" fill="url(#${p}shadeV)"/>
  <ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="none" stroke="${c.hi}" stroke-width="12"/>
  <ellipse cx="${cx}" cy="${top}" rx="${rx - 6}" ry="${ry - 6}" fill="none" stroke="${c.lo}" stroke-width="4" opacity=".7"/>
  <!-- face avant -->
  <path d="${arcF(top)} L${cx + rx},${bot} A${rx},${ry} 0 0 1 ${cx - rx},${bot} Z" fill="url(#${p}leather)"/>
  <path d="${arcF(top)} L${cx + rx},${bot} A${rx},${ry} 0 0 1 ${cx - rx},${bot} Z" fill="url(#${p}shadeV)"/>
  <path d="${arcF(top + 26)}" fill="none" stroke="${c.stitch}" stroke-width="3.5" stroke-dasharray="11 8"/>
  <path d="${arcF(bot - 26)}" fill="none" stroke="${c.stitch}" stroke-width="3.5" stroke-dasharray="11 8"/>
  <path d="${arcF(top + 4)}" fill="none" stroke="${c.hi}" stroke-width="5" opacity=".6"/>
  <text font-family="Barlow Condensed" font-weight="800" font-size="78" letter-spacing="14" fill="#000" opacity=".55">
    <textPath href="#${p}txt" startOffset="18%">FERRUM</textPath>
  </text>
  <text font-family="Barlow Condensed" font-weight="800" font-size="78" letter-spacing="14" fill="${c.stitch}" opacity=".75" transform="translate(-2 -3)">
    <textPath href="#${p}txt" startOffset="18%">FERRUM</textPath>
  </text>
  <!-- boucle à levier -->
  <g transform="translate(${cx + 120} ${top + ry - 16}) rotate(-9)">
    <rect x="-20" y="18" width="190" height="196" rx="14" fill="#0b0c0e" opacity=".5"/>
    <rect x="-28" y="6" width="190" height="200" rx="16" fill="url(#${p}metalH)" stroke="#2b2e33" stroke-width="3"/>
    <rect x="-8" y="26" width="150" height="160" rx="10" fill="url(#${p}metal)" opacity=".9"/>
    <rect x="18" y="58" width="98" height="96" rx="8" fill="#2b2e33"/>
    <rect x="26" y="66" width="82" height="80" rx="6" fill="url(#${p}metalH)"/>
    <circle cx="10" cy="40" r="9" fill="#3a3e45"/><circle cx="124" cy="40" r="9" fill="#3a3e45"/>
    <circle cx="10" cy="172" r="9" fill="#3a3e45"/><circle cx="124" cy="172" r="9" fill="#3a3e45"/>
    <path d="M6,40 h8 M120,40 h8 M6,172 h8 M120,172 h8" stroke="#9aa0a8" stroke-width="3"/>
  </g>
  <text x="${cx - 250}" y="${bot - 48}" font-family="Barlow Condensed" font-weight="700" font-size="30" letter-spacing="6" fill="${c.stitch}" opacity=".8" transform="rotate(8 ${cx - 250} ${bot - 48})">10 MM</text>`;
}

/* ---------------------------------------------------------------- Bandes de poignets */
export function wristWraps(c, p = "ww") {
  const roll = (tx, ty, s) => `
    <g transform="translate(${tx} ${ty}) scale(${s})">
      <!-- queue posée -->
      <path d="M40,150 C200,190 420,180 560,150" fill="none" stroke="${c.lo}" stroke-width="128" stroke-linecap="round"/>
      <path d="M40,150 C200,190 420,180 560,150" fill="none" stroke="url(#${p}band)" stroke-width="116"/>
      <path d="M40,150 C200,190 420,180 560,150" fill="none" stroke="${c.accent}" stroke-width="12" opacity=".9"/>
      <rect x="380" y="98" width="150" height="104" rx="10" fill="#161719" transform="rotate(-4 455 150)"/>
      <rect x="388" y="106" width="134" height="88" rx="8" fill="url(#${p}velcro)" transform="rotate(-4 455 150)"/>
      <path d="M560,150 C640,120 690,170 650,215 C610,255 560,205 600,170" fill="none" stroke="${c.lo}" stroke-width="22" stroke-linecap="round"/>
      <!-- rouleau -->
      <rect x="-140" y="-150" width="180" height="300" fill="url(#${p}roll)"/>
      <path d="M-140,-150 L40,-150 M-140,150 L40,150" stroke="${c.lo}" stroke-width="4"/>
      <ellipse cx="40" cy="0" rx="92" ry="150" fill="${c.lo}"/>
      <ellipse cx="-140" cy="0" rx="92" ry="150" fill="${c.base}"/>
      ${[0.86, 0.72, 0.58, 0.44].map((k, i) => `<ellipse cx="-140" cy="0" rx="${92 * k}" ry="${150 * k}" fill="none" stroke="${i % 2 ? c.hi : c.lo}" stroke-width="7" opacity=".85"/>`).join("")}
      <ellipse cx="-140" cy="0" rx="26" ry="42" fill="#0a0a0b"/>
      <path d="M-50,-150 L-50,150" stroke="${c.accent}" stroke-width="14" opacity=".9"/>
    </g>`;
  return `
  <defs>
    ${cyl(`${p}roll`, c, "y")}
    <linearGradient id="${p}band" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c.hi}"/><stop offset=".5" stop-color="${c.base}"/><stop offset="1" stop-color="${c.lo}"/>
    </linearGradient>
    <pattern id="${p}velcro" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#2a2b2f"/><circle cx="4" cy="4" r="2" fill="#3c3e44"/>
    </pattern>
  </defs>
  ${roll(430, 420, 1)}
  ${roll(420, 760, 0.82)}
  ${label(860, 562, 150, 58, "FERRUM", c, 30, -4)}`;
}

/* ---------------------------------------------------------------- Genouillères 7 mm */
export function kneeSleeves(c, p = "ks") {
  const sleeve = (tx, ty, s) => `
    <g transform="translate(${tx} ${ty}) scale(${s})">
      <path d="M-150,-330 C-150,-200 -120,-60 -122,40 C-124,140 -140,230 -136,320 L136,320 C140,230 124,140 122,40 C120,-60 150,-200 150,-330 Z" fill="url(#${p}body)"/>
      <path d="M-150,-330 C-150,-200 -120,-60 -122,40 C-124,140 -140,230 -136,320 L136,320 C140,230 124,140 122,40 C120,-60 150,-200 150,-330 Z" fill="url(#${p}shadeV)"/>
      <path d="M-122,40 C-60,62 60,62 122,40" fill="none" stroke="#000" stroke-width="10" opacity=".25"/>
      <ellipse cx="0" cy="320" rx="136" ry="32" fill="${c.lo}"/>
      <path d="M-136,320 A136,32 0 0 0 136,320" fill="none" stroke="#0e0f11" stroke-width="22"/>
      <ellipse cx="0" cy="-330" rx="150" ry="38" fill="#2c2e33"/>
      <ellipse cx="0" cy="-326" rx="139" ry="31" fill="#0c0d0f"/>
      <path d="M-150,-330 A150,38 0 0 0 150,-330" fill="none" stroke="#141518" stroke-width="20"/>
      <path d="M-150,-318 A150,38 0 0 0 150,-318" fill="none" stroke="${c.stitch}" stroke-width="3" stroke-dasharray="9 7"/>
      <path d="M-137,302 A136,32 0 0 0 137,302" fill="none" stroke="${c.stitch}" stroke-width="3" stroke-dasharray="9 7"/>
      <path d="M-140,-150 C-60,-122 60,-122 140,-150" fill="none" stroke="${c.accent}" stroke-width="16" opacity=".95"/>
      <text x="0" y="-30" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="70" letter-spacing="8" fill="#edeae3" opacity=".92">FERRUM</text>
      <text x="0" y="22" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="32" letter-spacing="10" fill="${c.stitch}">7 MM</text>
      <path d="M-120,120 C-118,180 -128,250 -126,300" stroke="#fff" stroke-width="10" opacity=".08" fill="none"/>
    </g>`;
  return `
  <defs>
    ${cyl(`${p}body`, c)}
    <linearGradient id="${p}shadeV" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity=".25"/><stop offset=".2" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/>
    </linearGradient>
  </defs>
  ${sleeve(450, 540, 0.92)}
  ${sleeve(760, 580, 0.92)}`;
}

/* ---------------------------------------------------------------- Magnésie liquide */
export function liquidChalk(c, p = "lc", duo = false) {
  const bottle = (tx, ty, s, ml) => `
    <g transform="translate(${tx} ${ty}) scale(${s})">
      <rect x="-60" y="-330" width="120" height="90" rx="18" fill="url(#${p}cap)"/>
      <rect x="-44" y="-360" width="88" height="40" rx="12" fill="#17181b"/>
      <path d="M-30,-358 h60" stroke="#55585f" stroke-width="5"/>
      <path d="M-70,-245 C-150,-230 -150,-200 -150,-150 L-150,300 C-150,330 -130,350 -100,350 L100,350 C130,350 150,330 150,300 L150,-150 C150,-200 150,-230 70,-245 Z" fill="url(#${p}body)"/>
      <rect x="-150" y="-80" width="300" height="300" fill="#edeae3"/>
      <rect x="-150" y="-80" width="300" height="300" fill="url(#${p}labelShade)"/>
      <rect x="-150" y="-80" width="300" height="18" fill="${c.accent}"/>
      <text x="0" y="0" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="40" letter-spacing="8" fill="#1c1d21">FERRUM</text>
      <text x="0" y="96" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="112" fill="#1c1d21">GRIP</text>
      <text x="0" y="140" text-anchor="middle" font-family="Barlow" font-weight="600" font-size="22" letter-spacing="2" fill="#4a4d55">MAGNÉSIE LIQUIDE</text>
      <text x="0" y="194" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="30" fill="#1c1d21">${ml} ML</text>
      <path d="M-120,-230 C-128,-120 -128,180 -120,320" stroke="#fff" stroke-width="10" opacity=".18" fill="none"/>
    </g>`;
  const dust = Array.from({ length: 46 }, (_, i) => {
    const a = (i * 137.5 * Math.PI) / 180, r = 140 + ((i * 53) % 260);
    const x = 600 + Math.cos(a) * r * 1.6, y = 950 + Math.sin(a) * r * 0.22;
    return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${3 + (i % 5) * 2}" fill="#f3f1ec" opacity="${0.25 + (i % 4) * 0.15}"/>`;
  }).join("");
  return `
  <defs>
    ${cyl(`${p}body`, c)}
    <linearGradient id="${p}cap" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d0e10"/><stop offset=".45" stop-color="#3a3c42"/><stop offset="1" stop-color="#0d0e10"/></linearGradient>
    <linearGradient id="${p}labelShade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/>
    </linearGradient>
    <filter id="${p}blur"><feGaussianBlur stdDeviation="2.5"/></filter>
  </defs>
  <g filter="url(#${p}blur)">${dust}</g>
  ${duo ? bottle(440, 590, 0.95, 100) + bottle(770, 620, 0.95, 100) : bottle(600, 580, 1.05, 100)}`;
}

/* ---------------------------------------------------------------- Gourde isotherme 2 L */
export function bottle2l(c, p = "bt") {
  const marks = ["08H", "10H", "12H", "14H", "16H", "18H"];
  return `
  <defs>
    ${METAL(p)}
    ${cyl(`${p}body`, c)}
    <linearGradient id="${p}lid" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d0e10"/><stop offset=".45" stop-color="#43464d"/><stop offset="1" stop-color="#0d0e10"/></linearGradient>
  </defs>
  <g transform="translate(600 600)">
    <path d="M-120,-388 C-120,-450 120,-450 120,-388" fill="none" stroke="#111214" stroke-width="34" stroke-linecap="round"/>
    <path d="M-120,-388 C-120,-450 120,-450 120,-388" fill="none" stroke="#3a3c42" stroke-width="18" stroke-linecap="round"/>
    <rect x="-34" y="-420" width="68" height="60" rx="14" fill="#16171a"/>
    <rect x="-150" y="-380" width="300" height="96" rx="26" fill="url(#${p}lid)"/>
    <rect x="-152" y="-292" width="304" height="20" fill="url(#${p}metalH)"/>
    <path d="M-152,-272 C-200,-250 -200,-200 -200,-140 L-200,370 C-200,410 -170,430 -130,430 L130,430 C170,430 200,410 200,370 L200,-140 C200,-200 200,-250 152,-272 Z" fill="url(#${p}body)"/>
    ${marks.map((m, i) => {
      const y = -150 + i * 88;
      return `<path d="M60,${y} h60" stroke="${c.stitch}" stroke-width="4" opacity=".85"/><text x="130" y="${y + 10}" font-family="Barlow Condensed" font-weight="700" font-size="28" fill="${c.stitch}" opacity=".9">${m}</text>`;
    }).join("")}
    <text transform="translate(-60 120) rotate(-90)" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="88" letter-spacing="12" fill="${c.stitch}" opacity=".95">FERRUM</text>
    <text transform="translate(10 120) rotate(-90)" text-anchor="middle" font-family="Barlow" font-weight="600" font-size="24" letter-spacing="6" fill="${c.stitch}" opacity=".7">BOIS · SOULÈVE · RÉPÈTE</text>
    <path d="M-150,-200 C-160,-60 -160,250 -150,400" stroke="#fff" stroke-width="16" opacity=".14" fill="none"/>
    <rect x="-200" y="380" width="400" height="50" rx="20" fill="#000" opacity=".25"/>
  </g>`;
}

/* ---------------------------------------------------------------- Sac de sport */
export function gymBag(c, p = "gb") {
  return `
  <defs>
    ${cyl(`${p}body`, c, "y")}
    <linearGradient id="${p}end" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c.lo}"/><stop offset="1" stop-color="${c.base}"/></linearGradient>
  </defs>
  <!-- bandoulière -->
  <path d="M260,560 C300,180 900,180 950,560" fill="none" stroke="#141518" stroke-width="40"/>
  <path d="M260,560 C300,180 900,180 950,560" fill="none" stroke="${c.lo}" stroke-width="30"/>
  <rect x="560" y="236" width="90" height="44" rx="12" fill="#1b1c1f" transform="rotate(2 605 258)"/>
  <!-- corps -->
  <path d="M200,560 C200,430 300,400 420,400 L820,400 C940,400 1010,440 1010,560 L1010,820 C1010,850 990,870 960,870 L250,870 C220,870 200,850 200,820 Z" fill="url(#${p}body)"/>
  <!-- face latérale + compartiment chaussures -->
  <path d="M820,400 C940,400 1010,440 1010,560 L1010,820 C1010,850 990,870 960,870 L860,870 C900,760 900,520 820,400 Z" fill="url(#${p}end)" opacity=".9"/>
  <path d="M880,520 C935,560 945,760 905,830" fill="none" stroke="#0d0e10" stroke-width="16" stroke-linecap="round"/>
  <path d="M880,520 C935,560 945,760 905,830" fill="none" stroke="#5a5d64" stroke-width="6" stroke-dasharray="4 4"/>
  <rect x="902" y="812" width="16" height="44" rx="6" fill="url(#${p}metalH)"/>
  <!-- fermeture du haut -->
  <path d="M300,440 C420,412 780,412 900,440" fill="none" stroke="#0d0e10" stroke-width="18" stroke-linecap="round"/>
  <path d="M300,440 C420,412 780,412 900,440" fill="none" stroke="#6a6d74" stroke-width="6" stroke-dasharray="4 4"/>
  ${METAL(p)}
  <!-- poignées -->
  <path d="M470,430 C480,300 620,300 630,430" fill="none" stroke="#111214" stroke-width="34" stroke-linecap="round"/>
  <path d="M470,430 C480,300 620,300 630,430" fill="none" stroke="${c.lo}" stroke-width="22" stroke-linecap="round"/>
  <path d="M570,430 C580,310 720,310 730,430" fill="none" stroke="#111214" stroke-width="34" stroke-linecap="round"/>
  <path d="M570,430 C580,310 720,310 730,430" fill="none" stroke="${c.base}" stroke-width="22" stroke-linecap="round"/>
  <rect x="438" y="420" width="64" height="40" rx="8" fill="${c.lo}"/><rect x="698" y="420" width="64" height="40" rx="8" fill="${c.lo}"/>
  <!-- poche avant -->
  <rect x="300" y="590" width="440" height="210" rx="34" fill="${c.lo}" opacity=".55"/>
  <rect x="300" y="590" width="440" height="210" rx="34" fill="none" stroke="${c.stitch}" stroke-width="3" stroke-dasharray="10 7" opacity=".55"/>
  <path d="M330,620 L710,620" stroke="#0d0e10" stroke-width="12" stroke-linecap="round"/>
  <path d="M330,620 L710,620" stroke="#5a5d64" stroke-width="5" stroke-dasharray="4 4"/>
  ${label(520, 720, 210, 72, "FERRUM", c, 40)}
  <path d="M220,780 C400,800 800,800 990,780" fill="none" stroke="${c.accent}" stroke-width="10" opacity=".9"/>`;
}

/* ---------------------------------------------------------------- Ceinture de lest */
export function dipBelt(c, p = "db") {
  // chaîne le long d'une courbe quadratique
  const P0 = [270, 470], P1 = [600, 1080], P2 = [930, 470];
  const pt = (t) => [
    (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t ** 2 * P2[0],
    (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t ** 2 * P2[1],
  ];
  const n = 26;
  const links = Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n, [x, y] = pt(t), [x2, y2] = pt(Math.min(1, t + 0.01));
    const ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
    return i % 2
      ? `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="24" ry="5" transform="rotate(${ang.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="url(#${p}metal)"/>`
      : `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="24" ry="13" transform="rotate(${ang.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="none" stroke="url(#${p}metal)" stroke-width="6"/>`;
  }).join("");
  return `
  <defs>
    ${METAL(p)}
    ${cyl(`${p}belt`, c)}
  </defs>
  <!-- disque 20 kg -->
  <g transform="translate(600 900)">
    <circle r="210" fill="#1b3a8f"/><circle r="200" fill="#2f5bd3"/><circle r="168" fill="none" stroke="#244aaf" stroke-width="10"/>
    <circle r="62" fill="url(#${p}metalH)"/><circle r="30" fill="#141518"/>
    <text y="136" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="60" fill="#edeae3">20 KG</text>
  </g>
  ${links}
  <!-- ceinture -->
  <path d="M190,420 C330,300 870,300 1010,420 L1000,520 C870,440 330,440 200,520 Z" fill="url(#${p}belt)"/>
  <path d="M215,440 C340,340 860,340 985,440" fill="none" stroke="${c.stitch}" stroke-width="3" stroke-dasharray="10 7"/>
  <path d="M215,500 C340,420 860,420 985,500" fill="none" stroke="${c.stitch}" stroke-width="3" stroke-dasharray="10 7"/>
  <text x="600" y="420" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="54" letter-spacing="12" fill="#edeae3">FERRUM</text>
  <path d="M520,430 L680,430" stroke="${c.accent}" stroke-width="8"/>
  <!-- anneaux en D -->
  <path d="M195,430 C150,430 140,520 200,520" fill="none" stroke="url(#${p}metal)" stroke-width="14"/>
  <path d="M1005,430 C1050,430 1060,520 1000,520" fill="none" stroke="url(#${p}metal)" stroke-width="14"/>
  <!-- mousqueton -->
  <g transform="translate(930 470) rotate(25)">
    <rect x="-22" y="-10" width="44" height="78" rx="22" fill="none" stroke="url(#${p}metal)" stroke-width="10"/>
  </g>`;
}

/* ---------------------------------------------------------------- Crochets de tirage */
export function liftingHooks(c, p = "hk") {
  const hook = (tx, ty, s, flip) => `
    <g transform="translate(${tx} ${ty}) scale(${flip ? -s : s} ${s})">
      <path d="M-40,120 L-40,250 C-40,350 120,350 120,250 L120,210" fill="none" stroke="#0b0c0e" stroke-width="58" stroke-linecap="round"/>
      <path d="M-40,120 L-40,250 C-40,350 120,350 120,250 L120,210" fill="none" stroke="url(#${p}metalH)" stroke-width="44" stroke-linecap="round"/>
      <path d="M-40,140 L-40,250 C-40,350 120,350 120,250" fill="none" stroke="#1f2024" stroke-width="40" stroke-linecap="round" opacity=".85"/>
      <rect x="-90" y="70" width="100" height="90" rx="12" fill="url(#${p}metal)"/>
      <!-- manchette rembourrée -->
      <path d="M-200,-170 C-210,-40 -200,60 -190,100 L190,100 C200,60 210,-40 200,-170 Z" fill="url(#${p}cuff)"/>
      <ellipse cx="0" cy="-170" rx="200" ry="44" fill="#0c0d0f"/>
      <path d="M-200,-170 A200,44 0 0 0 200,-170" fill="none" stroke="${c.lo}" stroke-width="18"/>
      <path d="M-196,-150 A200,44 0 0 0 196,-150" fill="none" stroke="${c.stitch}" stroke-width="3" stroke-dasharray="9 7"/>
      <path d="M-190,80 C-60,104 60,104 190,80" fill="none" stroke="${c.stitch}" stroke-width="3" stroke-dasharray="9 7"/>
      <rect x="-120" y="-90" width="240" height="120" rx="12" fill="url(#${p}velcro)"/>
      <text x="0" y="-12" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="52" letter-spacing="6" fill="#edeae3" transform="scale(${flip ? -1 : 1} 1)">FERRUM</text>
    </g>`;
  return `
  <defs>
    ${METAL(p)}
    ${cyl(`${p}cuff`, c)}
    <pattern id="${p}velcro" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#232428"/><circle cx="4" cy="4" r="2" fill="#34363b"/></pattern>
  </defs>
  ${hook(410, 470, 0.9, false)}
  ${hook(800, 520, 0.9, true)}`;
}

/* ---------------------------------------------------------------- Bandes de traction */
export function pullBands() {
  const bands = [
    { col: "#f2c230", lo: "#9c7a12", w: 22, txt: "5–15 KG", tc: "#1c1d21" },
    { col: "#e0262f", lo: "#7c0f14", w: 30, txt: "15–25 KG", tc: "#edeae3" },
    { col: "#2a2b2f", lo: "#0d0e10", w: 38, txt: "25–35 KG", tc: "#edeae3" },
    { col: "#2f5bd3", lo: "#162f7a", w: 46, txt: "35–50 KG", tc: "#edeae3" },
    { col: "#2e9b5f", lo: "#145234", w: 56, txt: "50–70 KG", tc: "#edeae3" },
  ];
  return bands
    .map((b, i) => {
      const y = 300 + i * 132, x = 600 + (i % 2 ? 26 : -26);
      return `
      <g>
        <ellipse cx="${x}" cy="${y}" rx="400" ry="70" fill="none" stroke="${b.lo}" stroke-width="${b.w + 10}"/>
        <ellipse cx="${x}" cy="${y}" rx="400" ry="70" fill="none" stroke="${b.col}" stroke-width="${b.w}"/>
        <path d="M${x - 300},${y + 48} C${x - 120},${y + 74} ${x + 120},${y + 74} ${x + 300},${y + 48}" fill="none" stroke="#fff" stroke-width="${Math.max(4, b.w / 5)}" opacity=".18"/>
        <text x="${x}" y="${y + 70 + b.w * 0.2}" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="${18 + b.w * 0.35}" letter-spacing="3" fill="${b.tc}">${b.txt}</text>
      </g>`;
    })
    .join("");
}

/* ---------------------------------------------------------------- Pack Full PR */
export function bundle(p = "bd") {
  const n = PALETTES.noir, r = PALETTES.rouge;
  return `
  <g transform="translate(150 60) scale(0.75)">${leverBelt(n, p + "a")}</g>
  <g transform="translate(560 430) scale(0.55)">${kneeSleeves(n, p + "b")}</g>
  <g transform="translate(-10 470) scale(0.55)">${figure8(r, p + "c")}</g>
  <g transform="translate(300 640) scale(0.5)">${wristWraps(n, p + "d")}</g>
  <g transform="translate(860 120)">
    <circle r="96" fill="#e0262f"/><circle r="84" fill="none" stroke="#edeae3" stroke-width="3" stroke-dasharray="6 5"/>
    <text y="-8" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="52" fill="#edeae3">FULL</text>
    <text y="40" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="52" fill="#edeae3">PR</text>
  </g>`;
}

/* ---------------------------------------------------------------- Scène */
export function scene(inner, { theme = "dark", floorY = 960, floorW = 460 } = {}) {
  const dark = theme === "dark";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="78%">
      ${dark
        ? '<stop offset="0" stop-color="#3a3c42"/><stop offset=".5" stop-color="#1f2024"/><stop offset="1" stop-color="#111214"/>'
        : '<stop offset="0" stop-color="#f6f4ef"/><stop offset=".6" stop-color="#e3dfd6"/><stop offset="1" stop-color="#c9c4b9"/>'}
    </radialGradient>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 ${dark ? 0.09 : 0.07}"/></feComponentTransfer></filter>
  </defs>
  <rect width="1200" height="1200" fill="url(#bg)"/>
  <ellipse cx="600" cy="${floorY}" rx="${floorW}" ry="46" fill="#000" opacity="${dark ? 0.6 : 0.28}" filter="url(#soft)"/>
  ${inner}
  <rect width="1200" height="1200" filter="url(#grain)"/>
</svg>`;
}
