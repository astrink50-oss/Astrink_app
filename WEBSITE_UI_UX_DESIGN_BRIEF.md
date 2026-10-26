# Website UI/UX Design Brief & Design System: AstrInk

**Brand:** AstrInk by AstroPsyche  
**Design Direction:** "Celestial Editorial Luxury & Sacred Minimalist Modernism"  
**Target Atmosphere:** An intimate, reverent digital sanctuary reminiscent of high-end architectural monographs, Vedic alchemy, and quiet luxury.  

---

## 1. Visual Identity & Aesthetic Philosophy

AstrInk rejects generic neon-purple "psychic app" tropes and cheap psychedelic cliches. Instead, it pairs the austere restraint of Japanese Zen aesthetics with the warm gold leaf geometry of ancient Vedic manuscripts and modern editorial typography (Kinsfolk / Vogue / Architectural Digest).

* **Core Principles:**
  1. **Austerity & Breathing Room:** Generous negative space (minimum 64px padding between sections) to evoke meditative stillness.
  2. **Subtle Tactility:** Fine-line golden borders (1px with 10%–20% opacity), soft radial dark ambient glows, and velvet black surfaces.
  3. **Zero Visual Noise:** Eliminate aggressive popups, cartoonish icons, or garish flashing elements.

---

## 2. Color Palette & Token System

| Token Name | Hex Code | Tailwind Equivalent | Role & Application |
|---|---|---|---|
| **Abyssal Black** | `#080808` | `bg-[#080808]` | Primary deep background; creates infinite celestial depth. |
| **Obsidian Surface** | `#121212` | `bg-[#121212]` | Elevated card containers, modals, and input fields. |
| **Border Glass** | `rgba(255, 255, 255, 0.08)` | `border-white/10` | Subtle hairline container dividers. |
| **Celestial Gold (Primary)** | `#C5A059` | `text-[#C5A059]` | Primary brand accent, active tabs, CTA buttons, and glowing glyphs. |
| **Warm Gold Leaf (Hover)** | `#DFBA73` | `hover:bg-[#DFBA73]` | Hover states, energized talisman paths, and highlights. |
| **Deep Ochre (Shadow)** | `#A37F43` | `text-[#A37F43]` | Secondary details, astrological house lines, and subdued vectors. |
| **Pure White** | `#FFFFFF` | `text-white` | Primary editorial headings and sharp high-contrast text. |
| **Starlight Gray** | `#9CA3AF` | `text-gray-400` | Subtext, descriptive paragraphs, and metadata. |
| **Muted Nebula** | `#4B5563` | `text-gray-600` | Placeholder text, inactive step numbers, and technical labels. |

---

## 3. Typography System

* **Primary Display Serif (Headlines & Sacred Mantras):**
  * *Font Families:* `Cinzel`, `Playfair Display`, or `Cormorant Garamond` (fallback: `Georgia, serif`).
  * *Characteristics:* High-contrast serifs, open letter-spacing (`tracking-widest` or `tracking-[0.2em]`), capitalized titles with classical Greco-Roman / Vedic elegance.
  * *Sizes:*
    * Hero Headline: `text-4xl md:text-6xl font-serif font-light tracking-wide`
    * Section Title: `text-2xl md:text-3xl font-serif tracking-wider uppercase`
    * Card Eyebrow: `text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A059]`

* **Body & UI Sans-Serif (Legibility & Forms):**
  * *Font Families:* `Inter`, `Plus Jakarta Sans`, or `Outfit` (fallback: `system-ui, sans-serif`).
  * *Characteristics:* Highly readable, clean neutral geometry, balanced x-height.
  * *Sizes:*
    * Primary Body: `text-sm md:text-base leading-relaxed text-gray-300 font-normal`
    * Small Caption / Form Labels: `text-xs text-gray-400 font-medium`
    * Button Text: `text-xs uppercase tracking-[0.15em] font-bold`

* **Astronomical & Coordinate Monospace (Natal Degrees & Muhurta):**
  * *Font Families:* `JetBrains Mono`, `Space Mono`, or `Fira Code`.
  * *Role:* Used strictly for latitude/longitude coordinates, exact birth degrees (`14° 24' Hasta`), and planetary time slots.

---

## 4. Key Interactive Components & Micro-Interactions

1. **The Hero Talisman Astrolabe:**
   * A continuously rotating, multi-ring SVG vector wheel with concentric sacred geometry and constellation nodes. On mouse movement, rings parallax at varying speeds with subtle golden cursor particle trails.

2. **Vector Talisman Complexity Toggle:**
   * An elegant 3-button segmented control (`Simple` | `Moderate` | `Advanced`).
   * When toggled, the SVG paths morph smoothly using SVG line-drawing animations (`stroke-dasharray` and `stroke-dashoffset` interpolation via Motion/Framer).

3. **Interactive Body Placement Studio:**
   * High-contrast monochrome human anatomy photos (Back, Chest, Arm).
   * Freeform drag-and-drop handles allowing users to rescale, rotate, and reposition the SVG talisman directly on skin.
   * Real-time pain meter gauge (1–10) that updates dynamically based on the selected body coordinate.

4. **Web Audio Frequency Bar:**
   * Persistent ambient audio player at the top or bottom of the screen.
   * Visualized as a minimalistic oscillating sine wave or dancing golden frequency bars when Solfeggio tones (528 Hz / 432 Hz) are active.

5. **Auspicious Muhurta Countdown Card:**
   * Digital countdown clock indicating hours, minutes, and seconds until the next auspicious planetary inking window opens, with a one-click "Add to Calendar" button.

---

## 5. Responsive Viewport Breakpoints & Performance

* **Mobile First (375px – 430px):**
  * Stacked single-column layout with fixed bottom action sheet for the consultation quiz.
  * Touch-optimized gesture targets (minimum 48px tap targets).
  * Smooth touch dragging for the body mockup canvas.

* **Tablet & Desktop (768px – 1440px+):**
  * Dual-pane split view during the consultation: left column houses birth inputs and astrological charts; right column displays real-time morphing talisman geometry and 3D body preview.

* **Performance & Accessibility Benchmarks:**
  * Core Web Vitals: LCP < 1.2s, FID < 50ms, CLS = 0.
  * Accessibility: WCAG 2.1 AA compliant contrast ratios across all gold text elements on dark obsidian backgrounds.
  * Zero heavy 3D engine overhead on initial load; lightweight pure vector SVG rendering ensures 60 FPS performance on all mobile devices.
