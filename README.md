# AstrInk (Astrink_app)
### Cosmic & Vedic Spiritual Tattoo Advisor, Energy Healing Talismans & Marma Chakra Balancing

AstrInk is a full-stack, AI-enhanced spiritual tattoo consultation application. It synthesizes Vedic astrology (Kundli, Nakshatras, Lagna), Marma energy healing points, Ayurvedic doshic balance, and psychological archetype mapping to design meaningful, personalized body talismans and sacred geometry sigils.

---

## 🌟 Key Features

- **4-Phase Personalized Intake**:
  - Spiritual Intent & Purpose (Protection, Healing, Career, Love, Spiritual Awakening)
  - Emotional State & Archetype Mapping
  - Precise Vedic Birth Details (Date, Time, Place of Birth with City Lookup)
  - Aesthetic Preferences & Sizing (Sacred Geometry, Fine Line, Dotwork, Vedic Yantra)

- **Comprehensive Astrological & Energy Synthesis**:
  - Sidereal Vedic Ascendant & Moon Sign Calculations
  - Doshic Profile (Vata, Pitta, Kapha)
  - Marma Chakra Energy Analysis & Placement Recommendations
  - Solfeggio Frequency Sound Resonance Generator (528 Hz, 639 Hz, 741 Hz, 852 Hz)

- **Interactive Body Placement & AR Mockup**:
  - Visual tattoo placement mockup on custom skin canvases (arms, chest, back, neck, ankles).
  - Scalable vector Yantras and sacred geometry talismans.

- **Dual-Engine Architecture (Zero-Failure Guarantee)**:
  - **Online**: Powered by Google Gemini AI via Express server proxy for deep, personalized interpretations.
  - **Offline Fallback Engine**: Mathematical Vedic rule-based calculation engine that guarantees instant, high-fidelity readings even without an API key or internet connection.

- **Confidential Seeker Ledger**:
  - Encrypted, device-signed local ledger for past consultations.

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+) or [Bun](https://bun.sh/)
- Git

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/astrink50-oss/Astrink_app.git
cd Astrink_app

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy the example environment file and add your Gemini API key (optional for AI mode; fallback engine works offline without a key):
```bash
cp .env.example .env
```
Inside `.env`:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=3000
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Building for Production
```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **Backend**: Node.js, Express, Vite Server Middleware
- **AI / LLM**: Google Gemini SDK (`@google/genai`)
- **PDF Generation**: PDFKit (for copyright registration and documentation)

---

## 📄 License & Attribution
Proprietary & Confidential © 2026 AstrInk Team. All Rights Reserved.
