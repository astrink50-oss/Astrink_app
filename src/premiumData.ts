/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// List of Zodiac Signs in order
export const ZODIAC_SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo", 
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
];

export const PLANET_NAMES_SANSKRIT: Record<string, string> = {
  sun: "Surya (Sun)",
  moon: "Chandra (Moon)",
  mercury: "Budha (Mercury)",
  venus: "Shukra (Venus)",
  mars: "Mangal (Mars)",
  jupiter: "Guru (Jupiter)",
  saturn: "Shani (Saturn)",
  rahu: "Rahu (North Node)",
  ketu: "Ketu (South Node)"
};

// Generates dynamic Vedic birth chart placements
export function generateDetailedBirthChart(birthDate: string, birthTime: string, birthPlace: string, nativeZodiac: { sun: string; moon: string; rising: string }) {
  const sunLower = nativeZodiac.sun.toLowerCase();
  const moonLower = nativeZodiac.moon.toLowerCase();
  const risingLower = (nativeZodiac.rising || "virgo").toLowerCase();

  const sunIdx = ZODIAC_SIGNS.indexOf(sunLower) + 1;
  const moonIdx = ZODIAC_SIGNS.indexOf(moonLower) + 1;
  const risingIdx = ZODIAC_SIGNS.indexOf(risingLower) + 1;

  // Real Vedic house mapping: house 1 is the Lagna (rising index)
  // House numbers are 1-12, starting from Lagna at top center triangle
  const getSignForHouse = (houseNum: number) => {
    return ((risingIdx - 1 + (houseNum - 1)) % 12) + 1;
  };

  const getHouseForSign = (signIdx: number) => {
    return ((signIdx - risingIdx + 12) % 12) + 1;
  };

  const sunHouse = getHouseForSign(sunIdx);
  const moonHouse = getHouseForSign(moonIdx);
  
  // Placement of Venus and Mercury near Sun
  const venusHouse = ((sunHouse + 0) % 12) + 1; // within 1 house of Sun
  const mercuryHouse = sunHouse; // usually in same house or 1 away
  
  // Outer planets placed deterministically based on date parts
  const birthDay = birthDate ? new Date(birthDate).getDate() || 15 : 15;
  const jupiterHouse = ((moonHouse + (birthDay % 3) + 3) % 12) + 1;
  const saturnHouse = ((risingHouse: number) => ((risingHouse + 6) % 12) + 1)(1); // Saturn is currently placed in 7th house from lagna
  const marsHouse = ((sunHouse + 4) % 12) + 1;
  const rahuHouse = ((risingIdx + 3) % 12) + 1;
  const ketuHouse = ((rahuHouse + 6 - 1) % 12) + 1; // Rahu & Ketu are 180 degrees apart (7 houses away)

  // Planetary list with degrees and Nakshatras
  const planets = [
    { name: "Lagna (Ascendant)", symbol: "As", sign: nativeZodiac.rising, house: 1, degree: `${14 + (birthDay % 12)}° 24'`, nakshatra: "Hasta", ruler: "Moon", significance: "Physical presence, outer aura shielding, and primary biological manifestation path." },
    { name: "Sun (Surya)", symbol: "Sy", sign: nativeZodiac.sun, house: sunHouse, degree: `${8 + (birthDay % 20)}° 12'`, nakshatra: "Uttara Phalguni", ruler: "Sun", significance: "Soul vitality, ego integration, and conscious light projection." },
    { name: "Moon (Chandra)", symbol: "Ch", sign: nativeZodiac.moon, house: moonHouse, degree: `${18 + (birthDay % 10)}° 45'`, nakshatra: "Rohini", ruler: "Moon", significance: "Subconscious mind, fluid emotions, somatic memory storage, and emotional nourishment." },
    { name: "Mercury (Budha)", symbol: "Bu", sign: ZODIAC_SIGNS[getSignForHouse(mercuryHouse) - 1], house: mercuryHouse, degree: "22° 08'", nakshatra: "Jyeshtha", ruler: "Mercury", significance: "Neural connections, communication networks, and mathematical pattern alignment." },
    { name: "Venus (Shukra)", symbol: "Sk", sign: ZODIAC_SIGNS[getSignForHouse(venusHouse) - 1], house: venusHouse, degree: "11° 19'", nakshatra: "Chitra", ruler: "Mars", significance: "Tactual aesthetics, cellular harmony, relational opening, and physical medium attraction." },
    { name: "Mars (Mangal)", symbol: "Ma", sign: ZODIAC_SIGNS[getSignForHouse(marsHouse) - 1], house: marsHouse, degree: "04° 51'", nakshatra: "Dhanishta", ruler: "Mars", significance: "Inner flame, active boundary enforcement, structural strength, and muscle tissue vitality." },
    { name: "Jupiter (Guru)", symbol: "Gu", sign: ZODIAC_SIGNS[getSignForHouse(jupiterHouse) - 1], house: jupiterHouse, degree: "15° 33'", nakshatra: "Purva Bhadrapada", ruler: "Jupiter", significance: "Spiritual expander, wisdom matrix, and cosmic abundance attraction." },
    { name: "Saturn (Shani)", symbol: "Sa", sign: ZODIAC_SIGNS[getSignForHouse(saturnHouse) - 1], house: saturnHouse, degree: "29° 50'", nakshatra: "Anuradha", ruler: "Saturn", significance: "Structural boundaries, karmic bones, skin plane protection, and time-constant discipline." },
    { name: "Rahu (North Node)", symbol: "Ra", sign: ZODIAC_SIGNS[getSignForHouse(rahuHouse) - 1], house: rahuHouse, degree: "02° 14'", nakshatra: "Ardra", ruler: "Rahu", significance: "Subconscious obsession, energetic amplification, and modern technological conduits." },
    { name: "Ketu (South Node)", symbol: "Ke", sign: ZODIAC_SIGNS[getSignForHouse(ketuHouse) - 1], house: ketuHouse, degree: "02° 14'", nakshatra: "Mula", ruler: "Ketu", significance: "Past-life recall, somatic detachment, liberation, and primal geometric lines." }
  ];

  // Map of planets list to house numbers
  const housePlacements: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) housePlacements[h] = [];
  planets.forEach(p => {
    if (p.symbol !== "As") { // Abbreviate and group
      housePlacements[p.house].push(p.symbol);
    }
  });

  // Capitalize first letter helper
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // Vedic north indian kundli svg
  const generateKundliSvg = () => {
    // Labels for signs inside each house
    const h1Sign = getSignForHouse(1);
    const h2Sign = getSignForHouse(2);
    const h3Sign = getSignForHouse(3);
    const h4Sign = getSignForHouse(4);
    const h5Sign = getSignForHouse(5);
    const h6Sign = getSignForHouse(6);
    const h7Sign = getSignForHouse(7);
    const h8Sign = getSignForHouse(8);
    const h9Sign = getSignForHouse(9);
    const h10Sign = getSignForHouse(10);
    const h11Sign = getSignForHouse(11);
    const h12Sign = getSignForHouse(12);

    return `<svg viewBox="0 0 200 200" fill="none" class="w-full h-full text-[#A37F43]">
      <!-- Outer elegant frame -->
      <rect x="5" y="5" width="190" height="190" stroke="#A37F43" stroke-width="2" fill="#FCFBF7" />
      <rect x="8" y="8" width="184" height="184" stroke="#A37F43" stroke-width="0.5" />
      
      <!-- Main diagonals -->
      <line x1="5" y1="5" x2="195" y2="195" stroke="#A37F43" stroke-width="1.2" />
      <line x1="195" y1="5" x2="5" y2="195" stroke="#A37F43" stroke-width="1.2" />
      
      <!-- Inner diamond -->
      <polygon points="100,5 195,100 100,195 5,100" stroke="#A37F43" stroke-width="1.2" fill="none" />
      
      <!-- House Sign Numbers (Dynamic Vedic Charting) -->
      <!-- House 1 (Lagna - Top Center Diamond) -->
      <text x="100" y="65" font-family="serif" font-size="10" font-weight="bold" fill="#2C2620" text-anchor="middle">${h1Sign}</text>
      <!-- House 2 (Top Left) -->
      <text x="65" y="38" font-family="serif" font-size="9" fill="#725C42" text-anchor="middle">${h2Sign}</text>
      <!-- House 3 (Left Top) -->
      <text x="38" y="65" font-family="serif" font-size="9" fill="#725C42" text-anchor="middle">${h3Sign}</text>
      <!-- House 4 (Left Center Diamond) -->
      <text x="65" y="100" font-family="serif" font-size="10" font-weight="bold" fill="#2C2620" text-anchor="middle">${h4Sign}</text>
      <!-- House 5 (Left Bottom) -->
      <text x="38" y="135" font-family="serif" font-size="9" fill="#725C42" text-anchor="middle">${h5Sign}</text>
      <!-- House 6 (Bottom Left) -->
      <text x="65" y="162" font-family="serif" font-size="9" fill="#725C42" text-anchor="middle">${h6Sign}</text>
      <!-- House 7 (Bottom Center Diamond) -->
      <text x="100" y="135" font-family="serif" font-size="10" font-weight="bold" fill="#2C2620" text-anchor="middle">${h7Sign}</text>
      <!-- House 8 (Bottom Right) -->
      <text x="135" y="162" font-family="serif" font-size="9" fill="#725C42" text-anchor="middle">${h8Sign}</text>
      <!-- House 9 (Right Bottom) -->
      <text x="162" y="135" font-family="serif" font-size="9" fill="#725C42" text-anchor="middle">${h9Sign}</text>
      <!-- House 10 (Right Center Diamond) -->
      <text x="135" y="100" font-family="serif" font-size="10" font-weight="bold" fill="#2C2620" text-anchor="middle">${h10Sign}</text>
      <!-- House 11 (Right Top) -->
      <text x="162" y="65" font-family="serif" font-size="9" fill="#725C42" text-anchor="middle">${h11Sign}</text>
      <!-- House 12 (Top Right) -->
      <text x="135" y="38" font-family="serif" font-size="9" fill="#725C42" text-anchor="middle">${h12Sign}</text>

      <!-- House Planet Labels (Dynamic) -->
      <!-- H1 Placements -->
      <text x="100" y="80" font-family="sans-serif" font-size="8" font-weight="extrabold" fill="#A37F43" text-anchor="middle">${housePlacements[1].join(" ")}</text>
      <text x="100" y="48" font-family="sans-serif" font-size="7" font-weight="bold" fill="#2C2620" opacity="0.3" text-anchor="middle">Lagna</text>
      <!-- H2 Placements -->
      <text x="65" y="52" font-family="sans-serif" font-size="8" font-weight="bold" fill="#A37F43" text-anchor="middle">${housePlacements[2].join(" ")}</text>
      <!-- H3 Placements -->
      <text x="40" y="82" font-family="sans-serif" font-size="8" font-weight="bold" fill="#A37F43" text-anchor="middle">${housePlacements[3].join(" ")}</text>
      <!-- H4 Placements -->
      <text x="65" y="115" font-family="sans-serif" font-size="8" font-weight="bold" fill="#A37F43" text-anchor="middle">${housePlacements[4].join(" ")}</text>
      <!-- H5 Placements -->
      <text x="40" y="148" font-family="sans-serif" font-size="8" font-weight="bold" fill="#A37F43" text-anchor="middle">${housePlacements[5].join(" ")}</text>
      <!-- H6 Placements -->
      <text x="65" y="176" font-family="sans-serif" font-size="8" font-weight="bold" fill="#A37F43" text-anchor="middle">${housePlacements[6].join(" ")}</text>
      <!-- H7 Placements -->
      <text x="100" y="120" font-family="sans-serif" font-size="8" font-weight="bold" fill="#A37F43" text-anchor="middle">${housePlacements[7].join(" ")}</text>
      <!-- H8 Placements -->
      <text x="135" y="176" font-family="sans-serif" font-size="8" font-weight="bold" fill="#A37F43" text-anchor="middle">${housePlacements[8].join(" ")}</text>
      <!-- H9 Placements -->
      <text x="160" y="148" font-family="sans-serif" font-size="8" font-weight="bold" fill="#A37F43" text-anchor="middle">${housePlacements[9].join(" ")}</text>
      <!-- H10 Placements -->
      <text x="135" y="115" font-family="sans-serif" font-size="8" font-weight="bold" fill="#A37F43" text-anchor="middle">${housePlacements[10].join(" ")}</text>
      <!-- H11 Placements -->
      <text x="160" y="82" font-family="sans-serif" font-size="8" font-weight="bold" fill="#A37F43" text-anchor="middle">${housePlacements[11].join(" ")}</text>
      <!-- H12 Placements -->
      <text x="135" y="52" font-family="sans-serif" font-size="8" font-weight="bold" fill="#A37F43" text-anchor="middle">${housePlacements[12].join(" ")}</text>
    </svg>`;
  };

  const activeDasha = "Jupiter - Mercury (Guru - Budha) Antardasha";
  const dashaSignificance = "An optimal period for neuro-linguistic alignment and vocal activation. Your creative circuits are highly conductive to stable, structured mental transformation.";

  return {
    risingIdx,
    planets,
    svgChart: generateKundliSvg(),
    activeDasha,
    dashaSignificance,
    dashaSpan: "Jan 2025 – May 2027",
    interpretation: `Your cosmic imprint shows an exalted ${cap(nativeZodiac.moon)} Moon anchoring your emotional security in the physical plane, whereas your Sun resides in ${cap(nativeZodiac.sun)}'s highly sensitive element. Your Rising Ascendant in ${cap(nativeZodiac.rising || "Virgo")} establishes a logical, protective analytical lens. Grounding sacred shapes in upper body meridians bridges your analytical intellect with somatic energetic flows, ensuring total neural harmony.`
  };
}

// Generates 5 distinct premium options based on user intention
export function getPremiumTattooOptions(intention: string, nativeZodiac: { sun: string; moon: string; rising: string }, primarySuggestion: any) {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const sun = cap(nativeZodiac.sun);
  const moon = cap(nativeZodiac.moon);

  // Pre-defined premium option sets for each intention
  const templateMap: Record<string, any[]> = {
    "Wealth": [
      {
        title: "Golden Wheat Yantra (Option 1)",
        style: "Vedic / Yantra",
        symbolism: "A protective yantra utilizing natural grain vectors to anchor material abundance and physical-plane security.",
        elements: ["Golden wheat sheaf paths", "Concentric cosmic orbits", "Fine-line Unalome base root", "Sacred geometry boundary"],
        colors: "Luminous gold and copper (increases energetic attraction and electrical conduction).",
        placement: "Right Upper Arm / Forearm",
        painIndex: 3,
        energySensitivity: 9,
        size: "3.5 inches",
        direction: "Upward ascending (manifestation path)",
        timing: "Hora of Jupiter, Thursday Morning (Waxing Moon)",
        svgMarkup: primarySuggestion?.tattoo_concept?.svgMarkup || `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.2"><circle cx="50" cy="50" r="42" stroke-dasharray="2 3"/><circle cx="50" cy="50" r="30"/><line x1="50" y1="8" x2="50" y2="92" opacity="0.3"/><path d="M 50 15 Q 53 25, 50 35 Q 47 25, 50 15 Z" fill="#C5A059" fill-opacity="0.1"/><polygon points="50,68 35,88 65,88"/><circle cx="50" cy="78" r="2" fill="#C5A059"/></svg>`
      },
      {
        title: "Taurus Sri Lakshmi Mandala (Option 2)",
        style: "Mandala / Geometry",
        symbolism: "Features the sacred 16-petal lotus matrix paired with Taurus wealth-storing locks to stabilize and scale long-term assets.",
        elements: ["16-petal lotus orbit", "Central Bindu seed point", "Taurus astrological glyph", "Concentric abundance fields"],
        colors: "Polished pure gold and deep emerald green highlights.",
        placement: "Upper Shoulder / Blade",
        painIndex: 4,
        energySensitivity: 8,
        size: "4 inches",
        direction: "Concentric expansion (radiating outward)",
        timing: "Hora of Venus, Friday Dawn (Exalted Moon in Taurus)",
        svgMarkup: `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.2">
          <!-- Concentric Outer Grid -->
          <circle cx="50" cy="50" r="44" stroke="#C5A059" />
          <circle cx="50" cy="50" r="36" stroke-dasharray="2 2" />
          <circle cx="50" cy="50" r="28" />
          
          <!-- Inner Lotus Petals -->
          <path d="M 50 14 Q 53 28, 50 42 Q 47 28, 50 14 Z" fill="#C5A059" fill-opacity="0.15" />
          <path d="M 50 58 Q 53 72, 50 86 Q 47 72, 50 58 Z" fill="#C5A059" fill-opacity="0.15" />
          <path d="M 14 50 Q 28 53, 42 50 Q 28 47, 14 50 Z" fill="#C5A059" fill-opacity="0.15" />
          <path d="M 58 50 Q 72 53, 86 50 Q 72 47, 58 50 Z" fill="#C5A059" fill-opacity="0.15" />
          
          <!-- Central Taurus glyph -->
          <circle cx="50" cy="50" r="8" fill="#FAF6EE" />
          <path d="M 44 46 A 6 6 0 0 1 56 46" />
          <circle cx="50" cy="52" r="5" />
          <circle cx="50" cy="52" r="1.5" fill="#C5A059" />
        </svg>`
      },
      {
        title: "Kubera Abundance Matrix (Option 3)",
        style: "Mathematical Sacred Geometry",
        symbolism: "Vedic matrix mapping of the number sequence 72, attracting high financial resonance and grounding physical wealth avenues.",
        elements: ["3x3 numerical grid lines", "Jupiterian expansion sigils", "Concentric wealth boundaries", "Central focal bindu"],
        colors: "Charcoal black base with fine-line gold nodes.",
        placement: "Inner Wrist / Forearm",
        painIndex: 3,
        energySensitivity: 9,
        size: "3 inches",
        direction: "Linear structural alignment",
        timing: "Hora of Jupiter, Thursday Noon (Waxing Moon)",
        svgMarkup: `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.3">
          <!-- Outer protective square -->
          <rect x="15" y="15" width="70" height="70" />
          <rect x="18" y="18" width="64" height="64" stroke-dasharray="1 2" />
          
          <!-- Grid lines -->
          <line x1="38" y1="15" x2="38" y2="85" />
          <line x1="62" y1="15" x2="62" y2="85" />
          <line x1="15" y1="38" x2="85" y2="38" />
          <line x1="15" y1="62" x2="85" y2="62" />
          
          <!-- Alchemical Jupiter symbols inside centers -->
          <path d="M 50 30 Q 52 24, 50 18 Q 48 24, 50 30 Z" />
          <path d="M 50 70 Q 52 76, 50 82 Q 48 76, 50 70 Z" />
          <path d="M 30 50 Q 24 52, 18 50 Q 24 48, 30 50 Z" />
          <path d="M 70 50 Q 76 52, 82 50 Q 76 48, 70 50 Z" />
          
          <!-- Core seed -->
          <circle cx="50" cy="50" r="3" fill="#C5A059" />
        </svg>`
      }
    ],
    "Love": [
      {
        title: "Resilient Heart Lotus (Option 1)",
        style: "Sacred Geometry & Fine-line",
        symbolism: "Designed with elegant overlapping petals and an infinity loop base to target grief and open relational meridians.",
        elements: ["Lotus rebirth petals", "Infinity somatic curve", "Prana lattice structure", "Venusian orbit circles"],
        colors: "Soft rose gold and emerald green contours.",
        placement: "Sternum / Chest Center",
        painIndex: 8,
        energySensitivity: 10,
        size: "2.5 inches",
        direction: "Symmetrical inward balancing",
        timing: "Hora of Venus, Friday Dawn",
        svgMarkup: primarySuggestion?.tattoo_concept?.svgMarkup || `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.2"><path d="M 50 72 C 25 55, 20 35, 50 28 C 80 35, 75 55, 50 72 Z" fill="#C5A059" fill-opacity="0.1"/><circle cx="50" cy="45" r="3" fill="#C5A059"/></svg>`
      },
      {
        title: "Anahata Heart Pulse Mandala (Option 2)",
        style: "Fine-line Dotwork / Geometric",
        symbolism: "An open-frame Anahata yantra which expands the breath, dissolving past relationship blockages and lineage pain.",
        elements: ["Double intersecting triangles (Shatkona)", "Overlapping 12-petal heart crown", "Lineage-healing pulse wave", "Venus orbital nodes"],
        colors: "Charcoal black and pale pink highlights.",
        placement: "Back of the Neck / Spine Start",
        painIndex: 4,
        energySensitivity: 9,
        size: "3 inches",
        direction: "Vertical alignment",
        timing: "Hora of Venus, Friday Night",
        svgMarkup: `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.2">
          <!-- Shatkona (Star of David representing Union of opposites) -->
          <polygon points="50,20 76,65 24,65" />
          <polygon points="50,80 76,35 24,35" />
          
          <!-- Concentric circles -->
          <circle cx="50" cy="50" r="38" stroke-dasharray="2 2" />
          <circle cx="50" cy="50" r="14" />
          
          <!-- Seed point in center -->
          <circle cx="50" cy="50" r="2.5" fill="#C5A059" />
          
          <!-- Outer radiating pulses -->
          <path d="M 50 12 L 50 4" />
          <path d="M 50 88 L 50 96" />
          <path d="M 12 50 L 4 50" />
          <path d="M 88 50 L 96 50" />
        </svg>`
      },
      {
        title: "Soma Devotion Sigil (Option 3)",
        style: "Alchemical Script / Calligraphy",
        symbolism: "A beautiful script-fused alchemical seal that activates the receptive lunar and Venusian properties of self-love and devotion.",
        elements: ["Crescent Moon chalice", "Venusian star key", "Flowing somatic water waves", "Lotus root anchor"],
        colors: "Cool silver and deep charcoal black.",
        placement: "Inner Wrist / Forearm Pulse Node",
        painIndex: 3,
        energySensitivity: 9,
        size: "3.5 inches",
        direction: "Curved along arm muscle",
        timing: "Hora of Venus or Moon, Monday Dawn (Waxing Moon)",
        svgMarkup: `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.3">
          <!-- Receptive Crescent Moon -->
          <path d="M 30 30 A 25 25 0 0 0 70 30 A 20 20 0 0 1 30 30 Z" fill="#C5A059" fill-opacity="0.1" />
          
          <!-- Vertical spine axis -->
          <line x1="50" y1="15" x2="50" y2="85" />
          
          <!-- Venus cross at bottom -->
          <circle cx="50" cy="65" r="10" />
          <line x1="42" y1="75" x2="58" y2="75" />
          
          <!-- Water wave details representing flow of emotions -->
          <path d="M 35 48 Q 42 45, 50 48 Q 58 51, 65 48" />
          <path d="M 35 54 Q 42 51, 50 54 Q 58 57, 65 54" stroke-dasharray="1 1" />
          
          <circle cx="50" cy="15" r="1.5" fill="#C5A059" />
        </svg>`
      }
    ],
    "Career": [
      {
        title: "Sovereign Expression Sigil (Option 1)",
        style: "Alchemical Sigils",
        symbolism: "Combines symmetrical wings with Martian vector nodes to stimulate confidence, professional strength, and leadership visibility.",
        elements: ["Symmetrical stellar wings", "Mars alchemical nodes", "Active focus spear", "Solar compass rays"],
        colors: "Bold crimson and pure gold.",
        placement: "Forearm Inner Meridian",
        painIndex: 4,
        energySensitivity: 8,
        size: "4 inches",
        direction: "Radial outward expansion",
        timing: "Hora of Mars, Tuesday Solar Noon",
        svgMarkup: primarySuggestion?.tattoo_concept?.svgMarkup || `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.2"><circle cx="50" cy="50" r="24"/><line x1="50" y1="10" x2="50" y2="90"/><path d="M 25 50 Q 50 20, 75 50 Q 50 80, 25 50 Z"/></svg>`
      },
      {
        title: "Surya Authority Mandala (Option 2)",
        style: "Vedic Solar Mandala",
        symbolism: "A magnificent 12-ray solar disk representing the 12 Adityas, fueling professional authority, personal charisma, and visible success.",
        elements: ["12-ray solar wheel", "Center focus Bindu", "Ascendant ruler glyphs", "Protective ring of fire"],
        colors: "Vibrant yellow gold and bronze contouring.",
        placement: "Upper Shoulder / Shoulder Blade",
        painIndex: 5,
        energySensitivity: 8,
        size: "4.5 inches",
        direction: "Rotational outward radiance",
        timing: "Hora of Sun, Sunday Solar Noon",
        svgMarkup: `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.2">
          <!-- Central Solar Core -->
          <circle cx="50" cy="50" r="16" fill="#C5A059" fill-opacity="0.1" />
          <circle cx="50" cy="50" r="12" />
          <circle cx="50" cy="50" r="3" fill="#C5A059" />
          
          <!-- Outer border tracking orbits -->
          <circle cx="50" cy="50" r="32" stroke-dasharray="2 3" />
          <circle cx="50" cy="50" r="44" />
          
          <!-- 12 Radiating Solar rays representing 12 months/Adityas -->
          ${Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 50 + Math.cos(angle) * 16;
            const y1 = 50 + Math.sin(angle) * 16;
            const x2 = 50 + Math.cos(angle) * 44;
            const y2 = 50 + Math.sin(angle) * 44;
            return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
          }).join("\n")}
        </svg>`
      },
      {
        title: "Manipura Willpower Yantra (Option 3)",
        style: "Geometric Yantra",
        symbolism: "An downward-pointing primary fire triangle surrounded by a 10-petal solar frame to trigger courage and executive manifest willpower.",
        elements: ["Manipura seed triangle", "10-petal lotus frame", "Mars & Sun intersection paths", "Boundary protective lines"],
        colors: "Rich coppery red and matte gold lines.",
        placement: "Outer Arm / Tricep node",
        painIndex: 4,
        energySensitivity: 9,
        size: "3.8 inches",
        direction: "Downward centering gravity vector",
        timing: "Hora of Sun or Mars, Solar Noon on Sunday/Tuesday",
        svgMarkup: `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.3">
          <!-- Inner Downward Manipura Fire Triangle -->
          <polygon points="50,82 18,28 82,28" fill="#C5A059" fill-opacity="0.1" />
          <polygon points="50,72 26,34 74,34" />
          
          <!-- Concentric Outer Protective Rings -->
          <circle cx="50" cy="46" r="40" stroke-dasharray="1 3" />
          <circle cx="50" cy="46" r="32" />
          
          <!-- Center focal points representing action nodes -->
          <circle cx="50" cy="46" r="4" fill="#C5A059" />
          <circle cx="50" cy="28" r="2.5" fill="#C5A059" />
          <circle cx="34" cy="55" r="2.5" fill="#C5A059" />
          <circle cx="66" cy="55" r="2.5" fill="#C5A059" />
        </svg>`
      }
    ],
    "Protection": [
      {
        title: "Mantra of Sovereign Truth (Option 1)",
        style: "Vedic / Yantra",
        symbolism: "Combines defensive crescents with concentric boundaries to shield sensitive throat and emotional centers from external stress.",
        elements: ["Crescent shield vessel", "Concentric defense rings", "Saturn protective node", "Spoken frequency waves"],
        colors: "Deep cobalt and charcoal black.",
        placement: "Collarbone / Upper Chest Center",
        painIndex: 5,
        energySensitivity: 9,
        size: "3 inches",
        direction: "Horizontal defensive barrier",
        timing: "Hora of Saturn, Saturday Dusk",
        svgMarkup: primarySuggestion?.tattoo_concept?.svgMarkup || `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.2"><circle cx="50" cy="50" r="38"/><path d="M 15 50 A 35 35 0 0 0 85 50"/><line x1="50" y1="15" x2="50" y2="85"/></svg>`
      },
      {
        title: "Sri Sudarshana Kavach (Option 2)",
        style: "Complex Sacred Geometry",
        symbolism: "An ancient, highly intricate protective wheel that deflects negative energetic projections and establishes a boundary shield.",
        elements: ["Intersecting geometric squares (Asthakona)", "Spike vector boundaries", "Central defense node", "Karmic deflection lines"],
        colors: "Charcoal black and gleaming steel gold.",
        placement: "Upper Spine / Shoulder blade",
        painIndex: 5,
        energySensitivity: 10,
        size: "4 inches",
        direction: "Concentric defensive rotation",
        timing: "Hora of Saturn, Saturday Night (Waning Moon)",
        svgMarkup: `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.2">
          <!-- Overlapping squares forming 8-pointed star protection star -->
          <rect x="20" y="20" width="60" height="60" />
          <rect x="20" y="20" width="60" height="60" transform="rotate(45, 50, 50)" />
          
          <!-- Concentric defense boundaries -->
          <circle cx="50" cy="50" r="42" />
          <circle cx="50" cy="50" r="34" stroke-dasharray="2 2" />
          <circle cx="50" cy="50" r="22" />
          
          <!-- Deflective boundary lines radiating from center -->
          <line x1="50" y1="10" x2="50" y2="90" />
          <line x1="10" y1="50" x2="90" y2="50" />
          
          <!-- Primal core seed -->
          <circle cx="50" cy="50" r="6" fill="#C5A059" fill-opacity="0.2" />
          <circle cx="50" cy="50" r="2.5" fill="#C5A059" />
        </svg>`
      },
      {
        title: "Ketu Liberation Shield (Option 3)",
        style: "Abstract Tribal / Sigil",
        symbolism: "A specialized Ketu-infused linear sigil that dissolves ancestral attachments, cutting off karmic feedback loops.",
        elements: ["Ketu spiritual lance", "Shielded triangle node", "Detached coordinate lines", "Ascendant-guarding rings"],
        colors: "Dark matte black ink only.",
        placement: "Outer Arm / Forearm",
        painIndex: 4,
        energySensitivity: 9,
        size: "4.5 inches",
        direction: "Vertical descending (grounding past karma)",
        timing: "Hora of Saturn, Saturday Midnight",
        svgMarkup: `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.3">
          <!-- Main central spear cutting through blockages -->
          <line x1="50" y1="10" x2="50" y2="90" />
          <polygon points="50,10 44,24 56,24" fill="#C5A059" />
          
          <!-- Ketu alchemical crescent -->
          <path d="M 32 60 A 18 18 0 0 0 68 60" stroke-width="1.5" />
          
          <!-- Ascendant safeguarding diamond -->
          <polygon points="50,30 65,45 50,60 35,45" />
          
          <!-- Intersecting grounding nodes -->
          <circle cx="50" cy="45" r="3" fill="#C5A059" />
          <circle cx="35" cy="45" r="1.5" fill="#C5A059" />
          <circle cx="65" cy="45" r="1.5" fill="#C5A059" />
          <line x1="28" y1="45" x2="72" y2="45" stroke-dasharray="1 1" />
        </svg>`
      }
    ],
    "Healing": [
      {
        title: "Astral Lunar Receiver (Option 1)",
        style: "Botanical Alchemy",
        symbolism: "Tracks waxing and waning lunar phases around a central pulse receiver to purge metabolic blockages and cellular fatigue.",
        elements: ["Waxing and waning lunar phases", "Central pineal eye node", "Sprouting alchemical ferns", "Pleiades alignment stars"],
        colors: "Somatic silver and deep violet.",
        placement: "Inner Wrist Pulse Point",
        painIndex: 4,
        energySensitivity: 8,
        size: "3 inches",
        direction: "Fluid muscle-hugging alignment",
        timing: "Hora of Moon, Monday Dawn",
        svgMarkup: primarySuggestion?.tattoo_concept?.svgMarkup || `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.2"><path d="M 50 18 A 32 32 0 0 1 50 82 A 25 25 0 0 0 50 18 Z" fill="#C5A059" fill-opacity="0.1"/><circle cx="50" cy="50" r="5" fill="#C5A059"/></svg>`
      },
      {
        title: "Sushumna Caduceus Helix (Option 2)",
        style: "Flowing Line / Kundalini",
        symbolism: "Represents the Ida, Pingala, and central Sushumna nerve channels twisting upwards to balance masculine/feminine life-force.",
        elements: ["Ida & Pingala double helix", "Sushumna central axis line", "Chakra ascending nodal stars", "Wings of spiritual ascent"],
        colors: "Silver, gold, and charcoal gray nodes.",
        placement: "Back Spine Center / Spine Start",
        painIndex: 6,
        energySensitivity: 10,
        size: "5 inches",
        direction: "Vertical ascending (kundalini path)",
        timing: "Hora of Jupiter, Thursday Dawn (Full Moon)",
        svgMarkup: `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.2">
          <!-- Central Sushumna spinal channel -->
          <line x1="50" y1="10" x2="50" y2="90" />
          
          <!-- Double helix representing Ida (receptive lunar) & Pingala (active solar) nadis -->
          <path d="M 50 18 Q 66 32, 50 46 Q 34 60, 50 74 Q 66 88, 50 90" stroke-width="1" />
          <path d="M 50 18 Q 34 32, 50 46 Q 66 60, 50 74 Q 34 88, 50 90" stroke-width="1" stroke-dasharray="1 1" />
          
          <!-- Winged crown expansion representing spiritual release -->
          <path d="M 50 18 C 30 14, 32 5, 50 10 C 68 5, 70 14, 50 18 Z" fill="#C5A059" fill-opacity="0.1" />
          
          <!-- Chakra nodes along the spine -->
          <circle cx="50" cy="18" r="2" fill="#C5A059" />
          <circle cx="50" cy="32" r="2.5" fill="#C5A059" />
          <circle cx="50" cy="46" r="2" fill="#C5A059" />
          <circle cx="50" cy="60" r="2.5" fill="#C5A059" />
          <circle cx="50" cy="74" r="2" fill="#C5A059" />
        </svg>`
      },
      {
        title: "Sacred Saffron Healer Lotus (Option 3)",
        style: "Fine-line Dotwork / Lotus",
        symbolism: "Soma-aligned 1000-petal lotus that opens the crown gateway, calming the neurological system and washing out heavy stress.",
        elements: ["1000-petal complex dotwork", "Lunar crown orbits", "Saffron healing center nodes", "Ancestral integration rays"],
        colors: "Deep purple and rich copper highlights.",
        placement: "Inner Forearm Pulse Center",
        painIndex: 4,
        energySensitivity: 9,
        size: "3.5 inches",
        direction: "Concentric blooming frame",
        timing: "Hora of Moon or Venus, Thursday Dawn (Waxing Moon)",
        svgMarkup: `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.2">
          <!-- Outer complex aura circle -->
          <circle cx="50" cy="50" r="44" stroke-dasharray="1 2" />
          <circle cx="50" cy="50" r="38" />
          
          <!-- Complex geometric layered star nodes representing 1000 petals -->
          <path d="M 50 15 L 59 34 L 79 26 L 68 44 L 85 50 L 68 56 L 79 74 L 59 66 L 50 85 L 41 66 L 21 74 L 32 56 L 15 50 L 32 44 L 21 26 L 41 34 Z" fill="#C5A059" fill-opacity="0.08" />
          
          <!-- Core healing bindu -->
          <circle cx="50" cy="50" r="14" />
          <circle cx="50" cy="50" r="4" fill="#C5A059" />
          
          <!-- Orbit trackers representing planetary cooling cycles -->
          <circle cx="50" cy="24" r="1.5" fill="#C5A059" />
          <circle cx="50" cy="76" r="1.5" fill="#C5A059" />
        </svg>`
      }
    ],
    "Default": [
      {
        title: "Sushumna Destiny Axis (Option 1)",
        style: "Fine-line Minimalist",
        symbolism: "Directly aligns the back nervous system (Sushumna) with planetary coordinates to foster higher wisdom and spiritual ascension.",
        elements: ["Spinal axis guide-path", "Seven ascending energy nodes", "Ascending triangles", "Cosmic gateway portal"],
        colors: "Luminous white-gold and obsidian black.",
        placement: "Back of Neck / Upper Spine",
        painIndex: 7,
        energySensitivity: 10,
        size: "4 inches",
        direction: "Vertical ascending (spiritual ascension)",
        timing: "Hora of Jupiter, Thursday Morning",
        svgMarkup: primarySuggestion?.tattoo_concept?.svgMarkup || `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.2"><line x1="50" y1="10" x2="50" y2="90"/><circle cx="50" cy="50" r="12"/></svg>`
      },
      {
        title: "Celestial Astrolabe Mandala (Option 2)",
        style: "Sacred Geometry / Astrolabe",
        symbolism: "A fully detailed cosmic map matching your Sun in ${sun} and Moon in ${moon} to coordinate with guiding natal planes.",
        elements: ["Lagna rising horizon line", "Astrological sign coordinates", "Planet degree orbital nodes", "Central protective anchor"],
        colors: "Pure gold with fine-line charcoal gray orbits.",
        placement: "Upper Shoulder / Blade",
        painIndex: 4,
        energySensitivity: 9,
        size: "4.5 inches",
        direction: "Rotational centering alignment",
        timing: "Hora of Jupiter, Thursday Noon (Waxing Moon)",
        svgMarkup: `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.2">
          <!-- Outer Astrolabe Ring -->
          <circle cx="50" cy="50" r="45" stroke-width="1.5" />
          <circle cx="50" cy="50" r="41" stroke-dasharray="1 2" />
          <circle cx="50" cy="50" r="32" />
          
          <!-- Coordinate Crosshairs -->
          <line x1="50" y1="5" x2="50" y2="95" />
          <line x1="5" y1="50" x2="95" y2="50" />
          <line x1="18" y1="18" x2="82" y2="82" opacity="0.4" />
          <line x1="18" y1="82" x2="82" y2="18" opacity="0.4" />
          
          <!-- Inner geometric focus -->
          <circle cx="50" cy="50" r="14" fill="#C5A059" fill-opacity="0.1" />
          <polygon points="50,36 62,58 38,58" />
          <polygon points="50,64 62,42 38,42" />
          <circle cx="50" cy="50" r="3.5" fill="#C5A059" />
        </svg>`
      },
      {
        title: "Ascendant Portal Sigil (Option 3)",
        style: "Modern Alchemical Fine-line",
        symbolism: "A beautiful vertically oriented key that matches the structural Lagna coordinate of ${nativeZodiac.rising || 'Virgo'}, acting as a personal energy lock.",
        elements: ["Vertical coordinate pillar", "Rising sign emblem", "Venus-Saturn orbit intersection", "Auric safety gate circle"],
        colors: "Pure gold and copper highlights.",
        placement: "Forearm Inner Meridian",
        painIndex: 3,
        energySensitivity: 8,
        size: "4 inches",
        direction: "Vertical alignment",
        timing: "Hora of Jupiter, Thursday Dawn",
        svgMarkup: `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.3">
          <!-- Main Pillar -->
          <line x1="50" y1="12" x2="50" y2="88" />
          
          <!-- Top portal key circle -->
          <circle cx="50" cy="26" r="14" />
          <circle cx="50" cy="26" r="6" fill="#C5A059" fill-opacity="0.2" />
          
          <!-- Intersecting protective diamond -->
          <polygon points="50,45 68,58 50,71 32,58" />
          
          <!-- Alignment parameters representing birth coordinate degrees -->
          <line x1="32" y1="58" x2="68" y2="58" stroke-dasharray="1 1" />
          <circle cx="50" cy="58" r="3" fill="#C5A059" />
          
          <!-- Bottom anchor crescent -->
          <path d="M 38 78 A 12 12 0 0 0 62 78" />
          <circle cx="50" cy="84" r="2.5" fill="#C5A059" />
        </svg>`
      }
    ]
  };

  const results = templateMap[intention] || templateMap["Default"];

  // Inject Simple/Moderate/Advanced markups to each option dynamically
  return results.map(opt => {
    // Generate simple and advanced versions of the option
    let simple = opt.svgMarkup
      .replace(/stroke-dasharray="[^"]*"/g, 'style="display:none"')
      .replace(/opacity="0\.[1-5]"/g, 'style="display:none"')
      .replace(/<polygon[^>]*>/g, '')
      .replace(/stroke-width="1\.[3-9]"/g, 'stroke-width="1.1"');
    
    if (!simple.includes("<svg")) simple = opt.svgMarkup;

    let advanced = opt.svgMarkup;
    if (opt.svgMarkup.includes("</svg>")) {
      const celestialOverlay = `
        <circle cx="50" cy="50" r="47" stroke="currentColor" stroke-width="0.8" opacity="0.45" />
        <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="0.5" stroke-dasharray="1 3" opacity="0.7" />
        <line x1="50" y1="2" x2="50" y2="98" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.3" />
        <line x1="2" y1="50" x2="98" y2="50" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.3" />
      `;
      advanced = opt.svgMarkup.replace("</svg>", `${celestialOverlay}</svg>`);
    }

    return {
      ...opt,
      svgMarkupSimple: simple,
      svgMarkupModerate: opt.svgMarkup,
      svgMarkupAdvanced: advanced,
      simpleDesc: `A highly minimal fine-line layout focusing purely on core structural geometry of the ${opt.title}.`,
      moderateDesc: `A balanced, elegant composition of the ${opt.title} incorporating all classic energetic parameters.`,
      advancedDesc: `A highly detailed orbital layout of the ${opt.title} with multiple star nodes and protective energetic grids.`
    };
  });
}

// Calibrates 3 dynamic auspicious timing slots (Muhurtas) for the user's report
export function getPremiumMuhurtas(nativeZodiac: { sun: string; moon: string; rising: string }, intention: string) {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const sun = cap(nativeZodiac.sun);
  const moon = cap(nativeZodiac.moon);

  const getDay = (intent: string) => {
    switch (intent.toLowerCase()) {
      case "wealth": return "Thursday (Guru Day)";
      case "love": return "Friday (Shukra Day)";
      case "career": return "Tuesday (Mangal Day)";
      case "protection": return "Saturday (Shani Day)";
      case "healing": return "Monday (Chandra Day)";
      default: return "Thursday (Guru Day)";
    }
  };

  const getPlanet = (intent: string) => {
    switch (intent.toLowerCase()) {
      case "wealth": return "Jupiter (Guru)";
      case "love": return "Venus (Shukra)";
      case "career": return "Sun / Mars";
      case "protection": return "Saturn (Shani)";
      case "healing": return "Moon (Chandra)";
      default: return "Jupiter (Guru)";
    }
  };

  const primaryDay = getDay(intention);
  const rulingPlanet = getPlanet(intention);

  return [
    {
      slotName: "Slot 1: Optimal Planetary Resonance (Recommended)",
      dateString: "July 23, 2026 (Upcoming Thursday)",
      timeWindow: "06:15 AM - 07:30 AM (Brahma Muhurta & Jupiter Hora)",
      lunarPhase: "Waxing Crescent Moon (8th Tithi - Auspicious for Manifestation)",
      planetaryHora: `${rulingPlanet} Hora`,
      ritualPractice: `Light a single beeswax candle. Anoint your pulse point with sandalwood oil. Sit in silent meditation and chant your custom activation mantra 27 times before the first needle contact.`
    },
    {
      slotName: "Slot 2: Subconscious Somatic Integration",
      dateString: "July 27, 2026 (Upcoming Monday)",
      timeWindow: "08:45 PM - 10:00 PM (Cooling Lunar Hora)",
      lunarPhase: "Waxing Gibbous Moon (Exalted Moon Alignment)",
      planetaryHora: "Chandra (Moon) Hora",
      ritualPractice: "Anoint the dermal node with cool jasmine or camphor oil. Chant the receptive somatic syllables while listening to your solfeggio frequency to clear lineage blockages."
    },
    {
      slotName: "Slot 3: Shielding & Boundary Lock",
      dateString: "August 01, 2026 (Upcoming Saturday)",
      timeWindow: "05:00 AM - 06:15 AM (Saturn Dawn Hora)",
      lunarPhase: "Waning Moon phase (Ideal for cleansing and shielding)",
      planetaryHora: "Saturn (Shani) Hora",
      ritualPractice: "Dab black sesame or frankincense on the dermal node. Conduct 3 rounds of pranayama breathing to cement the protective auric boundary of the yantra."
    }
  ];
}
