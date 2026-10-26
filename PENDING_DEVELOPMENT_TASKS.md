# Pending Development Tasks & Roadmap: AstroPsyche Tattoo Suggester (AstrInk)

**Project:** AstroPsyche Tattoo Suggester / AstrInk  
**Version:** 1.0.0-Beta to Production Roadmap  
**Author:** Senior Software Architect, Full-Stack Engineer, and Android Lead  

---

## 1. Critical Pending Work (Pre-Production Blockers)

1. **Native Mobile Shell Implementation (Android & iOS):**
   * **Problem:** There is currently **zero native Android code** in the repository. The project is an Express + Vite + React SPA.
   * **Required Action:** Initialize `@capacitor/core`, `@capacitor/cli`, and `@capacitor/android`. Run `npx cap add android` to generate the `/android` directory containing Gradle build files, `AndroidManifest.xml`, and `MainActivity.java/kt`.
   * **Target:** Production signed `.aab` (Android App Bundle) and `.apk` ready for Google Play Store upload.

2. **Production Relational Database Migration:**
   * **Problem:** Consultation records and user intentions are stored in a single flat file (`data/seekers.json`). This will suffer race conditions, file locks, and corruption under concurrent production traffic.
   * **Required Action:** Migrate from `data/seekers.json` to PostgreSQL (via Cloud SQL or Supabase) with Drizzle ORM or Prisma. Implement proper migrations and indexes on `user_id`, `device_signature`, and `created_at`.

3. **Live Payment Gateway Webhook Integration:**
   * **Problem:** The ₹299 / ₹499 VIP report upgrade is currently simulated in client state (`setShowPremiumSimulatorModal`). No real money changes hands, and unlock state is lost on browser refresh.
   * **Required Action:** Integrate Razorpay SDK (for India/UPI/NetBanking) and Stripe (for international cards). Create backend verification endpoints (`POST /api/verify-payment`) with cryptographically validated HMAC-SHA256 signatures before unlocking premium features in the database.

4. **Real User Authentication & Account Persistence:**
   * **Problem:** Identification relies on an anonymous `deviceSignature` stored in `localStorage`. If a user clears cache or changes devices, all consultations and purchased reports vanish.
   * **Required Action:** Implement OAuth 2.0 (Google Sign-In and Apple ID) via Firebase Auth or Supabase Auth. Link consultations and paid entitlements directly to the authenticated `uid`.

---

## 2. Backend Pending Work

* [ ] **Streaming Gemini AI Responses:** Implement server-sent events (SSE) or WebSockets on `/api/suggest-tattoo` so seekers see their talisman geometry and reading materialize stroke-by-stroke rather than waiting 8–12 seconds for the full JSON response.
* [ ] **Swiss Ephemeris Calculation Engine:** Replace deterministic approximations in `src/premiumData.ts` with a real astronomical library (e.g., `swisseph` npm package or external microservice) to calculate exact ascendants, planetary longitude degrees, and retrograde states down to seconds of arc.
* [ ] **Rate Limiting & Abuse Prevention:** Add `express-rate-limit` on `/api/suggest-tattoo` and `/api/analyze-sigil` (e.g., maximum 5 consultations per hour per IP) to protect Gemini API key quota and prevent bot denial-of-wallet attacks.
* [ ] **Automated Vector Format Exporter:** Expand backend endpoints to convert AI-generated SVG talismans into production tattoo formats: high-resolution transparent PNG (300 DPI), Adobe Illustrator (.ai), and encapsulated PostScript (.eps) for direct stencil thermal printing.
* [ ] **Automated Email & WhatsApp Delivery:** Integrate Resend/SendGrid and Twilio/WhatsApp Business API to email the full PDF Tattooist Guide and auspicious Muhurta calendar invitations directly to the seeker.

---

## 3. Frontend Pending Work

* [ ] **Custom Skin Photo Upload & Stencil Warping:** Enhance `TattooMockupCanvas.tsx` so users can take or upload a photo of their own body part, with Three.js or HTML5 Canvas mesh deformation to wrap the SVG realistically over muscle curvature.
* [ ] **Full Static UI Internationalization (i18n):** Integrate `i18next` with complete translation files for Hindi (हिन्दी), Spanish (Español), Sanskrit (संस्कृतम्), and French (Français). Currently, only the AI response text is translated; the UI buttons and modal chrome remain English.
* [ ] **Dark / Light Studio Mode:** Add a high-contrast inverted "Tattoo Studio Stencil Mode" (black ink on pure white background) with zero UI distractions so tattoo artists can trace directly from tablet screens on the lightbox.
* [ ] **Offline Stencil Cache:** Implement a Service Worker via `vite-plugin-pwa` so seekers can pull up their generated designs, mantras, and Muhurta times in tattoo shops that lack cellular reception.

---

## 4. Android & Mobile Development Specifics

* [ ] **Capacitor Android Setup:**
  ```bash
  npm install @capacitor/core @capacitor/cli @capacitor/android
  npx cap init "AstroPsyche" "com.astropsyche.astrink" --web-dir dist
  npm run build
  npx cap add android
  npx cap copy
  ```
* [ ] **Android Studio Configuration:**
  * Configure `android/app/build.gradle`:
    * `minSdkVersion: 24` (Android 7.0 Nougat)
    * `targetSdkVersion: 34` (Android 14)
    * `compileSdkVersion: 34`
  * Add camera permissions to `AndroidManifest.xml` (`android.permission.CAMERA`) for in-app body photo capture.
  * Configure adaptive icons (`ic_launcher`) with the sacred gold AstrInk sigil mark.
  * Generate upload keystore (`keytool -genkey -v -keystore release.jks -alias astropsyche -keyalg RSA -keysize 2048 -validity 10000`).
* [ ] **In-App Billing (Google Play Billing Library):** Implement `@capacitor-community/in-app-purchases` to handle ₹299 / ₹499 digital report purchases through Google Play rather than external web links, complying with Google Play Developer Policy.

---

## 5. Database & Security Pending Work

* [ ] **Schema Definition & Indexing:**
  ```sql
  CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_signature VARCHAR(128) NOT NULL,
    first_name VARCHAR(100),
    birth_date DATE NOT NULL,
    birth_time VARCHAR(20),
    birth_place VARCHAR(150),
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    intention VARCHAR(100),
    emotional_need TEXT,
    preferred_language VARCHAR(30) DEFAULT 'English',
    astrology_data JSONB NOT NULL,
    chakra_data JSONB NOT NULL,
    tattoo_concept JSONB NOT NULL,
    is_premium_unlocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  CREATE INDEX idx_consultations_device ON consultations(device_signature);
  CREATE INDEX idx_consultations_user ON consultations(user_id);
  ```
* [ ] **Secret Hardening:** Remove fallback `process.env.MASTER_LEDGER_PASSCODE || "AstroPsyche2026"` from `server.ts`. Replace with authenticated session middleware or role-based access tokens stored in environment variables.

---

## 6. Testing & Quality Assurance Plan

* [ ] **Unit Tests (Vitest):** Test Vedic astrological calculation formulas (`getNakshatraForBirth`, `getRulingPlanetForLagna`, `getLifePathNumber`) against certified ephemeris control tables.
* [ ] **Integration Tests (Supertest):** Test Express endpoints (`/api/suggest-tattoo`, `/api/save-seeker`, `/api/get-seekers`, `/api/delete-seeker/:id`) for input sanitization, error responses, and authorization checks.
* [ ] **SVG Validation Test Suite:** Verify that all SVGs emitted by Gemini conform to valid XML syntax without unclosed paths or NaN coordinates.
* [ ] **Cross-Device UI Testing:** Validate responsive layouts on iPhone SE (375px), Pixel 7 (412px), iPad Air (820px), and 4K desktop screens.
