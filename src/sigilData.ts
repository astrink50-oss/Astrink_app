/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SigilLayer {
  id: string;
  name: string;
  description: string;
  significance: string;
  svgMarkup: string; // Core paths matching 0 0 100 100 viewbox
}

export interface ChakraBase extends SigilLayer {
  sanskrit: string;
  element: string;
}

export interface AstrologyGlyph extends SigilLayer {
  element: string;
  ruler: string;
}

export interface PlanetSigil extends SigilLayer {
  governs: string;
  metal: string;
}

// 1. CHAKRA SACRED GEOMETRY BASES (Large background elements)
export const CHAKRA_BASES: ChakraBase[] = [
  {
    id: "root",
    name: "Root Chakra (Muladhara)",
    sanskrit: "Muladhara",
    element: "Earth",
    description: "Stable Square & Solid Grounding Portal",
    significance: "Establishes a solid foundational anchor. Represents physical survival, material abundance, ancestral grounding, and primal safety. The outer square is the ancient Vedic emblem for Prithvi (Earth), locking energy to the physical plane.",
    svgMarkup: `
      <!-- Muladhara Outer Square -->
      <rect x="15" y="15" width="70" height="70" rx="4" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.3" />
      <rect x="20" y="20" width="60" height="60" rx="2" stroke="currentColor" stroke-width="0.8" stroke-dasharray="2 2" fill="none" opacity="0.2" />
      <!-- Central Grounding Circle -->
      <circle cx="50" cy="50" r="28" stroke="currentColor" stroke-width="1.2" fill="none" />
      <!-- Downward Earth Triangle -->
      <polygon points="50,70 26,35 74,35" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="currentColor" fill-opacity="0.05" />
      <!-- Concentric boundary -->
      <circle cx="50" cy="50" r="12" stroke="currentColor" stroke-width="0.8" stroke-dasharray="1 1" fill="none" opacity="0.6" />
    `
  },
  {
    id: "sacral",
    name: "Sacral Chakra (Svadhisthana)",
    sanskrit: "Svadhisthana",
    element: "Water",
    description: "Crescent Moons & Flowing Waves",
    significance: "Activates emotional expression, sensual harmony, raw creativity, and passion. Features concentric overlapping circles representing water ripples and dual crescent moons reflecting tidal cosmic currents of change and creation.",
    svgMarkup: `
      <!-- Svadhisthana Rippling Orbits -->
      <circle cx="50" cy="50" r="42" stroke="currentColor" stroke-width="0.8" stroke-dasharray="4 2" fill="none" opacity="0.4" />
      <circle cx="50" cy="50" r="32" stroke="currentColor" stroke-width="1.2" fill="none" />
      <!-- Double Crescent Moons -->
      <path d="M 50 18 A 32 32 0 0 1 50 82 A 25 25 0 0 0 50 18 Z" stroke="currentColor" stroke-width="1" fill="currentColor" fill-opacity="0.05" />
      <path d="M 50 18 A 32 32 0 0 0 50 82 A 39 39 0 0 1 50 18 Z" stroke="currentColor" stroke-width="0.8" opacity="0.5" fill="none" />
      <!-- Water Waves at Base -->
      <path d="M 32 50 Q 41 46, 50 50 T 68 50" stroke="currentColor" stroke-width="1.2" fill="none" />
      <path d="M 35 55 Q 42.5 52, 50 55 T 65 55" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.5" />
      <circle cx="50" cy="50" r="3" fill="currentColor" />
    `
  },
  {
    id: "solar_plexus",
    name: "Solar Plexus (Manipura)",
    sanskrit: "Manipura",
    element: "Fire",
    description: "Radiant Sun Rays & Upward Triangle",
    significance: "Ignites personal willpower, career drive, radiating confidence, and digestive fire. An upward-pointing triangle represents rising heat, crowned by radiating rays that represent outward sovereign power.",
    svgMarkup: `
      <!-- Manipura Radiating Rays -->
      <path d="M 50 8 L 50 14 M 50 92 L 50 86 M 8 50 L 14 50 M 92 50 L 86 50 M 20 20 L 25 25 M 80 80 L 75 75 M 20 80 L 25 75 M 80 20 L 75 25" stroke="currentColor" stroke-width="1" opacity="0.6" />
      <!-- Shield Circle -->
      <circle cx="50" cy="50" r="32" stroke="currentColor" stroke-width="1.2" fill="none" />
      <!-- Upward Rising Fire Triangle -->
      <polygon points="50,22 24,66 76,66" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="currentColor" fill-opacity="0.05" />
      <!-- Central Fire Core -->
      <circle cx="50" cy="52" r="8" stroke="currentColor" stroke-width="1" fill="none" />
      <line x1="50" y1="52" x2="50" y2="35" stroke="currentColor" stroke-width="0.8" stroke-dasharray="1 1" />
    `
  },
  {
    id: "heart",
    name: "Heart Chakra (Anahata)",
    sanskrit: "Anahata",
    element: "Air",
    description: "Interlocking Hexagram Star of Winds",
    significance: "Nurtures unconditional self-love, grief healing, and boundary wisdom. The intersecting upward (masculine/spirit) and downward (feminine/matter) triangles form a perfect hexagram star representing energetic balance, wind channels, and cosmic empathy.",
    svgMarkup: `
      <!-- Anahata Air Boundary -->
      <circle cx="50" cy="50" r="44" stroke="currentColor" stroke-width="0.8" stroke-dasharray="1 2" fill="none" opacity="0.4" />
      <circle cx="50" cy="50" r="34" stroke="currentColor" stroke-width="1.2" fill="none" />
      <!-- Interlocking Triangles (Yantra Hexagram) -->
      <polygon points="50,18 20,68 80,68" stroke="currentColor" stroke-width="1" fill="none" opacity="0.6" />
      <polygon points="50,82 20,32 80,32" stroke="currentColor" stroke-width="1" fill="none" opacity="0.6" />
      <!-- Heart lotus nodes -->
      <circle cx="50" cy="50" r="14" stroke="currentColor" stroke-width="1" fill="none" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    `
  },
  {
    id: "throat",
    name: "Throat Chakra (Vishuddha)",
    sanskrit: "Vishuddha",
    element: "Ether (Space)",
    description: "Concentric Sky Spheres & Sound Node",
    significance: "Amplifies authentic communication, speaking absolute personal truth, and creative projection. The inner circle holding a downward-facing triangle represents the pure chalice of space, receiving and translating vibrational mantra frequency.",
    svgMarkup: `
      <!-- Vishuddha Spatial orbits -->
      <circle cx="50" cy="50" r="42" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.3" />
      <circle cx="50" cy="50" r="32" stroke="currentColor" stroke-width="1.2" fill="none" />
      <!-- Spatial Chalice (Downward Triangle) -->
      <polygon points="50,78 28,34 72,34" stroke="currentColor" stroke-width="1" fill="currentColor" fill-opacity="0.05" />
      <!-- Sound Seed Circle -->
      <circle cx="50" cy="46" r="15" stroke="currentColor" stroke-width="1" stroke-dasharray="2 1" fill="none" />
      <circle cx="50" cy="46" r="3" fill="currentColor" />
      <!-- Antenna Rays -->
      <line x1="50" y1="18" x2="50" y2="34" stroke="currentColor" stroke-width="0.8" />
    `
  },
  {
    id: "third_eye",
    name: "Third Eye Chakra (Ajna)",
    sanskrit: "Ajna",
    element: "Light",
    description: "Two-Winged Lotus & Cosmic Focal Point",
    significance: "Expands intuition, visual imagination, mental clarity, and astral dreaming. Features two major flanking lotus petals (representing Shiva and Shakti, or logic and intuition) uniting at the central third-eye pineal portal.",
    svgMarkup: `
      <!-- Left Petal Arc -->
      <path d="M 50 18 C 25 18, 12 34, 12 50 C 12 66, 25 82, 50 82" stroke="currentColor" stroke-width="1.2" fill="none" />
      <!-- Right Petal Arc -->
      <path d="M 50 18 C 75 18, 88 34, 88 50 C 88 66, 75 82, 50 82" stroke="currentColor" stroke-width="1.2" fill="none" />
      <!-- central circle and Ajna triangle -->
      <circle cx="50" cy="50" r="26" stroke="currentColor" stroke-width="1" fill="none" />
      <polygon points="50,72 32,38 68,38" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.7" />
      <!-- Radiant Eye Node -->
      <circle cx="50" cy="48" r="5" fill="currentColor" />
      <line x1="30" y1="50" x2="70" y2="50" stroke="currentColor" stroke-width="0.8" opacity="0.5" />
    `
  },
  {
    id: "crown",
    name: "Crown Chakra (Sahasrara)",
    sanskrit: "Sahasrara",
    element: "Cosmic Energy",
    description: "Infinite Thousand-Petal Star Portal",
    significance: "Connects you to universal divinity, spiritual transcendence, and your highest destiny. Features complex overlapping concentric paths and multi-axis star gates pointing to the absolute infinite beyond material limits.",
    svgMarkup: `
      <!-- Complex orbital rings representing thousand petals -->
      <circle cx="50" cy="50" r="44" stroke="currentColor" stroke-width="0.8" stroke-dasharray="1 1" fill="none" />
      <circle cx="50" cy="50" r="38" stroke="currentColor" stroke-width="1.2" fill="none" />
      <circle cx="50" cy="50" r="32" stroke="currentColor" stroke-width="0.8" stroke-dasharray="3 3" fill="none" />
      <!-- Multi-axis star lines -->
      <path d="M 50 6 L 50 94 M 6 50 L 94 50" stroke="currentColor" stroke-width="0.6" opacity="0.4" />
      <path d="M 19 19 L 81 81 M 19 81 L 81 19" stroke="currentColor" stroke-width="0.6" opacity="0.4" />
      <!-- Central Lotus core -->
      <polygon points="50,38 58,50 50,62 42,50" stroke="currentColor" stroke-width="1" fill="currentColor" fill-opacity="0.1" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    `
  }
];

// 2. ASTROLOGICAL GLYPHS (Centered medium-sized elements)
export const ASTROLOGY_GLYPHS: AstrologyGlyph[] = [
  {
    id: "aries",
    name: "Aries",
    element: "Fire",
    ruler: "Mars",
    description: "The Ram's Charging Horns",
    significance: "Channels fierce initiatory drive, passion, unstoppable courage, and absolute individuality. The horn glyph shoots upward and curves outward, representing the explosive emergence of pure spring fire.",
    svgMarkup: `
      <!-- Aries Horns -->
      <path d="M 50 68 L 50 38 Q 50 25, 36 28 Q 24 31, 30 42 Q 35 48, 44 42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
      <path d="M 50 38 Q 50 25, 64 28 Q 76 31, 70 42 Q 65 48, 56 42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
      <!-- Accent alignment dot -->
      <circle cx="50" cy="74" r="2" fill="currentColor" />
    `
  },
  {
    id: "taurus",
    name: "Taurus",
    element: "Earth",
    ruler: "Venus",
    description: "The Bull's Head & Crescent Crown",
    significance: "Evokes serene grounding, material beauty, loyalty, and deep somatic connection. The circular container capped by an open celestial crescent honors the bovine vessel of steady abundance and material joy.",
    svgMarkup: `
      <!-- Taurus Bull Head -->
      <circle cx="50" cy="55" r="16" stroke="currentColor" stroke-width="2" fill="none" />
      <path d="M 30 36 Q 38 42, 50 42 Q 62 42, 70 36 Q 78 28, 72 18 Q 64 12, 58 30" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none" />
      <path d="M 30 36 Q 22 28, 28 18 Q 36 12, 42 30" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.8" />
    `
  },
  {
    id: "gemini",
    name: "Gemini",
    element: "Air",
    ruler: "Mercury",
    description: "The Sacred Pillars of Duality",
    significance: "Fosters intellectual dexterity, witty curiosity, networking, and the integration of dual shadow/light states. Features twin vertical pillars flanked by horizontal cosmic crossbars, shielding the balance of thoughts.",
    svgMarkup: `
      <!-- Gemini Twins Pillars -->
      <path d="M 32 26 L 68 26 M 32 74 L 68 74" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
      <path d="M 42 26 L 42 74 M 58 26 L 58 74" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none" />
      <!-- Central nexus dot -->
      <circle cx="50" cy="50" r="2.5" fill="currentColor" />
    `
  },
  {
    id: "cancer",
    name: "Cancer",
    element: "Water",
    ruler: "Moon",
    description: "Interlocking Spirals of Ancestral Ocean",
    significance: "Nurtures deep protective warmth, intuition, ancestral heritage, and somatic safety. Twin nesting spirals echo the swirling lunar tides and the protective clasp of the crab, keeping core emotions safe.",
    svgMarkup: `
      <!-- Cancer Interlocking Crab Claws -->
      <path d="M 66 38 C 66 26, 48 26, 48 38 C 48 44, 54 44, 58 38 C 62 32, 68 32, 72 38" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
      <path d="M 34 62 C 34 74, 52 74, 52 62 C 52 56, 46 56, 42 62 C 38 68, 32 68, 28 62" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
      <!-- Connecting orbit path -->
      <circle cx="50" cy="50" r="16" stroke="currentColor" stroke-width="0.8" stroke-dasharray="2 2" fill="none" opacity="0.4" />
    `
  },
  {
    id: "leo",
    name: "Leo",
    element: "Fire",
    ruler: "Sun",
    description: "The Lion's Spiral Mane & Radiant Tail",
    significance: "Radiates solar courage, dramatic creative passion, playfulness, and majestic pride. The seed-circle spirals out into a sweeping upward and downward arc, channeling absolute royal fire.",
    svgMarkup: `
      <!-- Leo Glyph -->
      <circle cx="36" cy="54" r="6" stroke="currentColor" stroke-width="2" fill="none" />
      <path d="M 41 50 C 46 36, 60 22, 66 36 C 72 48, 58 64, 62 76" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
      <!-- Radiant solar sparks -->
      <circle cx="62" cy="80" r="1.5" fill="currentColor" />
    `
  },
  {
    id: "virgo",
    name: "Virgo",
    element: "Earth",
    ruler: "Mercury",
    description: "The Bound Maiden's Protective Coil",
    significance: "Brings pure organization, mental analysis, physical healing, and earthy sanctuary. The triple loops end in a protective crossed loop, representing the harvesting and storing of somatic truth.",
    svgMarkup: `
      <!-- Virgo Glyphs -->
      <path d="M 28 32 L 28 64 M 38 32 L 38 62 M 48 32 L 48 62" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
      <path d="M 28 36 Q 33 26, 38 36 Q 43 26, 48 36 Q 58 26, 58 52 Q 58 68, 48 68 L 62 76" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
    `
  },
  {
    id: "libra",
    name: "Libra",
    element: "Air",
    ruler: "Venus",
    description: "The Scale's Balance Horizon",
    significance: "Amplifies harmonious partnership, aesthetic beauty, objective truth, and absolute balance. The upper arched bridge represents the sun setting over the level horizon line of social justice.",
    svgMarkup: `
      <!-- Libra Scales Horizon -->
      <path d="M 24 38 Q 50 14, 76 38" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
      <path d="M 24 38 L 76 38" stroke="currentColor" stroke-width="1" fill="none" opacity="0.3" />
      <path d="M 20 62 L 80 62" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
      <!-- Balance weight alignment dots -->
      <circle cx="50" cy="50" r="2" fill="currentColor" />
    `
  },
  {
    id: "scorpio",
    name: "Scorpio",
    element: "Water",
    ruler: "Mars / Pluto",
    description: "The Scorpion's Piercing Sting",
    significance: "Drives radical psychological death-rebirth, shadow exploration, raw sexual power, and protective sting barriers. The triple loop is armed with a sharp outward and upward-pointing venomous arrow.",
    svgMarkup: `
      <!-- Scorpio Sting -->
      <path d="M 28 34 L 28 64 M 38 34 L 38 64 L 38 42 M 48 34 L 48 60 Q 48 64, 52 64 L 62 64" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
      <path d="M 28 38 Q 33 28, 38 38 Q 43 28, 48 38 Q 54 28, 56 46" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
      <!-- Sting Arrow -->
      <path d="M 54 58 L 66 64 L 60 52 M 66 64 L 50 78" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    `
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    element: "Fire",
    ruler: "Jupiter",
    description: "The Centaur's Ascending Arrow",
    significance: "Triggers expansive spiritual truth seeking, philosophical optimism, travel, and luck. The sharp upward-pointing diagonal arrow is crossed by a stabilizing horizontal anchor bar, grounding higher wisdom.",
    svgMarkup: `
      <!-- Sagittarius Arrow -->
      <line x1="28" y1="72" x2="72" y2="28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
      <!-- Arrow tip -->
      <path d="M 54 28 L 72 28 L 72 46" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <!-- Cross anchor bar -->
      <line x1="38" y1="42" x2="58" y2="62" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    `
  },
  {
    id: "capricorn",
    name: "Capricorn",
    element: "Earth",
    ruler: "Saturn",
    description: "The Sea-Goat's Ascending Horn & Looped Tail",
    significance: "Instills stoic resilience, mastery of structural structures, long-term legacy creation, and patience. Synthesizes the mountain goat's horns of climb with the sea monster's looped tail of watery depth.",
    svgMarkup: `
      <!-- Capricorn sea-goat -->
      <path d="M 26 34 L 36 34 L 36 62 Q 36 74, 44 74 Q 52 74, 52 62 Q 52 50, 64 50 Q 74 50, 74 62 A 6 6 0 1 1 62 68" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
      <path d="M 36 34 Q 30 22, 22 42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
      <circle cx="26" cy="34" r="1.5" fill="currentColor" />
    `
  },
  {
    id: "aquarius",
    name: "Aquarius",
    element: "Air",
    ruler: "Saturn / Uranus",
    description: "The Water-Bearer's Twin Electric Waves",
    significance: "Inspires revolutionary humanitarian vision, innovative genius, community networks, and shock transformations. Features twin parallel zig-zag waves transmitting celestial data of future ages.",
    svgMarkup: `
      <!-- Aquarius Electric Waves -->
      <path d="M 24 38 L 34 28 L 44 38 L 54 28 L 64 38 L 74 28" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <path d="M 24 62 L 34 52 L 44 62 L 54 52 L 64 62 L 74 52" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.8" />
      <!-- Grounding dot guides -->
      <circle cx="34" cy="45" r="1.5" fill="currentColor" opacity="0.5" />
      <circle cx="64" cy="45" r="1.5" fill="currentColor" opacity="0.5" />
    `
  },
  {
    id: "pisces",
    name: "Pisces",
    element: "Water",
    ruler: "Jupiter / Neptune",
    description: "The Interlinked Oceans",
    significance: "Activates cosmic mysticism, psychic absorption, healing dreams, and spiritual dissolution. Two crescent lines representing the opposing fish are linked together by a horizontal binding seal.",
    svgMarkup: `
      <!-- Pisces Twin Fish Crescent links -->
      <path d="M 34 24 Q 48 50, 34 76" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
      <path d="M 66 24 Q 52 50, 66 76" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
      <!-- Central bridge binder -->
      <line x1="26" y1="50" x2="74" y2="50" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <!-- Spiritual node sparks -->
      <circle cx="50" cy="41" r="1.5" fill="currentColor" />
      <circle cx="50" cy="59" r="1.5" fill="currentColor" />
    `
  }
];

// 3. PLANETARY SIGILS (Foreground detailed accent symbols/sigils)
export const PLANETARY_SIGILS: PlanetSigil[] = [
  {
    id: "sun",
    name: "The Sun (Sol)",
    governs: "Ego, Vitality, True Identity",
    metal: "Gold",
    description: "Circle of Spirit with Divine Core Node",
    significance: "The ultimate source of light, self-expression, and solar vitality. A perfect circle of spirit surrounding a central point of consciousness, representing absolute centering and radiant life-giving energy.",
    svgMarkup: `
      <!-- Sun Circle and Core Dot -->
      <circle cx="50" cy="50" r="14" stroke="currentColor" stroke-width="1.8" fill="none" />
      <circle cx="50" cy="50" r="3.5" fill="currentColor" />
      <!-- Solar Ray ticks -->
      <line x1="50" y1="28" x2="50" y2="32" stroke="currentColor" stroke-width="1" />
      <line x1="50" y1="68" x2="50" y2="72" stroke="currentColor" stroke-width="1" />
      <line x1="28" y1="50" x2="32" y2="50" stroke="currentColor" stroke-width="1" />
      <line x1="68" y1="50" x2="72" y2="50" stroke="currentColor" stroke-width="1" />
    `
  },
  {
    id: "moon",
    name: "The Moon (Luna)",
    governs: "Subconscious, Empathy, Intuition",
    metal: "Silver",
    description: "Crescent of Soul & Mind Reception",
    significance: "Rules the tides of the subconscious, emotional safety, memories, and psychic receptor points. The crescent of soul stands open to receive divine light, softening rigid intellectual edges.",
    svgMarkup: `
      <!-- Lunar Crescent -->
      <path d="M 42 32 A 18 18 0 0 1 42 68 A 14 14 0 0 0 42 32 Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" fill="currentColor" fill-opacity="0.1" />
      <circle cx="42" cy="50" r="1.5" fill="currentColor" />
    `
  },
  {
    id: "mercury",
    name: "Mercury (Hermes)",
    governs: "Communication, Intellect, Agility",
    metal: "Quicksilver",
    description: "Crescent of Mind above Circle of Spirit over Cross of Matter",
    significance: "Synthesizes rapid intellectual processing, somatic coordination, and mystical hermetic wisdom. Contains all three cosmic principles: crescent of mind, circle of spirit, and physical cross of matter.",
    svgMarkup: `
      <!-- Mercury Glyph -->
      <circle cx="50" cy="48" r="10" stroke="currentColor" stroke-width="1.8" fill="none" />
      <!-- Crescent horns -->
      <path d="M 38 32 Q 50 42, 62 32" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none" />
      <!-- Cross of matter -->
      <line x1="50" y1="58" x2="50" y2="76" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <line x1="40" y1="66" x2="60" y2="66" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    `
  },
  {
    id: "venus",
    name: "Venus (Aphrodite)",
    governs: "Love, Harmony, Aesthetic Value",
    metal: "Copper",
    description: "Circle of Spirit over Cross of Matter",
    significance: "Vibrates with unconditional affection, somatic relaxation, luxury, and magnetic attraction. The circle of pure spirit rises triumphant over the material cross, pulling beauty into reality.",
    svgMarkup: `
      <!-- Venus Glyph -->
      <circle cx="50" cy="40" r="12" stroke="currentColor" stroke-width="1.8" fill="none" />
      <!-- Cross of matter -->
      <line x1="50" y1="52" x2="50" y2="76" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <line x1="38" y1="62" x2="62" y2="62" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    `
  },
  {
    id: "mars",
    name: "Mars (Ares)",
    governs: "Willpower, Action, Courage, Separation",
    metal: "Iron",
    description: "Circle of Spirit with Assertive Arrow",
    significance: "Ignites vital protective shields, drive, muscle action, and boundaries. The spiritual circle pushes energy outward through a diagonal arrow of targeted action.",
    svgMarkup: `
      <!-- Mars Glyph -->
      <circle cx="44" cy="56" r="11" stroke="currentColor" stroke-width="1.8" fill="none" />
      <!-- Assertive Arrow -->
      <line x1="52" y1="48" x2="68" y2="32" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path d="M 54 32 L 68 32 L 68 46" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    `
  },
  {
    id: "jupiter",
    name: "Jupiter (Zeus)",
    governs: "Abundance, Wisdom, expansion, Luck",
    metal: "Tin",
    description: "Crescent of Soul lifting Cross of Matter",
    significance: "Brings celestial optimism, expansion of knowledge, generosity, and miraculous opportunities. The crescent of soul rises above the material arm, lifting your consciousness into sovereign prosperity.",
    svgMarkup: `
      <!-- Jupiter Glyph -->
      <path d="M 32 36 Q 44 24, 44 48 L 44 76 M 34 56 L 62 56" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
      <path d="M 32 36 Q 28 48, 34 56" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.8" />
      <circle cx="44" cy="48" r="2" fill="currentColor" />
    `
  },
  {
    id: "saturn",
    name: "Saturn (Cronus)",
    governs: "Discipline, Boundaries, Time, Karma",
    metal: "Lead",
    description: "Cross of Matter dominant over Crescent of Soul",
    significance: "Rules structural boundaries, skeletal alignments, focus, patience, and karmic life-lessons. The heavy material cross sits on top of the crescent of soul, demanding discipline before spiritual release.",
    svgMarkup: `
      <!-- Saturn Glyph -->
      <path d="M 50 22 L 50 56 Q 50 68, 62 68 M 40 32 L 60 32" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
      <path d="M 50 50 Q 36 50, 36 64 Q 36 78, 50 78" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none" />
      <circle cx="50" cy="68" r="1.5" fill="currentColor" />
    `
  },
  {
    id: "uranus",
    name: "Uranus (Ouranos)",
    governs: "Invention, Sudden Change, Awakening",
    metal: "Uranium / Zinc",
    description: "Cross of Matter flanked by Crescent antennae over Circle",
    significance: "Unlocks radical technological inspiration, sudden energetic shifts, genius insight, and Kundalini awakening. Symbolizes a high-frequency antenna receiving galactic frequency.",
    svgMarkup: `
      <!-- Uranus Glyph -->
      <circle cx="50" cy="68" r="7" stroke="currentColor" stroke-width="1.8" fill="none" />
      <!-- Central Pillar Cross -->
      <line x1="50" y1="24" x2="50" y2="61" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <line x1="36" y1="38" x2="64" y2="38" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <!-- Flanking crescent antennas -->
      <path d="M 36 24 C 36 34, 40 46, 36 52" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none" />
      <path d="M 64 24 C 64 34, 60 46, 64 52" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none" />
    `
  },
  {
    id: "neptune",
    name: "Neptune (Poseidon)",
    governs: "Illusions, Dreams, Ocean, Oneness",
    metal: "Neptunium / Cobalt",
    description: "The Sacred Trident rising from Cross of Matter",
    significance: "Dissolves mental blockages into pure artistic fantasy, infinite oneness, spiritual dreams, and deep compassion. The trident rises from the material cross, piercing through illusion into psychic ocean space.",
    svgMarkup: `
      <!-- Neptune Trident -->
      <line x1="50" y1="20" x2="50" y2="78" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <line x1="38" y1="62" x2="62" y2="62" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <!-- Outer curved bowl -->
      <path d="M 32 30 C 32 54, 68 54, 68 30" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none" />
      <!-- Left & Right points -->
      <circle cx="32" cy="26" r="1.5" fill="currentColor" />
      <circle cx="68" cy="26" r="1.5" fill="currentColor" />
      <circle cx="50" cy="16" r="1.5" fill="currentColor" />
    `
  },
  {
    id: "pluto",
    name: "Pluto (Hades)",
    governs: "Transformation, Power, Underworld",
    metal: "Plutonium",
    description: "Crescent containing Sphere over Cross of Matter",
    significance: "Empowers massive structural rebirth, shadow integration, regeneration, and primal healing from survival crises. The crescent of soul cradles the sphere of eternal life above the physical cross of material limits.",
    svgMarkup: `
      <!-- Pluto Glyph -->
      <line x1="50" y1="46" x2="50" y2="76" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <line x1="38" y1="64" x2="62" y2="64" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <!-- Crescent cup -->
      <path d="M 34 32 C 34 48, 66 48, 66 32" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none" />
      <!-- Floating core circle -->
      <circle cx="50" cy="28" r="7" stroke="currentColor" stroke-width="1.6" fill="none" />
      <circle cx="50" cy="28" r="2" fill="currentColor" />
    `
  }
];

// Helper to construct a deep and poetic astrological/energetic significance reading
export function generateSigilSignificance(
  chakraId: string,
  zodiacId: string,
  planetId: string
): {
  title: string;
  resonance: string;
  psycheAlignment: string;
  practicalMantra: string;
} {
  const chakra = CHAKRA_BASES.find(c => c.id === chakraId) || CHAKRA_BASES[0];
  const zodiac = ASTROLOGY_GLYPHS.find(z => z.id === zodiacId) || ASTROLOGY_GLYPHS[0];
  const planet = PLANETARY_SIGILS.find(p => p.id === planetId) || PLANETARY_SIGILS[0];

  const title = `The ${planet.name.replace("The ", "")}-${zodiac.name} Alchemical ${chakra.sanskrit} Sigil`;

  const resonance = `This custom sigil combines the deep foundational geometry of the ${chakra.name} (${chakra.element} element) with the solar/lunar glyph of ${zodiac.name} (${zodiac.element} element) and the active steering signature of ${planet.name}. By anchoring these three specific frequencies into a single visual boundary, you bridge the gap between your physical body (somatic system) and the natal forces of the cosmos.`;

  const psycheAlignment = `The core geometry of ${chakra.sanskrit} provides the anchor point, focusing its energy directly on ${chakra.element.toLowerCase()} healing. Inside this sacred space, the ${zodiac.name} glyph establishes your native psychological comfort—expressing your soul's current transit goals. Finally, the steering frequency of ${planet.name} serves as the electrical conduit, channeling the energetic qualities of ${planet.metal} and governing your ${planet.governs.toLowerCase()}. Together, they form an active energetic shield that filters out external emotional noise while stimulating deep, latent intuitive power.`;

  const mantras: Record<string, string> = {
    root: "I am safely rooted in my material existence. The Earth supports my steady expansion.",
    sacral: "My creative fire and emotional waters flow in beautiful, sovereign harmony.",
    solar_plexus: "I step into my absolute personal power, radiating confidence and purposeful drive.",
    heart: "I release old shadows of grief, opening my heart to unconditional compassion and safe boundaries.",
    throat: "I speak my authentic truth without fear. My voice is a sacred vibrational force.",
    third_eye: "My mind is perfectly clear. I trust the deep intuitive sight within.",
    crown: "I am connected to the infinite cosmic lineage. I walk my highest destiny path."
  };

  const practicalMantra = mantras[chakraId] || "I am aligned with the sacred patterns of the universe.";

  return {
    title,
    resonance,
    psycheAlignment,
    practicalMantra
  };
}
