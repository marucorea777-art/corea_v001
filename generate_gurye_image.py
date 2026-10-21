import subprocess

svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <!-- Sky gradient -->
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#7db9e8"/>
      <stop offset="40%" stop-color="#b0d5f5"/>
      <stop offset="100%" stop-color="#e8f2fc"/>
    </linearGradient>

    <!-- Jirisan Mountain Gradient -->
    <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#5a6878"/>
      <stop offset="50%" stop-color="#485868"/>
      <stop offset="100%" stop-color="#324050"/>
    </linearGradient>

    <linearGradient id="mountainGradFront" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4a5a40"/>
      <stop offset="100%" stop-color="#2a3825"/>
    </linearGradient>

    <!-- River Gradient -->
    <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a8c8e8"/>
      <stop offset="50%" stop-color="#70a0d0"/>
      <stop offset="100%" stop-color="#4a80b0"/>
    </linearGradient>

    <!-- Yellow Blossom Glow Filter -->
    <filter id="blossomGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <!-- Soft Drop Shadow -->
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="2" dy="4" stdDeviation="4" flood-opacity="0.4"/>
    </filter>

    <!-- Stone Wall Pattern -->
    <pattern id="stonePattern" width="40" height="20" patternUnits="userSpaceOnUse">
      <path d="M0 10 L40 10 M20 0 L20 10 M0 20 L40 20 M10 10 L10 20 M30 10 L30 20" stroke="#5a524c" stroke-width="2" fill="none"/>
    </pattern>
  </defs>

  <!-- 1. Sky -->
  <rect width="1200" height="675" fill="url(#skyGrad)"/>

  <!-- Soft Spring Clouds -->
  <path d="M 150 120 Q 200 80 260 110 Q 320 70 380 110 Q 420 130 400 160 Q 150 180 150 120 Z" fill="#ffffff" opacity="0.6"/>
  <path d="M 700 90 Q 760 50 830 80 Q 900 40 960 80 Q 1000 110 980 140 Q 700 150 700 90 Z" fill="#ffffff" opacity="0.5"/>

  <!-- 2. Background Jirisan Mountains -->
  <!-- Far ridge -->
  <path d="M 0 320 Q 200 180 450 250 Q 700 150 950 220 Q 1100 190 1200 240 L 1200 675 L 0 675 Z" fill="url(#mountainGrad)" opacity="0.85"/>
  <!-- Near ridge -->
  <path d="M 0 380 Q 180 280 380 320 Q 600 220 820 290 Q 1020 260 1200 310 L 1200 675 L 0 675 Z" fill="url(#mountainGradFront)"/>

  <!-- 3. Seosi River Stream (Right Side) -->
  <path d="M 500 400 Q 650 420 750 480 Q 900 550 1200 600 L 1200 675 L 450 675 Z" fill="url(#riverGrad)"/>

  <!-- River Boulders and Rocks -->
  <ellipse cx="680" cy="480" rx="35" ry="18" fill="#787068"/>
  <ellipse cx="740" cy="520" rx="45" ry="22" fill="#605850"/>
  <ellipse cx="850" cy="560" rx="60" ry="25" fill="#686058"/>
  <ellipse cx="980" cy="610" rx="80" ry="32" fill="#585048"/>
  <ellipse cx="610" cy="450" rx="25" ry="12" fill="#888078"/>

  <!-- Water ripples and reflections -->
  <path d="M 600 460 Q 650 455 700 462 M 720 500 Q 800 495 880 505 M 820 570 Q 920 560 1020 575" stroke="#e0f0ff" stroke-width="3" fill="none" opacity="0.7"/>

  <!-- 4. Stone Wall Embankment (돌담 축대) -->
  <path d="M 100 400 L 550 380 L 680 430 L 800 510 L 950 590 L 950 675 L 0 675 Z" fill="#8c827a"/>
  <!-- Stone Texture Lines -->
  <path d="M 100 400 Q 300 390 550 380 Q 680 430 800 510 L 950 590" stroke="#524a44" stroke-width="8" fill="none"/>
  <path d="M 100 430 Q 300 420 520 410 Q 650 460 760 540 L 900 620" stroke="#524a44" stroke-width="4" stroke-dasharray="15,8" fill="none"/>
  <path d="M 100 460 Q 300 450 480 440 Q 620 490 720 570 L 850 650" stroke="#524a44" stroke-width="4" stroke-dasharray="20,10" fill="none"/>

  <!-- 5. Massive Yellow Sansuyu Trees in Full Bloom (Midground) -->
  <!-- Layer 1: Base Dark Warm Yellow -->
  <circle cx="200" cy="320" r="110" fill="#d4a017"/>
  <circle cx="350" cy="300" r="130" fill="#cc9600"/>
  <circle cx="500" cy="290" r="120" fill="#d4a017"/>
  <circle cx="650" cy="340" r="100" fill="#cc9600"/>
  <circle cx="780" cy="410" r="90" fill="#d4a017"/>

  <!-- Layer 2: Bright Golden Yellow Clouds -->
  <circle cx="180" cy="310" r="95" fill="#f5c211"/>
  <circle cx="240" cy="290" r="85" fill="#ffd700"/>
  <circle cx="330" cy="280" r="110" fill="#f5c211"/>
  <circle cx="410" cy="270" r="95" fill="#ffd700"/>
  <circle cx="480" cy="270" r="100" fill="#f5c211"/>
  <circle cx="560" cy="300" r="85" fill="#ffd700"/>
  <circle cx="640" cy="320" r="80" fill="#f5c211"/>
  <circle cx="760" cy="390" r="75" fill="#ffd700"/>

  <!-- Layer 3: Fluffy Top Highlights (Pure Bright Yellow & Soft White) -->
  <g filter="url(#blossomGlow)">
    <circle cx="170" cy="295" r="70" fill="#ffe600"/>
    <circle cx="230" cy="275" r="65" fill="#fff066"/>
    <circle cx="320" cy="260" r="85" fill="#ffe600"/>
    <circle cx="390" cy="250" r="75" fill="#fff066"/>
    <circle cx="470" cy="250" r="80" fill="#ffe600"/>
    <circle cx="540" cy="285" r="65" fill="#fff066"/>
    <circle cx="620" cy="305" r="60" fill="#ffe600"/>
    <circle cx="740" cy="375" r="55" fill="#fff066"/>
  </g>

  <!-- Individual Flower Cluster Dots -->
  <g fill="#ffff99" opacity="0.9">
    <circle cx="150" cy="280" r="12"/><circle cx="210" cy="250" r="15"/><circle cx="280" cy="240" r="18"/>
    <circle cx="350" cy="230" r="20"/><circle cx="430" cy="230" r="16"/><circle cx="510" cy="250" r="18"/>
    <circle cx="590" cy="280" r="14"/><circle cx="680" cy="330" r="15"/><circle cx="750" cy="360" r="12"/>
  </g>

  <!-- 6. Walking Path & Tourists/Visitors strolling -->
  <path d="M 80 390 Q 280 380 480 375 Q 600 410 720 480" stroke="#d5c8b5" stroke-width="25" fill="none"/>
  
  <!-- Tourists silhouettes with colorful spring coats -->
  <!-- Person 1 (Red jacket) -->
  <circle cx="250" cy="365" r="4" fill="#333"/>
  <path d="M 250 369 L 250 380" stroke="#e63946" stroke-width="5"/>
  <!-- Person 2 (Blue jacket) -->
  <circle cx="262" cy="366" r="4" fill="#333"/>
  <path d="M 262 370 L 262 381" stroke="#1d3557" stroke-width="5"/>
  <!-- Person 3 (Yellow jacket) -->
  <circle cx="380" cy="362" r="4" fill="#333"/>
  <path d="M 380 366 L 380 377" stroke="#ffb703" stroke-width="5"/>
  <!-- Person 4 (White jacket) -->
  <circle cx="390" cy="363" r="4" fill="#333"/>
  <path d="M 390 367 L 390 378" stroke="#f1faee" stroke-width="5"/>
  <!-- Group walking further down -->
  <circle cx="520" cy="385" r="3" fill="#333"/>
  <path d="M 520 388 L 520 396" stroke="#e63946" stroke-width="4"/>
  <circle cx="530" cy="386" r="3" fill="#333"/>
  <path d="M 530 389 L 530 397" stroke="#2a9d8f" stroke-width="4"/>

  <!-- 7. Left Side: Traditional Wooden Structure & Signboard (The Key Element in User Photo) -->
  <g filter="url(#shadow)">
    <!-- Wooden Posts / Beams -->
    <rect x="20" y="220" width="160" height="300" fill="#3e2723" rx="4"/>
    <rect x="25" y="225" width="150" height="290" fill="#4e342e" rx="3"/>
    
    <!-- Traditional Tile Roof Eave Top -->
    <path d="M 10 220 Q 100 200 190 220 L 180 235 Q 100 220 20 235 Z" fill="#1a1a1a"/>
    <path d="M 15 222 Q 100 205 185 222" stroke="#d4af37" stroke-width="3" fill="none"/>

    <!-- Large Yellow Vertical Signboard (SIGNIFICANT DISPLAY) -->
    <rect x="40" y="250" width="120" height="230" fill="#ffd700" stroke="#b8860b" stroke-width="4" rx="8"/>
    <rect x="45" y="255" width="110" height="220" fill="#ffeb3b" rx="6"/>

    <!-- Text on Signboard: 구례 / 산수유 / 꽃축제 -->
    <text x="100" y="305" font-family="'Noto Sans KR', 'Malgun Gothic', sans-serif" font-weight="900" font-size="34" fill="#000000" text-anchor="middle">구례</text>
    <text x="100" y="360" font-family="'Noto Sans KR', 'Malgun Gothic', sans-serif" font-weight="900" font-size="34" fill="#d50000" text-anchor="middle">산수유</text>
    <text x="100" y="415" font-family="'Noto Sans KR', 'Malgun Gothic', sans-serif" font-weight="900" font-size="34" fill="#000000" text-anchor="middle">꽃축제</text>
    
    <!-- Decorative flower icon on banner -->
    <circle cx="100" cy="450" r="10" fill="#e65100"/>
    <circle cx="100" cy="450" r="5" fill="#ffff00"/>

    <!-- Red Wooden Railing in Foreground Left -->
    <rect x="0" y="500" width="220" height="20" fill="#b71c1c"/>
    <rect x="30" y="520" width="15" height="155" fill="#880e4f"/>
    <rect x="110" y="520" width="15" height="155" fill="#880e4f"/>
    <rect x="190" y="520" width="15" height="155" fill="#880e4f"/>
    <rect x="0" y="580" width="220" height="15" fill="#c62828"/>
  </g>

  <!-- 8. Foreground Framing: Bright Yellow Sansuyu Branches (Bottom Left & Right) -->
  <!-- Bottom Left framing branches -->
  <path d="M 0 675 C 50 600 120 580 200 620" stroke="#4e342e" stroke-width="6" fill="none"/>
  <circle cx="120" cy="590" r="25" fill="#ffe600" opacity="0.95"/>
  <circle cx="150" cy="610" r="30" fill="#ffd700" opacity="0.95"/>
  <circle cx="180" cy="630" r="22" fill="#fff066" opacity="0.95"/>

  <!-- Bottom Right framing branches -->
  <path d="M 1200 675 C 1100 580 1000 560 900 600" stroke="#4e342e" stroke-width="8" fill="none"/>
  <circle cx="1050" cy="570" r="35" fill="#ffe600" opacity="0.95"/>
  <circle cx="980" cy="580" r="40" fill="#ffd700" opacity="0.95"/>
  <circle cx="930" cy="600" r="30" fill="#fff066" opacity="0.95"/>
  <circle cx="1120" cy="550" r="28" fill="#ffe600" opacity="0.95"/>
</svg>
'''

with open('src/assets/images/gurye_sansuyu_exact.svg', 'w') as f:
    f.write(svg_content)

print("SVG created successfully")

# Convert SVG to high quality JPEG image using ImageMagick
cmd = "convert -density 150 src/assets/images/gurye_sansuyu_exact.svg -quality 92 src/assets/images/gurye_sansuyu_real.jpg"
res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
print("Convert result:", res.returncode, res.stdout, res.stderr)
