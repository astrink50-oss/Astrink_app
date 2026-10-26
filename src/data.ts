/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ConsciousArtist {
  id: string;
  name: string;
  location: string;
  specialties: string[];
  bio: string;
  instagram: string;
  availability: "Open" | "Waitlist" | "Booking Soon";
  ritualStyle: string;
}

export interface ChakraReference {
  name: string;
  sanskrit: string;
  color: string;
  element: string;
  energyCenter: string;
  remedyFocus: string;
  placementNotes: string;
}

export interface SpiritualSymbol {
  name: string;
  origin: string;
  meaning: string;
  svgPath: string;
}

export const CONSCIOUS_ARTISTS: ConsciousArtist[] = [
  {
    id: "1",
    name: "Aria Thorne",
    location: "London, UK (Sacred Ink Atelier)",
    specialties: ["Fine-line Minimalist", "Unalome / Pathways", "Acupuncture Placement"],
    bio: "Aria is a licensed acupuncturist and ritual tattoo artist who merges meridians with custom sacred ink. She designs in a meditative state, aligning each line to the client's energy meridians.",
    instagram: "@aria.thorne.ritual",
    availability: "Open",
    ritualStyle: "Cacao ceremony, breathwork, and meridian point pulse reading before inking."
  },
  {
    id: "2",
    name: "Devan Shastri",
    location: "Varanasi, India & Los Angeles, CA",
    specialties: ["Vedic Yantras", "Sacred Geometry", "Sanskrit Mantras"],
    bio: "Born into a lineage of Vedic scholars, Devan creates authentic mathematical Yantra talismans and sacred geometry based on custom natal chart Dasha calculations.",
    instagram: "@devan.shastri.yantra",
    availability: "Waitlist",
    ritualStyle: "Planetary mantra chanting, sound bath alignment, and custom copper-infused energy ritual."
  },
  {
    id: "3",
    name: "Elena Rostova",
    location: "Ubud, Bali (Temple of Light)",
    specialties: ["Reiki Healing Talismans", "Botanical Alchemy", "Dotwork / Stippling"],
    bio: "Elena is a Reiki Master. Each tattoo is initiated with an aura cleansing, and she infuses the tattoo space with sound frequencies matching the client's target chakra.",
    instagram: "@elena.reiki.art",
    availability: "Booking Soon",
    ritualStyle: "Aura clearing, Reiki energy infusion, and custom crystal bowl sound alignment during sessions."
  },
  {
    id: "4",
    name: "Marcus Blackwood",
    location: "Brooklyn, New York (Vessel of Shadows)",
    specialties: ["Alchemical Symbols", "Zodiac Geometry", "Dark Fine Line"],
    bio: "Marcus specializes in shadow-work integration, helping clients mark major trauma milestones and grief-healing cycles with powerful alchemical Sigils.",
    instagram: "@marcus.sigil.art",
    availability: "Open",
    ritualStyle: "Intention-burning ritual, shadow integration journaling, and silent meditative session."
  }
];

export const CHAKRAS_REFERENCE: ChakraReference[] = [
  {
    name: "Root Chakra",
    sanskrit: "Muladhara",
    color: "rgba(239, 68, 68, 0.4)", // Red
    element: "Earth",
    energyCenter: "Base of spine, feet, ankles",
    remedyFocus: "Material security, financial blocks, physical grounding, stability.",
    placementNotes: "Feet, ankles, or lower legs to represent strong foundations and physical connection to Mother Earth."
  },
  {
    name: "Sacral Chakra",
    sanskrit: "Svadhisthana",
    color: "rgba(249, 115, 22, 0.4)", // Orange
    element: "Water",
    energyCenter: "Lower abdomen, hips, sacrum",
    remedyFocus: "Creative expression, emotional flow, sensual blockages, joy.",
    placementNotes: "Lower abs, pelvis, or outer hips. Water-themed flows and organic curvature resonate strongly here."
  },
  {
    name: "Solar Plexus",
    sanskrit: "Manipura",
    color: "rgba(234, 179, 8, 0.4)", // Yellow
    element: "Fire",
    energyCenter: "Core, upper stomach, ribs",
    remedyFocus: "Personal power, vitality, career drive, confidence, inner fire.",
    placementNotes: "Core (abs), ribs, biceps, or thighs to anchor physical strength, drive, and radiating solar power."
  },
  {
    name: "Heart Chakra",
    sanskrit: "Anahata",
    color: "rgba(16, 185, 129, 0.4)", // Green
    element: "Air",
    energyCenter: "Chest, shoulders, hands, wrists",
    remedyFocus: "Unconditional love, healing trauma, grief, boundaries, self-love.",
    placementNotes: "Chest, inner wrists (near pulse points), or shoulders. Symbolizes vulnerability, empathy, and cosmic open-heartedness."
  },
  {
    name: "Throat Chakra",
    sanskrit: "Vishuddha",
    color: "rgba(59, 130, 246, 0.4)", // Blue
    element: "Ether (Space)",
    energyCenter: "Throat, neck, forearms",
    remedyFocus: "Authentic communication, speaking truth, creative release, standing up.",
    placementNotes: "Throat, collarbone, or forearms. Represents voice and the physical execution of speaking one's truth."
  },
  {
    name: "Third Eye",
    sanskrit: "Ajna",
    color: "rgba(139, 92, 246, 0.4)", // Indigo
    element: "Light",
    energyCenter: "Forehead, behind ear, back of neck",
    remedyFocus: "Intuition, spiritual vision, mental clarity, dreams, projection.",
    placementNotes: "Behind the ear, temples, or back of the neck. Acts as an energetic receiver to stimulate pineal clarity."
  },
  {
    name: "Crown Chakra",
    sanskrit: "Sahasrara",
    color: "rgba(236, 72, 153, 0.4)", // Violet/Pink
    element: "Cosmic Energy",
    energyCenter: "Top of head, upper spine",
    remedyFocus: "Universal connection, spiritual transcendence, higher self.",
    placementNotes: "Upper spine, top of the neck, or base of skull, acting as an anchor for divine inspiration."
  }
];

export const REFERENCE_SYMBOLS: SpiritualSymbol[] = [
  {
    name: "Cho Ku Rei (Power)",
    origin: "Japanese Usui Reiki",
    meaning: "The Power Symbol. Acts as an energy amplifier, focusing universal healing light on the spot of placement for physical protection and revitalization.",
    svgPath: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5">
      <line x1="15" y1="20" x2="85" y2="20" />
      <line x1="50" y1="20" x2="50" y2="85" />
      <path d="M 50 85 C 30 85, 30 55, 50 55 C 65 55, 65 35, 50 35 C 40 35, 40 45, 50 45 C 55 45, 55 51, 50 51 C 46 51, 46 48, 50 48" />
    </svg>`
  },
  {
    name: "Unalome (Path of Life)",
    origin: "Buddhist / Hindu Spiritualism",
    meaning: "Represents the path to enlightenment. The spiral is the beginning of life and confusion, the loops show twists of fate, and the straight line is peace/harmony.",
    svgPath: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M 50 75 Q 50 85, 45 80 Q 40 75, 47 70 Q 55 65, 50 58 Q 45 51, 51 46 Q 57 41, 50 30 L 50 15" />
      <circle cx="50" cy="11" r="1.5" fill="currentColor" />
      <circle cx="50" cy="6" r="1" fill="currentColor" />
    </svg>`
  },
  {
    name: "Sacred Sri Yantra Outline",
    origin: "Vedic (Hindu Tantra)",
    meaning: "An interlocking of nine triangles representing the union of masculine and feminine divine forces, activating abundance and cosmic order.",
    svgPath: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="50" cy="50" r="42" />
      <polygon points="50,15 20,70 80,70" />
      <polygon points="50,85 20,30 80,30" />
      <polygon points="50,28 32,60 68,60" />
      <polygon points="50,72 32,40 68,40" />
      <circle cx="50" cy="50" r="10" />
    </svg>`
  },
  {
    name: "Semicolon Lotus",
    origin: "Modern Mental Health & Buddhism",
    meaning: "A synergy of survival (semicolon) and spiritual rebirth from dark mud (lotus). An ultimate anchor for grief integration and resilient renewal.",
    svgPath: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5">
      <!-- Lotus Outer Petals -->
      <path d="M 50 65 C 30 50, 25 35, 50 30 C 75 35, 70 50, 50 65 Z" />
      <path d="M 50 65 C 20 60, 15 45, 35 38 C 45 42, 48 55, 50 65 Z" />
      <path d="M 50 65 C 80 60, 85 45, 65 38 C 55 42, 52 55, 50 65 Z" />
      <!-- Semicolon Center -->
      <circle cx="50" cy="42" r="3.5" fill="currentColor" />
      <path d="M 50 51 C 50 55, 47 58, 44 59" stroke-width="2" />
    </svg>`
  }
];

export const PLACEMENT_PRESETS: { [key: string]: { label: string; x: number; y: number; description: string } } = {
  forearms: { label: "Forearms / Arm", x: 26, y: 55, description: "Throat & Solar Plexus alignment. Connects to authentic action, work, and outward expression." },
  throat: { label: "Throat / Collarbone", x: 50, y: 22, description: "Throat Chakra alignment. Directly activates vocal power, truth, and authentic boundary expression." },
  chest: { label: "Chest / Heart Center", x: 50, y: 34, description: "Heart Chakra alignment. Opens the portal of vulnerability, unconditional love, and grief healing." },
  wrists: { label: "Inner Wrists", x: 14, y: 64, description: "Heart & Lung Meridians. Acts as a constant visual mindfulness anchor for emotional self-love." },
  spine: { label: "Spine / Back of Neck", x: 50, y: 44, description: "Crown, Third Eye & Kundalini spine channel. Channels cosmic guidance, structure, and ancestral alignment." },
  ankle: { label: "Ankle / Lower Legs", x: 42, y: 92, description: "Root Chakra. Connects deeply to Earth energy, physical grounding, and financial stability." },
  behind_ear: { label: "Behind the Ear", x: 55, y: 14, description: "Third Eye activation. Amplifies intuition, deep dream state resonance, and mental clarity." }
};
