// Custom SVG Artwork for Korean Festivals
// Generates accurate, theme-specific vector graphics as SVG Data URLs

function makeSvgUrl(svgContent: string): string {
  const cleanSvg = svgContent.replace(/\s+/g, ' ').trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
}

// 1. Gurye Sansuyu (Cornelian Cherry Blossom) Festival
export const guryeSansuyuSvg = makeSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#bae6fd" />
      <stop offset="60%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#fef3c7" />
    </linearGradient>
    <linearGradient id="mountain" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="goldYellow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#facc15" />
      <stop offset="50%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
    <linearGradient id="stream" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
  </defs>

  <!-- Sky & Sun -->
  <rect width="800" height="500" fill="url(#sky)" />
  <circle cx="650" cy="120" r="60" fill="#fef08a" opacity="0.6" />

  <!-- Jirisan Mountain Backing -->
  <polygon points="-50,320 200,140 450,300 750,110 850,320" fill="url(#mountain)" />
  <!-- Snow on Peaks -->
  <polygon points="200,140 160,180 230,175" fill="#f8fafc" opacity="0.9" />
  <polygon points="750,110 705,160 780,155" fill="#f8fafc" opacity="0.9" />

  <!-- Traditional Stone Wall Village Ground -->
  <rect x="0" y="300" width="800" height="200" fill="#4d7c0f" />
  <path d="M0 320 Q200 300 400 330 T800 310 L800 500 L0 500 Z" fill="#3f6212" />

  <!-- Stream -->
  <path d="M 250 500 Q 320 400 450 360 Q 550 330 650 320 L 700 320 Q 580 340 480 380 Q 350 430 300 500 Z" fill="url(#stream)" opacity="0.85" />

  <!-- Traditional Stone Walls -->
  <path d="M 50 380 Q 200 360 380 400" stroke="#78350f" stroke-width="12" fill="none" stroke-linecap="round" />
  <path d="M 50 380 Q 200 360 380 400" stroke="#a16207" stroke-dasharray="8 4" stroke-width="10" fill="none" />

  <!-- Traditional Houses (Hanok Roofs) -->
  <path d="M 100 340 Q 150 320 200 340 L 190 360 L 110 360 Z" fill="#1e293b" />
  <rect x="115" y="360" width="70" height="30" fill="#fde047" opacity="0.8" />
  <path d="M 450 330 Q 500 315 550 330 L 540 350 L 460 350 Z" fill="#1e293b" />

  <!-- Golden Sansuyu Blossom Trees -->
  <!-- Tree 1 -->
  <path d="M 120 420 Q 130 350 110 300" stroke="#451a03" stroke-width="10" fill="none" />
  <circle cx="110" cy="280" r="50" fill="url(#goldYellow)" />
  <circle cx="70" cy="290" r="35" fill="url(#goldYellow)" />
  <circle cx="150" cy="285" r="40" fill="url(#goldYellow)" />
  <circle cx="110" cy="245" r="35" fill="#fef08a" />

  <!-- Tree 2 (Main Foreground Tree) -->
  <path d="M 600 450 Q 580 360 620 270" stroke="#451a03" stroke-width="14" fill="none" />
  <circle cx="620" cy="240" r="75" fill="url(#goldYellow)" />
  <circle cx="550" cy="260" r="55" fill="url(#goldYellow)" />
  <circle cx="680" cy="250" r="60" fill="url(#goldYellow)" />
  <circle cx="620" cy="180" r="50" fill="#fef08a" />
  <circle cx="660" cy="210" r="40" fill="#facc15" />

  <!-- Tree 3 Background -->
  <path d="M 350 350 L 360 300" stroke="#451a03" stroke-width="6" />
  <circle cx="360" cy="280" r="40" fill="url(#goldYellow)" />
  <circle cx="330" cy="290" r="30" fill="url(#goldYellow)" />

  <!-- Yellow Petal Drifts -->
  <circle cx="200" cy="380" r="4" fill="#facc15" />
  <circle cx="230" cy="410" r="5" fill="#fde047" />
  <circle cx="280" cy="390" r="3" fill="#facc15" />
  <circle cx="500" cy="300" r="4" fill="#fef08a" />
  <circle cx="530" cy="340" r="6" fill="#facc15" />
  <circle cx="420" cy="430" r="4" fill="#fde047" />

  <!-- Title Badge -->
  <rect x="30" y="30" width="280" height="48" rx="24" fill="#000000" opacity="0.4" />
  <text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="20" fill="#fef08a">🌼 구례 산수유꽃축제</text>
</svg>
`);

// 2. Hampyeong Butterfly Festival
export const hampyeongButterflySvg = makeSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="70%" stop-color="#bae6fd" />
      <stop offset="100%" stop-color="#fef08a" />
    </linearGradient>
    <linearGradient id="rapeField" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
    <linearGradient id="butterflyWing1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ec4899" />
      <stop offset="50%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#eab308" />
    </linearGradient>
    <linearGradient id="butterflyWing2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>

  <rect width="800" height="500" fill="url(#sky)" />

  <!-- Soft Clouds -->
  <ellipse cx="150" cy="100" rx="90" ry="35" fill="#ffffff" opacity="0.8" />
  <ellipse cx="650" cy="130" rx="110" ry="40" fill="#ffffff" opacity="0.7" />

  <!-- Rolling Yellow Flower Fields -->
  <path d="M-50 320 Q 200 250 450 300 T 850 280 L 850 500 L -50 500 Z" fill="#65a30d" />
  <path d="M-50 350 Q 150 300 380 340 T 850 310 L 850 500 L -50 500 Z" fill="url(#rapeField)" />

  <!-- Canola / Rape Flower Details -->
  <circle cx="100" cy="380" r="15" fill="#fef08a" />
  <circle cx="120" cy="370" r="12" fill="#fef08a" />
  <circle cx="200" cy="360" r="18" fill="#fde047" />
  <circle cx="300" cy="390" r="22" fill="#fef08a" />
  <circle cx="450" cy="350" r="16" fill="#fde047" />
  <circle cx="600" cy="370" r="20" fill="#fef08a" />

  <!-- Giant Main Butterfly (Left) -->
  <g transform="translate(240, 180) rotate(-15) scale(1.2)">
    <!-- Top Wings -->
    <path d="M 0 0 C -60 -90 -110 -40 -60 10 Z" fill="url(#butterflyWing1)" stroke="#1e293b" stroke-width="2" />
    <path d="M 0 0 C 60 -90 110 -40 60 10 Z" fill="url(#butterflyWing1)" stroke="#1e293b" stroke-width="2" />
    <!-- Bottom Wings -->
    <path d="M 0 0 C -50 20 -70 70 -10 50 Z" fill="url(#butterflyWing1)" stroke="#1e293b" stroke-width="2" />
    <path d="M 0 0 C 50 20 70 70 10 50 Z" fill="url(#butterflyWing1)" stroke="#1e293b" stroke-width="2" />
    <!-- Body & Antennae -->
    <ellipse cx="0" cy="15" rx="5" ry="30" fill="#0f172a" />
    <path d="M -2 -12 Q -15 -35 -25 -30" stroke="#0f172a" stroke-width="2" fill="none" />
    <path d="M 2 -12 Q 15 -35 25 -30" stroke="#0f172a" stroke-width="2" fill="none" />
    <!-- Wing Pattern Spots -->
    <circle cx="-50" cy="-40" r="12" fill="#ffffff" opacity="0.8" />
    <circle cx="50" cy="-40" r="12" fill="#ffffff" opacity="0.8" />
  </g>

  <!-- Secondary Butterfly (Right Foreground) -->
  <g transform="translate(560, 220) rotate(20) scale(0.9)">
    <path d="M 0 0 C -50 -80 -90 -30 -50 10 Z" fill="url(#butterflyWing2)" stroke="#0f172a" stroke-width="2" />
    <path d="M 0 0 C 50 -80 90 -30 50 10 Z" fill="url(#butterflyWing2)" stroke="#0f172a" stroke-width="2" />
    <path d="M 0 0 C -40 15 -60 60 -10 40 Z" fill="url(#butterflyWing2)" stroke="#0f172a" stroke-width="2" />
    <path d="M 0 0 C 40 15 60 60 10 40 Z" fill="url(#butterflyWing2)" stroke="#0f172a" stroke-width="2" />
    <ellipse cx="0" cy="10" rx="4" ry="25" fill="#0f172a" />
  </g>

  <!-- Small Background Butterflies -->
  <g transform="translate(380, 100) scale(0.4) rotate(10)">
    <path d="M 0 0 C -40 -60 -70 -20 -40 10 Z" fill="#ec4899" />
    <path d="M 0 0 C 40 -60 70 -20 40 10 Z" fill="#ec4899" />
  </g>
  <g transform="translate(120, 160) scale(0.5) rotate(-25)">
    <path d="M 0 0 C -40 -60 -70 -20 -40 10 Z" fill="#3b82f6" />
    <path d="M 0 0 C 40 -60 70 -20 40 10 Z" fill="#3b82f6" />
  </g>

  <!-- Title Badge -->
  <rect x="30" y="30" width="260" height="48" rx="24" fill="#000000" opacity="0.4" />
  <text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="20" fill="#ffffff">🦋 함평 나비대축제</text>
</svg>
`);

// 3. Taean World Tulip Festival
export const taeanTulipSvg = makeSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="sunsetSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4c0519" />
      <stop offset="40%" stop-color="#9f1239" />
      <stop offset="70%" stop-color="#fb923c" />
      <stop offset="100%" stop-color="#fef08a" />
    </linearGradient>
  </defs>

  <rect width="800" height="500" fill="url(#sunsetSky)" />

  <!-- Sunset Sun over Ocean -->
  <circle cx="400" cy="240" r="65" fill="#fff7ed" />
  <ellipse cx="400" cy="250" rx="300" ry="12" fill="#fdba74" opacity="0.5" />

  <!-- Sea Line -->
  <rect x="0" y="250" width="800" height="30" fill="#0284c7" opacity="0.6" />

  <!-- Waves / Rows of Tulips Field -->
  <!-- Red Tulip Band -->
  <path d="M -50 300 Q 200 270 450 310 T 850 290 L 850 350 L -50 350 Z" fill="#e11d48" />
  <!-- Yellow Tulip Band -->
  <path d="M -50 340 Q 250 310 500 350 T 850 330 L 850 400 L -50 400 Z" fill="#eab308" />
  <!-- Purple Tulip Band -->
  <path d="M -50 390 Q 200 360 420 400 T 850 380 L 850 450 L -50 450 Z" fill="#9333ea" />
  <!-- Pink Tulip Band Foreground -->
  <path d="M -50 430 Q 300 400 550 440 T 850 420 L 850 500 L -50 500 Z" fill="#ec4899" />

  <!-- Foreground Detailed Tulips -->
  <g transform="translate(150, 390)">
    <path d="M 0 50 L 0 0" stroke="#15803d" stroke-width="6" />
    <path d="M -15 0 C -25 -30 0 -40 0 0 C 0 -40 25 -30 15 0 Z" fill="#f43f5e" />
  </g>
  <g transform="translate(220, 410)">
    <path d="M 0 50 L 0 0" stroke="#15803d" stroke-width="6" />
    <path d="M -15 0 C -25 -30 0 -40 0 0 C 0 -40 25 -30 15 0 Z" fill="#facc15" />
  </g>
  <g transform="translate(620, 380)">
    <path d="M 0 60 L 0 0" stroke="#15803d" stroke-width="6" />
    <path d="M -18 0 C -30 -35 0 -45 0 0 C 0 -45 30 -35 18 0 Z" fill="#a855f7" />
  </g>

  <!-- Title Badge -->
  <rect x="30" y="30" width="280" height="48" rx="24" fill="#000000" opacity="0.4" />
  <text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="20" fill="#ffffff">🌷 태안 세계튤립축제</text>
</svg>
`);

// 4. Nonsan Strawberry Festival
export const nonsanStrawberrySvg = makeSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fef2f2" />
      <stop offset="100%" stop-color="#fee2e2" />
    </linearGradient>
    <linearGradient id="strawberryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="60%" stop-color="#dc2626" />
      <stop offset="100%" stop-color="#9f1239" />
    </linearGradient>
  </defs>

  <rect width="800" height="500" fill="url(#bg)" />

  <!-- Green Vines & Foliage -->
  <path d="M -50 200 Q 200 150 450 220 T 850 180" stroke="#16a34a" stroke-width="12" fill="none" />
  <path d="M -50 280 Q 250 220 500 300 T 850 250" stroke="#15803d" stroke-width="16" fill="none" />

  <!-- Big Strawberry Leaves -->
  <path d="M 350 180 C 300 120 400 100 400 180 C 400 100 500 120 450 180 Z" fill="#22c55e" />
  <path d="M 150 250 C 100 190 200 170 200 250 C 200 170 300 190 250 250 Z" fill="#16a34a" />

  <!-- Main Center Strawberry -->
  <g transform="translate(400, 310)">
    <!-- Strawberry Heart/Cone Shape -->
    <path d="M 0 -100 C 130 -90 140 30 0 120 C -140 30 -130 -90 0 -100 Z" fill="url(#strawberryGrad)" />
    <!-- Green Crown -->
    <path d="M 0 -100 L -30 -130 L -10 -95 L -60 -110 L -25 -85 L 0 -125 L 25 -85 L 60 -110 L 10 -95 L 30 -130 Z" fill="#15803d" />
    <!-- Seeds -->
    <circle cx="-50" cy="-40" r="5" fill="#fde047" />
    <circle cx="0" cy="-50" r="5" fill="#fde047" />
    <circle cx="50" cy="-40" r="5" fill="#fde047" />
    <circle cx="-70" cy="10" r="5" fill="#fde047" />
    <circle cx="-20" cy="10" r="5" fill="#fde047" />
    <circle cx="30" cy="20" r="5" fill="#fde047" />
    <circle cx="70" cy="0" r="5" fill="#fde047" />
    <circle cx="0" cy="60" r="5" fill="#fde047" />
    <!-- Highlight -->
    <ellipse cx="-40" cy="-60" rx="15" ry="30" fill="#ffffff" opacity="0.3" transform="rotate(-20 -40 -60)" />
  </g>

  <!-- Secondary Strawberry Left -->
  <g transform="translate(180, 360) scale(0.65) rotate(-15)">
    <path d="M 0 -100 C 130 -90 140 30 0 120 C -140 30 -130 -90 0 -100 Z" fill="url(#strawberryGrad)" />
    <path d="M 0 -100 L -30 -130 L -10 -95 L -60 -110 L -25 -85 L 0 -125 L 25 -85 L 60 -110 L 10 -95 L 30 -130 Z" fill="#15803d" />
    <circle cx="0" cy="0" r="6" fill="#fde047" />
    <circle cx="-40" cy="-30" r="6" fill="#fde047" />
    <circle cx="40" cy="-30" r="6" fill="#fde047" />
  </g>

  <!-- Secondary Strawberry Right -->
  <g transform="translate(620, 350) scale(0.7) rotate(20)">
    <path d="M 0 -100 C 130 -90 140 30 0 120 C -140 30 -130 -90 0 -100 Z" fill="url(#strawberryGrad)" />
    <path d="M 0 -100 L -30 -130 L -10 -95 L -60 -110 L -25 -85 L 0 -125 L 25 -85 L 60 -110 L 10 -95 L 30 -130 Z" fill="#15803d" />
    <circle cx="0" cy="0" r="6" fill="#fde047" />
  </g>

  <!-- White Strawberry Blossoms -->
  <g transform="translate(280, 190)">
    <circle cx="0" cy="0" r="12" fill="#fde047" />
    <circle cx="0" cy="-25" r="16" fill="#ffffff" opacity="0.9" />
    <circle cx="24" cy="-8" r="16" fill="#ffffff" opacity="0.9" />
    <circle cx="15" cy="20" r="16" fill="#ffffff" opacity="0.9" />
    <circle cx="-15" cy="20" r="16" fill="#ffffff" opacity="0.9" />
    <circle cx="-24" cy="-8" r="16" fill="#ffffff" opacity="0.9" />
  </g>

  <!-- Title Badge -->
  <rect x="30" y="30" width="240" height="48" rx="24" fill="#000000" opacity="0.4" />
  <text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="20" fill="#ffffff">🍓 논산 딸기축제</text>
</svg>
`);

// 5. Yeouido Spring Flower (Cherry Blossom) Festival
export const yeouidoFlowerSvg = makeSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="60%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#312e81" />
    </linearGradient>
    <linearGradient id="hanRiver" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
  </defs>

  <rect width="800" height="500" fill="url(#nightSky)" />

  <!-- Moon -->
  <circle cx="680" cy="100" r="45" fill="#fef08a" opacity="0.9" />
  <circle cx="660" cy="90" r="40" fill="#0f172a" opacity="0.3" />

  <!-- Han River -->
  <rect x="0" y="320" width="800" height="180" fill="url(#hanRiver)" />

  <!-- City Skyline & Bridges Silhouette -->
  <polygon points="50,320 80,220 120,220 140,320" fill="#020617" />
  <polygon points="180,320 220,160 260,160 300,320" fill="#0f172a" />
  <polygon points="500,320 540,240 580,320" fill="#020617" />

  <!-- Pink Light Tunnel & Cherry Trees -->
  <path d="M -20 350 Q 150 280 400 320 T 820 300" stroke="#78350f" stroke-width="18" fill="none" />

  <!-- Big Pink Cherry Blossom Clouds -->
  <circle cx="100" cy="220" r="80" fill="#f472b6" opacity="0.85" />
  <circle cx="160" cy="180" r="70" fill="#fbcfe8" opacity="0.9" />
  <circle cx="230" cy="210" r="75" fill="#f472b6" opacity="0.8" />

  <circle cx="500" cy="200" r="85" fill="#fbcfe8" opacity="0.9" />
  <circle cx="580" cy="170" r="75" fill="#f472b6" opacity="0.85" />
  <circle cx="660" cy="210" r="80" fill="#fbcfe8" opacity="0.9" />

  <!-- Lantern Lights -->
  <circle cx="150" cy="290" r="10" fill="#fef08a" />
  <circle cx="300" cy="295" r="10" fill="#fef08a" />
  <circle cx="450" cy="285" r="10" fill="#fef08a" />
  <circle cx="600" cy="290" r="10" fill="#fef08a" />

  <!-- Floating Petals -->
  <circle cx="250" cy="360" r="5" fill="#fbcfe8" />
  <circle cx="380" cy="380" r="6" fill="#f472b6" />
  <circle cx="420" cy="420" r="4" fill="#fbcfe8" />
  <circle cx="520" cy="370" r="5" fill="#f472b6" />

  <!-- Title Badge -->
  <rect x="30" y="30" width="280" height="48" rx="24" fill="#000000" opacity="0.5" />
  <text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="20" fill="#fbcfe8">🌸 여의도 봄꽃축제</text>
</svg>
`);

// 6. Jeju Fire Festival
export const jejuFireSvg = makeSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="night" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#020617" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
    <linearGradient id="fire" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#dc2626" />
      <stop offset="50%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#fef08a" />
    </linearGradient>
  </defs>

  <rect width="800" height="500" fill="url(#night)" />

  <!-- Saebyeol Oreum Hill Silhouette -->
  <path d="M -50 420 Q 200 180 400 220 T 850 400 L 850 500 L -50 500 Z" fill="#0f172a" />

  <!-- Fire Flames Covering Hill -->
  <path d="M 100 380 Q 150 250 200 340 Q 250 200 300 350 Q 380 180 450 340 Q 520 220 580 360 Q 650 260 700 400 Z" fill="url(#fire)" />

  <!-- Sparks / Fire Ember Orbs -->
  <circle cx="220" cy="180" r="6" fill="#fde047" />
  <circle cx="280" cy="140" r="8" fill="#f97316" />
  <circle cx="360" cy="120" r="10" fill="#fde047" />
  <circle cx="420" cy="100" r="7" fill="#ef4444" />
  <circle cx="500" cy="150" r="9" fill="#fde047" />

  <!-- Fireworks in Sky -->
  <g transform="translate(620, 100)">
    <line x1="0" y1="0" x2="0" y2="-40" stroke="#facc15" stroke-width="3" />
    <line x1="0" y1="0" x2="30" y2="-30" stroke="#f43f5e" stroke-width="3" />
    <line x1="0" y1="0" x2="40" y2="0" stroke="#38bdf8" stroke-width="3" />
    <line x1="0" y1="0" x2="-30" y2="-30" stroke="#a855f7" stroke-width="3" />
    <line x1="0" y1="0" x2="-40" y2="0" stroke="#facc15" stroke-width="3" />
  </g>

  <!-- Title Badge -->
  <rect x="30" y="30" width="240" height="48" rx="24" fill="#000000" opacity="0.5" />
  <text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="20" fill="#f97316">🔥 제주 들불축제</text>
</svg>
`);

// 7. Daegu Chimaek Festival
export const daeguChimaekSvg = makeSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#18181b" />
      <stop offset="100%" stop-color="#27272a" />
    </linearGradient>
    <linearGradient id="beer" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="30%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
  </defs>

  <rect width="800" height="500" fill="url(#bg)" />

  <!-- Stage Lights Background -->
  <circle cx="200" cy="100" r="120" fill="#ec4899" opacity="0.15" />
  <circle cx="600" cy="100" r="140" fill="#3b82f6" opacity="0.15" />

  <!-- Beer Mug Right -->
  <g transform="translate(480, 180)">
    <!-- Glass body -->
    <rect x="0" y="40" width="160" height="220" rx="20" fill="url(#beer)" stroke="#ffffff" stroke-width="4" opacity="0.9" />
    <!-- Handle -->
    <path d="M 160 80 C 220 80 220 200 160 200" stroke="#ffffff" stroke-width="16" fill="none" stroke-linecap="round" />
    <!-- Beer Foam -->
    <rect x="-10" y="20" width="180" height="50" rx="25" fill="#ffffff" />
    <circle cx="30" cy="20" r="25" fill="#ffffff" />
    <circle cx="80" cy="15" r="30" fill="#ffffff" />
    <circle cx="130" cy="20" r="25" fill="#ffffff" />
  </g>

  <!-- Crispy Fried Chicken Drumstick Left -->
  <g transform="translate(240, 300) rotate(-25)">
    <!-- Bone -->
    <rect x="-120" y="-12" width="100" height="24" rx="12" fill="#f8fafc" />
    <circle cx="-120" cy="-12" r="16" fill="#f8fafc" />
    <circle cx="-120" cy="12" r="16" fill="#f8fafc" />
    <!-- Crispy Meat -->
    <path d="M -30 -50 C 60 -70 120 -30 110 30 C 100 80 30 70 -30 40 Z" fill="#b45309" stroke="#78350f" stroke-width="4" />
    <path d="M -20 -40 C 50 -55 100 -20 90 25 C 80 60 20 50 -20 30 Z" fill="#d97706" />
    <!-- Texture Dots -->
    <circle cx="20" cy="-10" r="4" fill="#78350f" />
    <circle cx="50" cy="10" r="5" fill="#78350f" />
    <circle cx="10" cy="20" r="4" fill="#78350f" />
  </g>

  <!-- Title Badge -->
  <rect x="30" y="30" width="260" height="48" rx="24" fill="#000000" opacity="0.6" />
  <text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="20" fill="#fde047">🍺 대구 치맥페스티벌</text>
</svg>
`);

// 8. Buyeo Seodong Lotus Festival
export const buyeoLotusSvg = makeSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="pondSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#022c22" />
      <stop offset="100%" stop-color="#064e3b" />
    </linearGradient>
  </defs>

  <rect width="800" height="500" fill="url(#pondSky)" />

  <!-- Gungnamji Pavilion Background -->
  <path d="M 300 220 L 400 160 L 500 220 L 480 240 L 320 240 Z" fill="#78350f" />
  <rect x="340" y="240" width="120" height="60" fill="#b45309" />
  <circle cx="400" cy="220" r="15" fill="#fde047" opacity="0.8" />

  <!-- Lotus Pads (Pond Leaves) -->
  <ellipse cx="200" cy="380" rx="120" ry="45" fill="#15803d" />
  <path d="M 200 380 L 280 350" stroke="#064e3b" stroke-width="4" />

  <ellipse cx="600" cy="400" rx="140" ry="50" fill="#16a34a" />

  <ellipse cx="400" cy="440" rx="160" ry="55" fill="#15803d" />

  <!-- Blooming Lotus Flower Center -->
  <g transform="translate(400, 360)">
    <!-- Outer Petals -->
    <path d="M 0 0 C -60 -80 0 -110 0 0 C 0 -110 60 -80 0 0 Z" fill="#f472b6" />
    <path d="M -30 10 C -90 -40 -40 -90 0 0 Z" fill="#fbcfe8" />
    <path d="M 30 10 C 90 -40 40 -90 0 0 Z" fill="#fbcfe8" />
    <!-- Center Yellow Pod -->
    <circle cx="0" cy="-20" r="18" fill="#fde047" />
  </g>

  <!-- Title Badge -->
  <rect x="30" y="30" width="280" height="48" rx="24" fill="#000000" opacity="0.5" />
  <text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="20" fill="#fbcfe8">🪷 부여 서동연꽃축제</text>
</svg>
`);

// 9. Muju Firefly Festival
export const mujuFireflySvg = makeSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="nightForest" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#020617" />
      <stop offset="100%" stop-color="#052e16" />
    </linearGradient>
  </defs>

  <rect width="800" height="500" fill="url(#nightForest)" />

  <!-- Forest Tree Silhouettes -->
  <polygon points="-20,500 80,180 180,500" fill="#022c22" />
  <polygon points="120,500 220,120 320,500" fill="#064e3b" />
  <polygon points="520,500 650,150 780,500" fill="#022c22" />
  <polygon points="650,500 750,200 850,500" fill="#064e3b" />

  <!-- Stream River -->
  <path d="M 280 500 Q 400 350 480 500 Z" fill="#0284c7" opacity="0.4" />

  <!-- Firefly Light Orbs -->
  <circle cx="200" cy="280" r="14" fill="#a3e635" opacity="0.9" />
  <circle cx="200" cy="280" r="28" fill="#bef264" opacity="0.3" />

  <circle cx="350" cy="220" r="18" fill="#fde047" opacity="0.9" />
  <circle cx="350" cy="220" r="35" fill="#fde047" opacity="0.3" />

  <circle cx="480" cy="300" r="15" fill="#a3e635" opacity="0.9" />
  <circle cx="480" cy="300" r="30" fill="#a3e635" opacity="0.3" />

  <circle cx="600" cy="240" r="12" fill="#bef264" opacity="0.9" />
  <circle cx="150" cy="380" r="10" fill="#fde047" opacity="0.8" />
  <circle cx="420" cy="180" r="10" fill="#a3e635" opacity="0.8" />

  <!-- Title Badge -->
  <rect x="30" y="30" width="240" height="48" rx="24" fill="#000000" opacity="0.6" />
  <text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="20" fill="#bef264">✨ 무주 반딧불축제</text>
</svg>
`);

// 10. Seoul Fireworks Festival
export const seoulFireworksSvg = makeSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <rect width="800" height="500" fill="#020617" />

  <!-- City & 63 Building Silhouette -->
  <rect x="520" y="160" width="70" height="240" fill="#0f172a" />
  <polygon points="520,160 555,110 590,160" fill="#1e293b" />
  <rect x="200" y="260" width="120" height="140" fill="#0f172a" />

  <!-- Han River -->
  <rect x="0" y="380" width="800" height="120" fill="#0369a1" opacity="0.6" />

  <!-- Bursting Fireworks 1 (Gold) -->
  <g transform="translate(320, 150)">
    <circle cx="0" cy="0" r="8" fill="#fde047" />
    <line x1="0" y1="0" x2="0" y2="-90" stroke="#fde047" stroke-width="4" stroke-dasharray="8 4" />
    <line x1="0" y1="0" x2="0" y2="90" stroke="#fde047" stroke-width="4" stroke-dasharray="8 4" />
    <line x1="0" y1="0" x2="-90" y2="0" stroke="#fde047" stroke-width="4" stroke-dasharray="8 4" />
    <line x1="0" y1="0" x2="90" y2="0" stroke="#fde047" stroke-width="4" stroke-dasharray="8 4" />
    <line x1="0" y1="0" x2="-60" y2="-60" stroke="#f97316" stroke-width="4" stroke-dasharray="8 4" />
    <line x1="0" y1="0" x2="60" y2="-60" stroke="#f97316" stroke-width="4" stroke-dasharray="8 4" />
  </g>

  <!-- Bursting Fireworks 2 (Magenta) -->
  <g transform="translate(600, 120)">
    <circle cx="0" cy="0" r="6" fill="#ec4899" />
    <line x1="0" y1="0" x2="0" y2="-70" stroke="#ec4899" stroke-width="3" stroke-dasharray="6 3" />
    <line x1="0" y1="0" x2="70" y2="0" stroke="#a855f7" stroke-width="3" stroke-dasharray="6 3" />
    <line x1="0" y1="0" x2="-50" y2="-50" stroke="#ec4899" stroke-width="3" stroke-dasharray="6 3" />
  </g>

  <!-- Title Badge -->
  <rect x="30" y="30" width="280" height="48" rx="24" fill="#000000" opacity="0.6" />
  <text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="20" fill="#fde047">🎆 서울세계불꽃축제</text>
</svg>
`);

// 11. Cheongsong Apple Festival
export const cheongsongAppleSvg = makeSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <rect width="800" height="500" fill="#78350f" />
  <!-- Autumn Foliage Background -->
  <circle cx="200" cy="150" r="160" fill="#d97706" opacity="0.8" />
  <circle cx="600" cy="180" r="180" fill="#b45309" opacity="0.8" />

  <!-- Big Red Apple Center -->
  <g transform="translate(400, 270)">
    <!-- Apple Body -->
    <path d="M 0 -80 C 110 -100 130 20 0 110 C -130 20 -110 -100 0 -80 Z" fill="#dc2626" stroke="#9f1239" stroke-width="4" />
    <!-- Leaf & Stem -->
    <rect x="-4" y="-110" width="8" height="30" rx="4" fill="#451a03" />
    <path d="M 0 -100 C 30 -130 60 -100 0 -100 Z" fill="#16a34a" />
    <!-- Highlight -->
    <ellipse cx="-40" cy="-40" rx="15" ry="30" fill="#ffffff" opacity="0.3" transform="rotate(-20 -40 -40)" />
  </g>

  <!-- Title Badge -->
  <rect x="30" y="30" width="240" height="48" rx="24" fill="#000000" opacity="0.6" />
  <text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="20" fill="#ffffff">🍎 청송 사과축제</text>
</svg>
`);

// 12. Suncheon Bay Reeds Festival
export const suncheonReedsSvg = makeSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="sunset" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#7c2d12" />
      <stop offset="50%" stop-color="#ea580c" />
      <stop offset="100%" stop-color="#fef08a" />
    </linearGradient>
  </defs>

  <rect width="800" height="500" fill="url(#sunset)" />

  <!-- Golden Reeds Fields -->
  <path d="M -50 340 Q 200 300 450 350 T 850 320 L 850 500 L -50 500 Z" fill="#ca8a04" />

  <!-- Wooden Boardwalk -->
  <path d="M 400 500 Q 420 400 480 340 T 550 300" stroke="#78350f" stroke-width="24" fill="none" />

  <!-- Flying Cranes Silhouettes -->
  <path d="M 200 120 Q 220 100 240 120 Q 260 100 280 120" stroke="#1e293b" stroke-width="4" fill="none" />
  <path d="M 260 90 Q 275 75 290 90 Q 305 75 320 90" stroke="#1e293b" stroke-width="3" fill="none" />

  <!-- Title Badge -->
  <rect x="30" y="30" width="260" height="48" rx="24" fill="#000000" opacity="0.5" />
  <text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="20" fill="#fef08a">🌾 순천만 갈대축제</text>
</svg>
`);

// 13. Cheongyang Ice Fountain Festival
export const cheongyangIceSvg = makeSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="iceBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
  </defs>

  <rect width="800" height="500" fill="url(#iceBg)" />

  <!-- Giant Frozen Ice Towers -->
  <polygon points="150,450 250,120 350,450" fill="#e0f2fe" opacity="0.9" />
  <polygon points="200,450 280,180 340,450" fill="#bae6fd" />

  <polygon points="400,450 520,80 640,450" fill="#ffffff" opacity="0.95" />
  <polygon points="460,450 530,140 600,450" fill="#38bdf8" opacity="0.8" />

  <!-- Title Badge -->
  <rect x="30" y="30" width="300" height="48" rx="24" fill="#000000" opacity="0.6" />
  <text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="20" fill="#bae6fd">❄️ 청양 얼음분수축제</text>
</svg>
`);

// Map of festival IDs to custom vector SVG artwork
export const FESTIVAL_SVG_MAP: Record<string, string> = {
  'gurye-sansuyu': guryeSansuyuSvg,
  'hampyeong-butterfly': hampyeongButterflySvg,
  'taean-tulip': taeanTulipSvg,
  'nonsan-strawberry': nonsanStrawberrySvg,
  'yeouido-flower': yeouidoFlowerSvg,
  'jeju-fire': jejuFireSvg,
  'daegu-chimaek': daeguChimaekSvg,
  'buyeo-lotus': buyeoLotusSvg,
  'muju-firefly': mujuFireflySvg,
  'seoul-fireworks': seoulFireworksSvg,
  'cheongsong-apple': cheongsongAppleSvg,
  'suncheon-reeds': suncheonReedsSvg,
  'cheongyang-ice': cheongyangIceSvg,
};
