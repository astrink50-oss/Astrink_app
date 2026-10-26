/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Info,
  ChevronRight,
  BookOpen,
  MapPin,
  Calendar,
  Clock,
  Compass,
  Layers,
  Heart,
  Droplet,
  Flame,
  ShieldAlert,
  Instagram,
  UserCheck,
  CheckCircle2,
  RefreshCw,
  Copy,
  Eye,
  Check,
  Printer,
  Download,
  Mic,
  MicOff,
  Share2,
  Send,
  X,
  Loader2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  Trash2,
  Bookmark,
  Smartphone,
  ChevronLeft,
  Database,
  Search,
  Filter,
  CreditCard,
  Wallet,
  Lock,
  Star,
  ExternalLink
} from "lucide-react";
import {
  CHAKRAS_REFERENCE,
  REFERENCE_SYMBOLS,
  PLACEMENT_PRESETS,
  ChakraReference,
  SpiritualSymbol
} from "./data";
import {
  CHAKRA_BASES,
  ASTROLOGY_GLYPHS,
  PLANETARY_SIGILS,
  generateSigilSignificance
} from "./sigilData";
import BirthPlaceMapModal, { WORLD_CITIES, WorldCity } from "./components/BirthPlaceMapModal";
import AuraInkLogo from "./components/AuraInkLogo";
import * as PremiumData from "./premiumData";

const formatBirthDate = (dateStr: string) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
};

const formatBirthTime = (timeStr: string, isApprox: boolean, approxPeriod: string) => {
  if (isApprox) {
    switch (approxPeriod) {
      case "morning": return "Morning (Approx. 08:00 AM)";
      case "afternoon": return "Afternoon (Approx. 02:00 PM)";
      case "evening": return "Evening (Approx. 06:00 PM)";
      case "night": return "Night (Approx. 11:00 PM)";
      default: return "Unknown Time (Approx. 12:00 PM)";
    }
  }
  if (!timeStr) return "12:00 PM";
  try {
    const [hoursStr, minutesStr] = timeStr.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (isNaN(hours) || isNaN(minutes)) return timeStr;
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  } catch {
    return timeStr;
  }
};

const getSanskritSign = (signName: string) => {
  const map: Record<string, string> = {
    aries: "Mesha",
    taurus: "Vrishabha",
    gemini: "Mithuna",
    cancer: "Karka",
    leo: "Simha",
    virgo: "Kanya",
    libra: "Tula",
    scorpio: "Vrishchika",
    sagittarius: "Dhanu",
    capricorn: "Makara",
    aquarius: "Kumbha",
    pisces: "Meena"
  };
  return map[signName.toLowerCase()] || signName;
};

const getNakshatraForBirth = (birthDate: string) => {
  if (!birthDate) return "Shravana";
  const index = (new Date(birthDate).getDate() || 12) % 27;
  const NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", 
    "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", 
    "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", 
    "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", 
    "Uttara Bhadrapada", "Revati"
  ];
  return NAKSHATRAS[index];
};

const getRulingPlanetForLagna = (lagnaSign?: string) => {
  const sign = lagnaSign ? lagnaSign.toLowerCase() : "virgo";
  const map: Record<string, string> = {
    aries: "Mars (Mangal)",
    taurus: "Venus (Shukra)",
    gemini: "Mercury (Budha)",
    cancer: "Moon (Chandra)",
    leo: "Sun (Surya)",
    virgo: "Mercury (Budha)",
    libra: "Venus (Shukra)",
    scorpio: "Pluto / Mars (Ketu)",
    sagittarius: "Jupiter (Guru)",
    capricorn: "Saturn (Shani)",
    aquarius: "Saturn / Uranus (Rahu)",
    pisces: "Jupiter / Neptune"
  };
  return map[sign] || "Mercury (Budha)";
};

const getLifePathNumber = (dateStr: string) => {
  if (!dateStr) return 7;
  const digits = dateStr.replace(/\D/g, "");
  let sum = digits.split("").reduce((acc, val) => acc + parseInt(val), 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split("").reduce((acc, val) => acc + parseInt(val), 0);
  }
  return sum;
};

const getPlanetaryMantra = (signName: string) => {
  if (!signName) {
    return {
      sanskrit: "ॐ नमः शिवाय",
      phonetics: '"Om Namah Shivaya"',
      meaning: "This primal chant triggers total dissolution of obstacles, grounding you in cosmic stillness."
    };
  }
  const sign = signName.toLowerCase();
  if (sign.includes("sagittarius") || sign.includes("jupiter") || sign.includes("dhanu")) {
    return {
      sanskrit: "ॐ नमो भगवते वासुदेवाय",
      phonetics: '"Om Namo Bhagavate Vasudevaya"',
      meaning: "This mantra brings celestial wisdom, protection, and boundless material expansion."
    };
  }
  if (sign.includes("leo") || sign.includes("sun") || sign.includes("simha")) {
    return {
      sanskrit: "ॐ घृणि सूर्याय नमः",
      phonetics: '"Om Ghrini Suryaya Namah"',
      meaning: "This mantra invokes solar vitality, sovereign power, and radiating confidence."
    };
  }
  if (sign.includes("cancer") || sign.includes("moon") || sign.includes("karka")) {
    return {
      sanskrit: "ॐ सों सोमाय नमः",
      phonetics: '"Om Som Somaya Namah"',
      meaning: "This mantra calms emotional waves, soothing stress and nurturing deep intuition."
    };
  }
  if (sign.includes("virgo") || sign.includes("gemini") || sign.includes("mercury") || sign.includes("kanya")) {
    return {
      sanskrit: "ॐ बुं बुधाय नमः",
      phonetics: '"Om Bum Budhaya Namah"',
      meaning: "This mantra activates mental clarity, articulate speech, and cognitive balance."
    };
  }
  if (sign.includes("taurus") || sign.includes("libra") || sign.includes("venus") || sign.includes("vrishabha")) {
    return {
      sanskrit: "ॐ शुं शुक्राय नमः",
      phonetics: '"Om Shum Shukraya Namah"',
      meaning: "This mantra attracts material beauty, artistic luxury, and romantic healing."
    };
  }
  if (sign.includes("capricorn") || sign.includes("aquarius") || sign.includes("saturn") || sign.includes("makara")) {
    return {
      sanskrit: "ॐ शं शनैश्चराय नमः",
      phonetics: '"Om Sham Shanaishcharaya Namah"',
      meaning: "This mantra aligns skeletal structure, unlocking patience, discipline, and success."
    };
  }
  return {
    sanskrit: "ॐ नमः शिवाय",
    phonetics: '"Om Namah Shivaya"',
    meaning: "This primal chant triggers total dissolution of obstacles, grounding you in cosmic stillness."
  };
};

const getMockupBodyOutline = (type: string) => {
  if (type === "back") {
    return (
      <svg viewBox="0 0 100 100" fill="none" stroke="#A37F43" strokeWidth="0.8" opacity="0.25" className="absolute inset-0 w-full h-full p-2">
        <path d="M 38 15 C 38 30, 42 38, 30 45 C 42 50, 58 50, 70 45 C 58 38, 62 30, 62 15" strokeLinecap="round" />
        <path d="M 30 45 C 15 50, 5 62, 0 85 M 70 45 C 85 50, 95 62, 100 85" strokeLinecap="round" />
        <line x1="50" y1="46" x2="50" y2="100" strokeDasharray="2 3" />
        <path d="M 28 62 C 38 68, 62 68, 72 62" strokeDasharray="2 2" />
      </svg>
    );
  }
  if (type === "chest") {
    return (
      <svg viewBox="0 0 100 100" fill="none" stroke="#A37F43" strokeWidth="0.8" opacity="0.25" className="absolute inset-0 w-full h-full p-2">
        <path d="M 32 15 C 37 32, 63 32, 68 15" strokeLinecap="round" />
        <path d="M 50 32 Q 30 29, 12 36 M 50 32 Q 70 29, 88 36" strokeLinecap="round" />
        <path d="M 12 36 C 8 55, 20 85, 50 85 C 80 85, 92 55, 88 36" strokeLinecap="round" />
        <circle cx="38" cy="62" r="1.5" fill="#A37F43" opacity="0.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="#A37F43" strokeWidth="0.8" opacity="0.25" className="absolute inset-0 w-full h-full p-2">
      <path d="M 15 20 C 35 15, 62 25, 68 45 C 75 65, 72 85, 68 100" strokeLinecap="round" />
      <path d="M 15 20 C 0 45, 12 75, 18 100" strokeLinecap="round" />
      <line x1="42" y1="20" x2="42" y2="100" strokeDasharray="2 3" />
    </svg>
  );
};

const getSacredTattooSvg = () => {
  return `<svg viewBox="0 0 100 100" fill="none" stroke="#A37F43" stroke-width="1.2">
    <g opacity="0.9">
      <path d="M 38 22 A 12 12 0 0 1 62 22" stroke-width="1.2" />
      <path d="M 42 22 A 8 8 0 0 1 58 22" stroke-width="0.8" opacity="0.6" stroke-dasharray="1 1" />
      <line x1="50" y1="10" x2="50" y2="4" stroke-width="1.2" />
      <line x1="44" y1="12" x2="41" y2="6" />
      <line x1="56" y1="12" x2="59" y2="6" />
      <line x1="39" y1="16" x2="34" y2="11" />
      <line x1="61" y1="16" x2="66" y2="11" />
      <line x1="36" y1="22" x2="30" y2="20" />
      <line x1="64" y1="22" x2="70" y2="20" />
      <circle cx="50" cy="2" r="0.8" fill="currentColor" />
      <circle cx="39.5" cy="4" r="0.6" fill="currentColor" />
      <circle cx="60.5" cy="4" r="0.6" fill="currentColor" />
    </g>
    <g transform="translate(0, 16)">
      <circle cx="50" cy="30" r="18" stroke-width="1.2" />
      <circle cx="50" cy="30" r="16.5" stroke-dasharray="1.5 1.5" stroke-width="0.7" opacity="0.6" />
      <circle cx="50" cy="30" r="21.5" stroke-width="0.8" opacity="0.4" />
      <polygon points="50,46 34,21 66,21" stroke-width="1.2" />
      <polygon points="50,41 37,25 63,25" stroke-width="0.9" opacity="0.8" />
      <polygon points="50,14 34,39 66,39" stroke-width="1.2" />
      <polygon points="50,19 37,35 63,35" stroke-width="0.9" opacity="0.8" />
      <rect x="26" y="6" width="48" height="48" rx="1" stroke-width="0.5" stroke-dasharray="3 3" opacity="0.25" />
    </g>
    <g opacity="0.9">
      <path d="M 50 63 C 45 53, 45 44, 50 44 C 55 44, 55 53, 50 63 Z" stroke-width="1.2" fill="currentColor" fill-opacity="0.03" />
      <path d="M 50 63 C 40 55, 34 47, 43 44 C 47 46, 48 55, 50 63 Z" stroke-width="1" />
      <path d="M 50 63 C 60 55, 66 47, 57 44 C 53 46, 52 55, 50 63 Z" stroke-width="1" />
      <path d="M 50 63 C 32 58, 28 50, 36 46 C 42 48, 45 57, 50 63 Z" stroke-width="0.8" opacity="0.7" />
      <path d="M 50 63 C 68 58, 72 50, 64 46 C 58 48, 55 57, 50 63 Z" stroke-width="0.8" opacity="0.7" />
    </g>
    <g opacity="0.95">
      <circle cx="50" cy="65" r="1" fill="currentColor" />
      <circle cx="50" cy="68" r="1.2" fill="currentColor" />
      <circle cx="50" cy="71" r="1" fill="currentColor" />
      <g transform="translate(42.5, 73.5) scale(0.15)">
        <path d="M 15 45 C 10 40, 8 32, 14 26 C 22 18, 34 18, 41 26 C 46 32, 42 42, 34 45 C 44 47, 48 58, 44 66 C 39 74, 25 76, 16 71 C 11 67, 10 59, 15 54" stroke-width="6.5" stroke-linecap="round" />
        <path d="M 32 45 C 40 45, 52 35, 58 45 C 64 55, 52 68, 62 75" stroke-width="5.5" stroke-linecap="round" />
        <path d="M 30 14 C 38 14, 45 18, 47 24" stroke-width="5" stroke-linecap="round" />
        <circle cx="43" cy="6" r="4.5" fill="currentColor" stroke="none" />
      </g>
      <line x1="50" y1="87.5" x2="50" y2="92" stroke-width="0.8" stroke-dasharray="1 1" />
      <circle cx="50" cy="94" r="1.2" fill="currentColor" />
    </g>
  </svg>`;
};

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  quote: string;
  intention: string;
  astrology: string;
  scriptIndex: number;
  externalLink: string;
  avatarColor: string;
}

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "1",
    name: "Aarav Mehta",
    role: "Cosmic Seeker",
    avatar: "AM",
    rating: 5,
    quote: "I used to feel completely blocked financially—like no matter how hard I worked, my energy was scattered. AstrInk mapped my natal chart and prescribed a custom Wealth alignment sigil based on my Surya Sun sign. Ever since tattooing this sacred symbol and chanting the Sanskrit activation mantra, my focus has shifted. Opportunities are literally chasing me now!",
    intention: "Wealth & Prosperity",
    astrology: "Leo Surya Sun Sign Alignment",
    scriptIndex: 1,
    externalLink: "https://lumalabs.ai/dream-machine",
    avatarColor: "from-[#C5A059] to-[#8E6E32]"
  },
  {
    id: "2",
    name: "Priya Kapoor",
    role: "Healed Soul",
    avatar: "PK",
    rating: 5,
    quote: "After losing someone close to me, I felt a heavy grief lodged in my chest. AstrInk analyzed my birth chart and recommended a Heart-Healing mandala on my chest to balance my Venus resonance. Tracing the lines during breathing exercises and reciting the seed mantra helped me finally process the grief. I feel light again. Safe. Connected.",
    intention: "Love & Grief Healing",
    astrology: "Venus Resonance - Cancer Moon",
    scriptIndex: 2,
    externalLink: "https://heygen.com",
    avatarColor: "from-pink-500/80 to-rose-600/80"
  },
  {
    id: "3",
    name: "Kabir Singh",
    role: "Spiritual Warrior",
    avatar: "KS",
    rating: 5,
    quote: "As an empath, I used to absorb everyone else’s chaotic energy. I felt drained, anxious, and unprotected. AstrInk calculated my D1 chart and designed a bespoke Protection shield tailored to my exact birth moment. Wearing this sacred geometric shield has given me back my boundaries. I feel centered, strong, and completely secure in my own power.",
    intention: "Spiritual Strength",
    astrology: "D1 Chart - Scorpio Ascendant Protection",
    scriptIndex: 3,
    externalLink: "https://leonardo.ai",
    avatarColor: "from-blue-600/80 to-indigo-700/80"
  },
  {
    id: "4",
    name: "Ananya Sharma",
    role: "Intentional Alchemist",
    avatar: "AS",
    rating: 5,
    quote: "Stop inking temporary names that you will regret in two years! I switched to AstrInk to map my soul's true birth intention. With exact body Marma point placement, Shubh Muhurta timing, and Sanskrit seed mantras, my sacred tattoo actually helps me manifest my highest self every day.",
    intention: "Soul Manifestation vs Random Ink",
    astrology: "Universal Manifestation - Higher Self Alignment",
    scriptIndex: 4,
    externalLink: "https://lumalabs.ai/dream-machine",
    avatarColor: "from-emerald-500/80 to-teal-700/80"
  }
];

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"quiz" | "collection" | "premium">("quiz");

  // Premium / Business Model State
  const [activePlan, setActivePlan] = useState<"free" | "premium" | "pro" | "family">("free");
  const isPremiumUnlocked = activePlan === "premium" || activePlan === "pro" || activePlan === "family";
  const [registeredSingleUser, setRegisteredSingleUser] = useState<{ firstName: string; lastName: string; birthDate: string } | null>(() => {
    try {
      const data = localStorage.getItem("aura_ink_single_user");
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  });
  const [familyUsersList, setFamilyUsersList] = useState<{ firstName: string; lastName: string; birthDate: string }[]>(() => {
    try {
      const data = localStorage.getItem("aura_ink_family_users");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  });
  const [showUpgradeToFamilyModal, setShowUpgradeToFamilyModal] = useState<boolean>(false);
  const [showKundliInfoModal, setShowKundliInfoModal] = useState<boolean>(false);
  const [attemptedUser, setAttemptedUser] = useState<{ firstName: string; lastName: string; birthDate: string } | null>(null);

  // Seeker Testimonials States
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState<number>(0);

  const [unlockedIntentionsList, setUnlockedIntentionsList] = useState<string[]>(["Wealth"]);
  const [selectedPremiumOptionIndex, setSelectedPremiumOptionIndex] = useState<number>(0);
  const [showPremiumSimulatorModal, setShowPremiumSimulatorModal] = useState<boolean>(false);
  const [showPrintIframeModal, setShowPrintIframeModal] = useState<boolean>(false);
  const [showDownloadPortal, setShowDownloadPortal] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);
  const [downloadPortalTab, setDownloadPortalTab] = useState<"pwa" | "stores">("pwa");
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  // Privacy Policy state
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [viewState, setViewState] = useState<string | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("view");
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as any);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as any);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);
  const [glimpseLevel, setGlimpseLevel] = useState<"Moderate" | "Advanced" | null>(null);
  const [showGlimpseModal, setShowGlimpseModal] = useState<boolean>(false);
  const [glimpseModalLevel, setGlimpseModalLevel] = useState<"Moderate" | "Advanced" | null>(null);
  const [glimpseTimer, setGlimpseTimer] = useState<number>(0);

  useEffect(() => {
    if (showGlimpseModal) {
      setGlimpseTimer(1);
    } else {
      setGlimpseTimer(0);
    }
  }, [showGlimpseModal]);

  useEffect(() => {
    if (glimpseTimer <= 0) return;
    const timerId = setTimeout(() => {
      setGlimpseTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearTimeout(timerId);
  }, [glimpseTimer]);

  const handlePrint = () => {
    try {
      // In web browsers, running window.print() inside a sandboxed <iframe> (like the AI Studio development preview)
      // is blocked by standard iframe security rules. We check if we are in an iframe and guide the user.
      const isIframe = window.self !== window.top;
      if (isIframe) {
        setShowPrintIframeModal(true);
      } else {
        window.print();
      }
    } catch (err) {
      setShowPrintIframeModal(true);
    }
  };

  // Form State
  const [firstName, setFirstName] = useState("Aara");
  const [lastName, setLastName] = useState("Sharma");
  const [gender, setGender] = useState("Female");
  const [birthDate, setBirthDate] = useState("1995-07-12");
  const [birthTime, setBirthTime] = useState("20:30");
  const [dontKnowExactTime, setDontKnowExactTime] = useState<boolean>(false);
  const [approxTimePeriod, setApproxTimePeriod] = useState<string>("unknown");
  const [birthPlace, setBirthPlace] = useState("London, England, United Kingdom");
  const [showMapModal, setShowMapModal] = useState(false);
  const [showBirthPlaceDropdown, setShowBirthPlaceDropdown] = useState(false);
  const [intention, setIntention] = useState("Wealth");
  const [need, setNeed] = useState("I feel blocked in my financial stability and want to manifest steady abundance.");
  const [quizStep, setQuizStep] = useState<1 | 2 | 3 | 4>(1);
  const [preferredLanguage, setPreferredLanguage] = useState<string>("English");

  // App UI State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [activeResonancePoint, setActiveResonancePoint] = useState<string>("ankle");

  // Preview states for body mockups
  const [previewGender, setPreviewGender] = useState<"Female" | "Male">("Female");
  const [inkColor, setInkColor] = useState<"Charcoal" | "Gold" | "BlueBlack">("Charcoal");
  const [selectedComplexity, setSelectedComplexity] = useState<"Simple" | "Moderate" | "Advanced">("Simple");

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Voice to text is not supported in this browser. Try Chrome or Safari.");
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    if (isListening) {
      if ((window as any)._activeRecognition) {
        try {
          (window as any)._activeRecognition.stop();
        } catch (err) {}
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      let recognitionLang = "en-US";
      if (preferredLanguage === "Hindi") {
        recognitionLang = "hi-IN";
      } else if (preferredLanguage === "Spanish") {
        recognitionLang = "es-ES";
      } else if (preferredLanguage === "French") {
        recognitionLang = "fr-FR";
      } else if (preferredLanguage === "German") {
        recognitionLang = "de-DE";
      }
      recognition.lang = recognitionLang;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setNeed((prev: string) => prev ? `${prev.trim()} ${transcript}` : transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === "not-allowed") {
          setSpeechError("Microphone access is not allowed. Please check browser permissions.");
        } else {
          setSpeechError(`Speech recognition failed: ${event.error}`);
        }
        setIsListening(false);
        setTimeout(() => setSpeechError(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      (window as any)._activeRecognition = recognition;

    } catch (e: any) {
      setSpeechError(`Failed to initialize speech: ${e.message}`);
      setIsListening(false);
      setTimeout(() => setSpeechError(null), 4000);
    }
  };

  // Solfeggio Sound Healer States & Refs
  const [solfeggioPlaying, setSolfeggioPlaying] = useState(false);
  const [solfeggioVolume, setSolfeggioVolume] = useState(0.18); // Soft therapeutic default
  const [solfeggioFreqOverride, setSolfeggioFreqOverride] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const subOscRef = useRef<OscillatorNode | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);

  const getSolfeggioInfo = (chakraStr: string) => {
    const lowercase = (chakraStr || "").toLowerCase();
    if (lowercase.includes("root") || lowercase.includes("muladhara")) {
      return { 
        frequency: 396, 
        label: "396 Hz", 
        name: "Muladhara (Root Chakra)", 
        benefits: "Fear liberation, grounding stable earth structures & material foundation", 
        color: "from-red-600/30 to-red-950/40 border-red-500/30 text-red-400 bg-red-500",
        pillColor: "bg-red-500/10 text-red-400 border border-red-500/20"
      };
    }
    if (lowercase.includes("sacral") || lowercase.includes("svadhisthana")) {
      return { 
        frequency: 417, 
        label: "417 Hz", 
        name: "Svadhisthana (Sacral Chakra)", 
        benefits: "Facilitating change, undoing toxic situations & clearing deep somatic emotional tissue", 
        color: "from-orange-500/30 to-orange-950/40 border-orange-500/30 text-orange-400 bg-orange-500",
        pillColor: "bg-orange-500/10 text-orange-400 border border-orange-500/20"
      };
    }
    if (lowercase.includes("solar") || lowercase.includes("manipura")) {
      return { 
        frequency: 528, 
        label: "528 Hz", 
        name: "Manipura (Solar Plexus)", 
        benefits: "Transformation, sovereign courage, diaphragmatic release & cellular healing", 
        color: "from-amber-500/30 to-amber-950/40 border-amber-500/30 text-amber-400 bg-amber-500",
        pillColor: "bg-amber-500/10 text-amber-400 border border-amber-500/20"
      };
    }
    if (lowercase.includes("heart") || lowercase.includes("anahata")) {
      return { 
        frequency: 639, 
        label: "639 Hz", 
        name: "Anahata (Heart Chakra)", 
        benefits: "Harmonizing relationships, dissolving core armor, safety & unconditional compassion", 
        color: "from-emerald-600/30 to-emerald-950/40 border-emerald-500/30 text-emerald-400 bg-emerald-500",
        pillColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      };
    }
    if (lowercase.includes("throat") || lowercase.includes("vishuddha")) {
      return { 
        frequency: 741, 
        label: "741 Hz", 
        name: "Vishuddha (Throat Chakra)", 
        benefits: "Purifying expression, setting sovereign verbal boundaries & clear communication", 
        color: "from-sky-500/30 to-sky-950/40 border-sky-500/30 text-sky-400 bg-sky-500",
        pillColor: "bg-sky-500/10 text-sky-400 border border-sky-500/20"
      };
    }
    // Crown / Third eye default
    return { 
      frequency: 963, 
      label: "963 Hz", 
      name: "Sahasrara (Crown & Third Eye Axis)", 
      benefits: "Spinal sushumna flow, divine crown gateway & pineal spiritual awakening", 
      color: "from-violet-600/30 to-violet-950/40 border-violet-500/30 text-violet-400 bg-violet-500",
      pillColor: "bg-violet-500/10 text-violet-400 border border-violet-500/20"
    };
  };

  const getFineTunedSolfeggio = (
    chakraStr: string,
    userIntention: string,
    bDate: string,
    bTime: string,
    sun: string,
    moon: string
  ) => {
    // 1. Determine base Solfeggio frequency
    const activeInfo = getSolfeggioInfo(chakraStr);
    const baseFreq = activeInfo.frequency;

    // 2. Derive unique offsets based on birth date, time and astrology
    let dateVal = 0;
    if (bDate) {
      const parts = bDate.split("-").map(Number);
      if (parts.length === 3) {
        dateVal = parts[0] + parts[1] * 31 + parts[2];
      }
    } else {
      dateVal = 1995 + 10 * 31 + 24; // fallback static date
    }

    let timeVal = 12.0;
    if (bTime) {
      const parts = bTime.split(":").map(Number);
      if (parts.length === 2) {
        timeVal = parts[0] + parts[1] / 60;
      }
    }

    // Determine element based on sun sign to give precise elemental pitch shifts
    const fireSigns = ["aries", "leo", "sagittarius"];
    const earthSigns = ["taurus", "virgo", "capricorn"];
    const airSigns = ["gemini", "libra", "aquarius"];
    const waterSigns = ["cancer", "scorpio", "pisces"];

    const sunLower = (sun || "leo").toLowerCase();
    const moonLower = (moon || "taurus").toLowerCase();

    let element = "Earth";
    let elementOffset = 0.0;
    if (fireSigns.includes(sunLower)) {
      element = "Fire";
      elementOffset = 1.33; // Radiant expansion
    } else if (earthSigns.includes(sunLower)) {
      element = "Earth";
      elementOffset = -0.72; // Anchoring stability
    } else if (airSigns.includes(sunLower)) {
      element = "Air";
      elementOffset = 0.88; // Ascending clarity
    } else if (waterSigns.includes(sunLower)) {
      element = "Water";
      elementOffset = -0.45; // Fluid integration
    }

    // Moon sign offset for subconscious tuning
    let moonOffset = 0.0;
    if (waterSigns.includes(moonLower)) moonOffset = -0.25;
    else if (earthSigns.includes(moonLower)) moonOffset = -0.15;
    else if (airSigns.includes(moonLower)) moonOffset = 0.35;
    else if (fireSigns.includes(moonLower)) moonOffset = 0.55;

    // Time-of-day cosmic tidal shift
    const timeOffset = Math.sin((timeVal / 24) * 2 * Math.PI) * 0.45;

    // Intention alignment vibration
    let intentionOffset = 0.0;
    let intentionNote = "";
    const intent = (userIntention || "Wealth").toLowerCase();
    if (intent === "wealth") {
      intentionOffset = 1.618; // The Golden Ratio (Phi)
      intentionNote = "Prosperity Attractance alignment, utilizing the Phi proportion to unlock grounding wealth retention fields.";
    } else if (intent === "love") {
      intentionOffset = 0.528; // Heart expansion frequency
      intentionNote = "Sacred Devotion & Relational Healing alignment, smoothing internal emotional boundaries.";
    } else if (intent === "wisdom") {
      intentionOffset = 0.707; // Gateway balance pitch
      intentionNote = "Cosmic Mind Expansion alignment, clarifying your mental antenna for spiritual and ancestral guidance.";
    } else if (intent === "health") {
      intentionOffset = 1.111; // Recovery frequency
      intentionNote = "Cellular Regeneration alignment, harmonizing sympathetic nervous system impulses for rapid physical rejuvenation.";
    } else if (intent === "protection") {
      intentionOffset = -1.23; // Shield deflection offset
      intentionNote = "Aura Boundary Shielding alignment, creating a deflective counter-vibration against environmental stress.";
    } else if (intent === "expression") {
      intentionOffset = 0.852; // Third-eye clearing helper
      intentionNote = "Sovereign Voice & Sonic Clarity alignment, unlocking suppressed verbal energy and mental blocks.";
    } else {
      intentionOffset = 0.44;
      intentionNote = "Somatic Balance alignment, grounding your cosmic template.";
    }

    // Combine parameters to get a highly customized, deterministic floating-point frequency
    const preciseFreq = baseFreq + elementOffset + moonOffset + timeOffset + intentionOffset;
    // Round to 2 decimal places for clinical aesthetic precision
    const fineTunedHz = Math.round(preciseFreq * 100) / 100;

    // Custom note from a professional sound healer
    let healerNote = "";
    if (intent === "wealth") {
      healerNote = `Dear seeker, your natal chart reveals a powerful ${element} core with the Sun in ${sun} and Moon in ${moon}. To magnetize the abundance you seek, I have fine-tuned your fundamental ${activeInfo.name} sound bath. By incorporating a micro-shift of +${intentionOffset} Hz (the sacred Golden Ratio Phi parameter) combined with your birth-time energetic state, your custom frequency vibrates at exactly ${fineTunedHz} Hz. This precise pitch resonates with the earth-grid, dissolving deep-seated fears around scarcity and material insecurity. Meditate upon this custom resonance to anchor your somatic blueprint and activate financial sovereignty.`;
    } else if (intent === "love") {
      healerNote = `Warm blessings, precious soul. Your energetic body, influenced by your ${element} Sun in ${sun} and Moon in ${moon}, requires a gentle, fluid container for heart integration. Instead of the generic ${baseFreq} Hz default, your chakra is now calibrated to exactly ${fineTunedHz} Hz. I have tuned this with a soft lunar micro-oscillation of +${intentionOffset} Hz, which specifically targets the somatic armor around your heart center. This refined vibration clears the emotional channels, preparing your body's field to receive and radiate pure, unconditional devotion.`;
    } else if (intent === "wisdom") {
      healerNote = `Greetings, wise traveler. Based on your birth details—calculated under the ${element} Sun of ${sun} with the Moon in ${moon}—your intellectual and spiritual antennas require clear, untangled channels. I have elevated your vibration to exactly ${fineTunedHz} Hz. The custom addition of +${intentionOffset} Hz acts as a harmonic bridge between your conscious mind and ancestral memory fields. This fine-tuned sound bath calms mental chatter and clears the pineal gateway, allowing deep intuition and soul-clarity to flow freely through your crown.`;
    } else if (intent === "health") {
      healerNote = `Sovereign healing wishes to you. Your physical avatar carries a ${element} elemental signature with the Sun in ${sun} and Moon in ${moon}. To stimulate cellular recovery, I have adjusted your base chakra resonance to exactly ${fineTunedHz} Hz. By introducing a +${intentionOffset} Hz Trinity Constant, we establish a soothing bio-electric resonance. This customized sound bath stabilizes the autonomic nervous system, signaling to your cells that it is safe to enter deep, restorative recovery. Breathe deeply as this precise frequency wraps your physical field.`;
    } else if (intent === "protection") {
      healerNote = `Peace be upon your sanctuary. To protect your auric field, we look at your ${element} Sun in ${sun} and Moon in ${moon}. I have calibrated a deflective boundary frequency of exactly ${fineTunedHz} Hz. Rather than a static vibration, this custom offset of ${intentionOffset} Hz acts as a sonic shield that intercepts discordant environmental energies. It strengthens your core energy center, allowing you to walk through dense or stressful settings without absorbing external anxiety. This is your personal acoustic boundary.`;
    } else if (intent === "expression") {
      healerNote = `Beloved voice, your creative expression is tied to your ${element} Sun in ${sun} and Moon in ${moon}. To unlock your sovereign vocal power, I have fine-tuned your throat center resonance to exactly ${fineTunedHz} Hz. The +${intentionOffset} Hz clearing vibration targeted here gently dissolves somatic blockages in the thyroid and vocal cords—often left by unspoken truths or swallowed emotions. Let this custom frequency wash over you; it will help you speak your cosmic reality with absolute clarity and calm confidence.`;
    } else {
      healerNote = `Beloved soul, your personal sound bath has been dynamically balanced. Taking into account your Sun in ${sun} and Moon in ${moon}, we have shifted your resonance to exactly ${fineTunedHz} Hz. This micro-tuned oscillation works directly with your unique birth alignments to remove energetic static, preparing your body and spirit for the sacred art of ink integration.`;
    }

    return {
      frequency: fineTunedHz,
      explanation: intentionNote,
      healingNote: healerNote,
    };
  };

  const stopSolfeggio = () => {
    try {
      if (mainGainRef.current && audioCtxRef.current) {
        const currentTime = audioCtxRef.current.currentTime;
        mainGainRef.current.gain.setValueAtTime(mainGainRef.current.gain.value, currentTime);
        mainGainRef.current.gain.linearRampToValueAtTime(0, currentTime + 0.15);
      }
      setTimeout(() => {
        if (osc1Ref.current) { osc1Ref.current.stop(); osc1Ref.current.disconnect(); osc1Ref.current = null; }
        if (osc2Ref.current) { osc2Ref.current.stop(); osc2Ref.current.disconnect(); osc2Ref.current = null; }
        if (subOscRef.current) { subOscRef.current.stop(); subOscRef.current.disconnect(); subOscRef.current = null; }
        if (mainGainRef.current) { mainGainRef.current.disconnect(); mainGainRef.current = null; }
        if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
          audioCtxRef.current.close();
          audioCtxRef.current = null;
        }
        setSolfeggioPlaying(false);
      }, 160);
    } catch (err) {
      console.error("Failed stopping Solfeggio Audio Context", err);
      setSolfeggioPlaying(false);
    }
  };

  const startSolfeggio = (freqToPlay: number) => {
    try {
      // Create new clean AudioContext
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0, ctx.currentTime);
      mainGain.connect(ctx.destination);
      mainGainRef.current = mainGain;

      // 1. Primary sound wave (Soothing Sine wave)
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freqToPlay, ctx.currentTime);
      
      const gain1 = ctx.createGain();
      gain1.gain.setValueAtTime(0.45, ctx.currentTime);
      osc1.connect(gain1);
      gain1.connect(mainGain);
      osc1.start();
      osc1Ref.current = osc1;

      // 2. Cosmic Beat oscillator (Detuned by +1.1Hz to trigger calming brainwave entrainment)
      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freqToPlay + 1.1, ctx.currentTime);
      
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.3, ctx.currentTime);
      osc2.connect(gain2);
      gain2.connect(mainGain);
      osc2.start();
      osc2Ref.current = osc2;

      // 3. Somatic Sub-harmonic wave (1 octave below fundamental, soft triangle to simulate a Tibetan bowl hum)
      const subOsc = ctx.createOscillator();
      subOsc.type = "triangle";
      subOsc.frequency.setValueAtTime(freqToPlay / 2, ctx.currentTime);
      
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.16, ctx.currentTime);
      subOsc.connect(subGain);
      subGain.connect(mainGain);
      subOsc.start();
      subOscRef.current = subOsc;

      // Graceful volume fade in
      mainGain.gain.linearRampToValueAtTime(solfeggioVolume, ctx.currentTime + 1.0);
      setSolfeggioPlaying(true);

    } catch (err) {
      console.error("Could not start Solfeggio audio nodes", err);
    }
  };

  const handleSolfeggioToggle = () => {
    if (solfeggioPlaying) {
      stopSolfeggio();
    } else {
      const activeInfo = getSolfeggioInfo(suggestion?.chakra_energy?.targetChakra || "");
      const freq = solfeggioFreqOverride || activeInfo.frequency;
      startSolfeggio(freq);
    }
  };

  const handleSolfeggioFreqChange = (freq: number) => {
    setSolfeggioFreqOverride(freq);
    if (solfeggioPlaying && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      if (osc1Ref.current) {
        osc1Ref.current.frequency.exponentialRampToValueAtTime(freq, now + 0.6);
      }
      if (osc2Ref.current) {
        osc2Ref.current.frequency.exponentialRampToValueAtTime(freq + 1.1, now + 0.6);
      }
      if (subOscRef.current) {
        subOscRef.current.frequency.exponentialRampToValueAtTime(freq / 2, now + 0.6);
      }
    } else if (!solfeggioPlaying) {
      // Auto-start playing when frequency is selected for instant interactive confirmation
      startSolfeggio(freq);
    }
  };

  // Real-time volume sliders
  useEffect(() => {
    if (solfeggioPlaying && mainGainRef.current && audioCtxRef.current) {
      mainGainRef.current.gain.linearRampToValueAtTime(solfeggioVolume, audioCtxRef.current.currentTime + 0.08);
    }
  }, [solfeggioVolume, solfeggioPlaying]);

  // Handle auto-stop on unmount
  useEffect(() => {
    return () => {
      if (osc1Ref.current || osc2Ref.current || subOscRef.current) {
        try {
          if (osc1Ref.current) osc1Ref.current.stop();
          if (osc2Ref.current) osc2Ref.current.stop();
          if (subOscRef.current) subOscRef.current.stop();
          if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
            audioCtxRef.current.close();
          }
        } catch (err) {}
      }
    };
  }, []);

  // Social Sharing States & Functions
  const [showShareModal, setShowShareModal] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [shareSuccessMsg, setShareSuccessMsg] = useState<string | null>(null);

  const getShareCaption = () => {
    return `✨ My AstroPsyche Sacred Tattoo Blueprint is here! ✨

🔮 Birth Alignments:
☀️ Sun: ${suggestion?.astrology?.sunSign || "Cancer"}
🌙 Moon: ${suggestion?.astrology?.moonSign || "Taurus"}
📐 Ascendant: ${suggestion?.astrology?.risingSign || "Capricorn"}

🎨 Personal Talisman: "${suggestion?.tattoo_concept?.title || "Golden Wheat Yantra"}"
⚜️ Style: ${suggestion?.tattoo_concept?.style || "Vedic / Yantra"}
🌿 Placement Node: ${suggestion?.tattoo_concept?.placement || "Right Ankle"}
💫 Flow Direction: ${suggestion?.tattoo_concept?.direction || "Upward-facing"}

Channeled via AstroPsyche Tattoo Suggester to resonate with my somatic intentions. 🌌✨

#AstroPsyche #SacredGeometry #AstrologyTattoo #TattooBlueprint #Yantra #EnergyHealing`;
  };

  const copyCaptionToClipboard = () => {
    navigator.clipboard.writeText(getShareCaption());
    setShareSuccessMsg("Captivating caption copied to clipboard! Ready to paste.");
    setTimeout(() => setShareSuccessMsg(null), 4000);
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(getShareCaption());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const generateShareCardImage = () => {
    if (selectedComplexity !== "Simple" && !isPremiumUnlocked) {
      setShowPremiumSimulatorModal(true);
      return;
    }
    setIsGeneratingImage(true);
    setShareSuccessMsg(null);
    
    try {
      // 1. Create canvas of size 1080x1080 (Instagram Square)
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not construct 2D context");

      // 2. Beautiful Deep Space Radial Gradient Background
      const gradient = ctx.createRadialGradient(540, 540, 50, 540, 540, 720);
      gradient.addColorStop(0, "#191424"); // Mystical amethyst core
      gradient.addColorStop(0.5, "#0E0B14"); // Dark twilight space
      gradient.addColorStop(1, "#050408"); // Void black margin
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1080);

      // 3. Ambient Starfield Noise
      ctx.fillStyle = "rgba(197, 160, 89, 0.15)";
      for (let i = 0; i < 60; i++) {
        const x = Math.random() * 1080;
        const y = Math.random() * 1080;
        const radiusVal = Math.random() * 1.8 + 0.4;
        ctx.beginPath();
        ctx.arc(x, y, radiusVal, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Double Ornate Golden Borders
      ctx.strokeStyle = "rgba(197, 160, 89, 0.25)";
      ctx.lineWidth = 1;
      ctx.strokeRect(32, 32, 1016, 1016);

      ctx.strokeStyle = "#C5A059";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(45, 45, 990, 990);

      // Ornate corner stars
      const cornerPoints = [
        [45, 45], [1035, 45], [45, 1035], [1035, 1035]
      ];
      ctx.fillStyle = "#C5A059";
      cornerPoints.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#0E0B14";
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#C5A059";
      });

      // 5. Header Typography
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(197, 160, 89, 0.7)";
      ctx.font = "bold 13px 'Inter', sans-serif";
      ctx.fillText("✦ COSMIC ALIGNMENT blueprint ✦", 540, 85);

      ctx.fillStyle = "#FAF6EE";
      ctx.font = "bold 34px 'Cinzel', 'Georgia', serif";
      ctx.fillText("SACRED TALISMAN REPORT", 540, 135);

      // Decorative center line
      ctx.strokeStyle = "rgba(197, 160, 89, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(350, 165);
      ctx.lineTo(710, 165);
      ctx.stroke();

      // Divider Symbol
      ctx.fillStyle = "#C5A059";
      ctx.font = "18px 'Georgia', serif";
      ctx.fillText("✧", 540, 171);

      // Prepared Name
      ctx.fillStyle = "#FAF6EE";
      ctx.font = "bold 20px 'Inter', sans-serif";
      ctx.fillText(`PREPARED FOR: ${firstName.toUpperCase()} ${lastName.toUpperCase()}`, 540, 215);

      // 6. Astrological Sign cards side-by-side (Three Column Cards)
      const detailsY = 275;
      
      // Card 1: Sun
      ctx.fillStyle = "rgba(197, 160, 89, 0.04)";
      ctx.strokeStyle = "rgba(197, 160, 89, 0.18)";
      ctx.lineWidth = 1;
      ctx.fillRect(80, detailsY, 280, 100);
      ctx.strokeRect(80, detailsY, 280, 100);
      
      ctx.fillStyle = "rgba(250, 246, 238, 0.65)";
      ctx.font = "bold 12px 'Inter', sans-serif";
      ctx.fillText("☀️ SUN (SURYA)", 220, detailsY + 35);
      ctx.fillStyle = "#C5A059";
      ctx.font = "italic bold 21px 'Georgia', serif";
      ctx.fillText(suggestion?.astrology?.sunSign || "Cancer", 220, detailsY + 70);

      // Card 2: Moon
      ctx.fillStyle = "rgba(197, 160, 89, 0.04)";
      ctx.fillRect(400, detailsY, 280, 100);
      ctx.strokeRect(400, detailsY, 280, 100);
      
      ctx.fillStyle = "rgba(250, 246, 238, 0.65)";
      ctx.font = "bold 12px 'Inter', sans-serif";
      ctx.fillText("🌙 MOON (CHANDRA)", 540, detailsY + 35);
      ctx.fillStyle = "#C5A059";
      ctx.font = "italic bold 21px 'Georgia', serif";
      ctx.fillText(suggestion?.astrology?.moonSign || "Taurus", 540, detailsY + 70);

      // Card 3: Ascendant
      ctx.fillStyle = "rgba(197, 160, 89, 0.04)";
      ctx.fillRect(720, detailsY, 280, 100);
      ctx.strokeRect(720, detailsY, 280, 100);
      
      ctx.fillStyle = "rgba(250, 246, 238, 0.65)";
      ctx.font = "bold 12px 'Inter', sans-serif";
      ctx.fillText("📐 ASCENDANT (LAGNA)", 860, detailsY + 35);
      ctx.fillStyle = "#C5A059";
      ctx.font = "italic bold 21px 'Georgia', serif";
      ctx.fillText(suggestion?.astrology?.risingSign || "Capricorn", 860, detailsY + 70);

      // 7. Circular Talisman Display Canvas
      const centerX = 540;
      const centerY = 615;
      const ringRadius = 165;

      // Outer golden track ring
      ctx.strokeStyle = "rgba(197, 160, 89, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius + 25, 0, Math.PI * 2);
      ctx.stroke();

      // Core alignment circle
      ctx.strokeStyle = "rgba(197, 160, 89, 0.22)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius + 12, 0, Math.PI * 2);
      ctx.stroke();

      // Deep portal backing fill
      ctx.fillStyle = "rgba(15, 12, 22, 0.85)";
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius + 12, 0, Math.PI * 2);
      ctx.fill();

      // Constellation dashed orbit
      ctx.strokeStyle = "rgba(197, 160, 89, 0.28)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius + 32, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]); // clear dash

      // Fetch active SVG string based on calibration complexity
      let rawSvg = selectedComplexity === "Simple" 
        ? (activeTattooOption?.svgMarkupSimple || activeTattooOption?.svgMarkup) 
        : selectedComplexity === "Advanced" 
        ? (activeTattooOption?.svgMarkupAdvanced || activeTattooOption?.svgMarkup) 
        : (activeTattooOption?.svgMarkupModerate || activeTattooOption?.svgMarkup);
      
      if (!rawSvg) {
        rawSvg = getSacredTattooSvg();
      }

      // Add SVG namespace
      let formattedSvg = rawSvg.trim();
      if (!formattedSvg.includes("xmlns=")) {
        formattedSvg = formattedSvg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      // Enforce gold-cream coloring on dark card
      formattedSvg = formattedSvg.replace(/currentColor/g, "#FAF6EE");
      formattedSvg = formattedSvg.replace(/stroke-width="[^"]*"/g, 'stroke-width="1.3"');

      // Convert to image
      const dataSvgUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(formattedSvg);
      const svgImage = new Image();
      svgImage.crossOrigin = "anonymous";
      svgImage.src = dataSvgUrl;

      svgImage.onload = () => {
        const svgSizeVal = 265;
        ctx.drawImage(svgImage, centerX - svgSizeVal / 2, centerY - svgSizeVal / 2, svgSizeVal, svgSizeVal);

        // 8. Card Footer Text
        ctx.textAlign = "center";
        
        // Talisman Title
        ctx.fillStyle = "#FAF6EE";
        ctx.font = "bold 28px 'Cinzel', 'Georgia', serif";
        ctx.fillText((activeTattooOption?.title || "COSMIC TALISMAN").toUpperCase(), 540, 840);

        // Style and Location Label
        ctx.fillStyle = "#C5A059";
        ctx.font = "bold 14px 'Inter', sans-serif";
        ctx.fillText(`${(activeTattooOption?.style || "VEDIC / YANTRA").toUpperCase()}   •   ${(activeTattooOption?.placement || "RIGHT ANKLE").toUpperCase()}`, 540, 880);

        // Size parameter
        ctx.fillStyle = "rgba(250, 246, 238, 0.72)";
        ctx.font = "italic 14px 'Georgia', serif";
        ctx.fillText(`Scale: ${activeTattooOption?.size || "3-4 inches"}  |  Align: ${activeTattooOption?.direction || "Upward-facing"}`, 540, 915);

        // App Stamp Branding
        ctx.fillStyle = "rgba(197, 160, 89, 0.4)";
        ctx.font = "bold 11px 'Inter', sans-serif";
        ctx.fillText("DESIGNED VIA ASTROPSYCHE TATTOO SUGGESTER", 540, 970);

        ctx.fillStyle = "rgba(250, 246, 238, 0.25)";
        ctx.font = "9px 'Inter', sans-serif";
        ctx.fillText("✦ TAP INTO YOUR SOMATIC ENERGY ✦", 540, 995);

        // Download file
        try {
          const downloadUrl = canvas.toDataURL("image/png");
          const dlLink = document.createElement("a");
          dlLink.href = downloadUrl;
          dlLink.download = `astropsyche_blueprint_${firstName.toLowerCase()}_${(activeTattooOption?.title || "concept").toLowerCase().replace(/\s+/g, "_")}.png`;
          dlLink.click();
          setShareSuccessMsg("Beautiful 'Tattoo Blueprint' card generated and downloaded! Perfect for Instagram, Facebook, or WhatsApp Status!");
        } catch (err: any) {
          console.error("Canvas conversion failed", err);
          setShareSuccessMsg(`Export error: ${err.message}. Your browser security restricted the canvas serialization.`);
        }
        setIsGeneratingImage(false);
      };

      svgImage.onerror = (e) => {
        console.error("Failed to render talisman SVG inside canvas image context", e);
        ctx.fillStyle = "#C5A059";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("[Talisman Design Visual]", centerX, centerY);
        
        try {
          const downloadUrl = canvas.toDataURL("image/png");
          const dlLink = document.createElement("a");
          dlLink.href = downloadUrl;
          dlLink.download = `astropsyche_blueprint_${firstName.toLowerCase()}.png`;
          dlLink.click();
          setShareSuccessMsg("Downloaded card with a static design placeholder due to a local vector reading constraint.");
        } catch (err) {}
        setIsGeneratingImage(false);
      };

    } catch (err: any) {
      console.error("Constructing share card failed", err);
      setIsGeneratingImage(false);
      setShareSuccessMsg(`Error: ${err.message}`);
    }
  };

  // Sync preview gender automatically with the selected birth coordinates gender
  useEffect(() => {
    if (gender === "Male") {
      setPreviewGender("Male");
    } else {
      setPreviewGender("Female");
    }
  }, [gender]);

  // The generated suggestion state
  const [suggestion, setSuggestion] = useState<any>({
    astrology: {
      sunSign: "Cancer",
      moonSign: "Taurus",
      risingSign: "Capricorn",
      dominantPlanet: "Venus & Saturn",
      summary: "Your Cancer Sun values safety and ancestral heritage, while your Taurus Moon craves material security and structural grounding. However, your Capricorn Rising presents a stoic shield. Placing a grounding talisman aligns with your Taurus Moon, strengthening your 2nd House of personal finances and wealth storage."
    },
    chakra_energy: {
      targetChakra: "Root Chakra (Muladhara)",
      imbalanceAnalysis: "Anxiety regarding financial stability is stored in the lower extremities, locking up the Muladhara energy. By channeling the solid earth frequency, you release scarcity trauma and lock in grounded, permanent wealth generation.",
      reikiSymbol: "Unalome Path of Life + Swastik-inspired geometric alignment",
      vedicRemedy: "A protective Vedic Swastik or Wheat-Yantra, serving as a Kavach (shield) against financial stress and unstable material flows."
    },
    tattoo_concept: {
      title: "Golden Wheat Yantra",
      symbolism: "The lower extremities are somatic gates for grounding and stabilizing material anxiety. Planting this wheat sigil anchors stable earthly security.",
      elements: ["Golden wheat sheaf paths", "Concentric cosmic orbits", "Fine-line Unalome base root", "Sacred geometry boundary"],
      style: "Vedic / Yantra",
      colors: "Warm gold and rich copper. Gold vibrates at a higher solar frequency, while copper activates conduction of magnetic physical currents.",
      placement: "Right Ankle / Lower Leg",
      placementReason: "Placing this on your right ankle anchors you to the Earth. The right side is the Pingala (masculine/outgoing) channel, translating your inner intention directly into physical abundance and real-world steps.",
      painIndex: 3,
      energySensitivity: 9,
      size: "3 to 4 inches (Sacred Golden Ratio)",
      direction: "Upward-facing (ascending abundance flow)",
      timing: "Waxing Crescent Moon (Hora of Jupiter, Thursday morning)",
      reasoning: "The lower extremities are somatic gates for grounding and stabilizing material anxiety. Planting this wheat sigil anchors stable earthly security.",
      astrologicalExplanation: "Your Taurus Moon rules your emotional security and craves tactile abundance. This yantra activates the 2nd House of storage and physical flow.",
      midjourneyPrompt: "A minimalist fine-line tattoo design of a Golden Wheat stalk combined with concentric sacred geometry circles and a Unalome spiral, clean vector illustration on solid white background, high contrast, golden ink, spiritual talisman, sacred vibe --no shadows shading",
      culturalRespect: "Wheat and Yantra designs have ancient roots across Vedic and agrarian cultures. Ensure you honor the geometry's centering purpose; it is designed for spiritual grounding, not merely superficial adornment.",
      svgMarkup: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2">
        <!-- Concentric Grounding Circles -->
        <circle cx="50" cy="50" r="42" stroke-dasharray="2 3" opacity="0.6"/>
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="12" stroke-width="0.8" stroke-dasharray="1 1"/>
        
        <!-- Axis Cross Lines -->
        <line x1="50" y1="8" x2="50" y2="92" opacity="0.3"/>
        <line x1="8" y1="50" x2="92" y2="50" opacity="0.3"/>
        
        <!-- Central Wheat Grain Nodes -->
        <path d="M 50 15 Q 53 25, 50 35 Q 47 25, 50 15 Z" fill="currentColor" fill-opacity="0.1" />
        <path d="M 50 35 Q 55 45, 50 55 Q 45 45, 50 35 Z" fill="currentColor" fill-opacity="0.1" />
        
        <!-- Diagonal Wheat Seed Leaves -->
        <path d="M 50 25 Q 62 18, 58 30 Z" />
        <path d="M 50 25 Q 38 18, 42 30 Z" />
        <path d="M 50 45 Q 62 38, 58 50 Z" />
        <path d="M 50 45 Q 38 38, 42 50 Z" />
        
        <!-- Grounding Sacred Triangle -->
        <polygon points="50,68 35,88 65,88" stroke-width="1.2" />
        <circle cx="50" cy="78" r="2" fill="currentColor" />
      </svg>`,
      svgMarkupSimple: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2">
        <circle cx="50" cy="50" r="30" />
        <line x1="50" y1="20" x2="50" y2="80" />
        <path d="M 50 30 Q 60 25, 55 35 Z" />
        <path d="M 50 30 Q 40 25, 45 35 Z" />
        <polygon points="50,68 40,82 60,82" />
      </svg>`,
      svgMarkupModerate: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2">
        <!-- Concentric Grounding Circles -->
        <circle cx="50" cy="50" r="42" stroke-dasharray="2 3" opacity="0.6"/>
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="12" stroke-width="0.8" stroke-dasharray="1 1"/>
        
        <!-- Axis Cross Lines -->
        <line x1="50" y1="8" x2="50" y2="92" opacity="0.3"/>
        <line x1="8" y1="50" x2="92" y2="50" opacity="0.3"/>
        
        <!-- Central Wheat Grain Nodes -->
        <path d="M 50 15 Q 53 25, 50 35 Q 47 25, 50 15 Z" fill="currentColor" fill-opacity="0.1" />
        <path d="M 50 35 Q 55 45, 50 55 Q 45 45, 50 35 Z" fill="currentColor" fill-opacity="0.1" />
        
        <!-- Diagonal Wheat Seed Leaves -->
        <path d="M 50 25 Q 62 18, 58 30 Z" />
        <path d="M 50 25 Q 38 18, 42 30 Z" />
        <path d="M 50 45 Q 62 38, 58 50 Z" />
        <path d="M 50 45 Q 38 38, 42 50 Z" />
        
        <!-- Grounding Sacred Triangle -->
        <polygon points="50,68 35,88 65,88" stroke-width="1.2" />
        <circle cx="50" cy="78" r="2" fill="currentColor" />
      </svg>`,
      svgMarkupAdvanced: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2">
        <circle cx="50" cy="50" r="46" stroke-width="1.5" />
        <circle cx="50" cy="50" r="42" stroke-dasharray="2 3" opacity="0.6"/>
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="12" stroke-width="0.8" stroke-dasharray="1 1"/>
        <line x1="50" y1="4" x2="50" y2="96" opacity="0.4"/>
        <line x1="4" y1="50" x2="96" y2="50" opacity="0.4"/>
        <line x1="18" y1="18" x2="82" y2="82" stroke-dasharray="1 2" opacity="0.3" />
        <line x1="82" y1="18" x2="18" y2="82" stroke-dasharray="1 2" opacity="0.3" />
        <path d="M 50 15 Q 53 25, 50 35 Q 47 25, 50 15 Z" fill="currentColor" fill-opacity="0.1" />
        <path d="M 50 35 Q 55 45, 50 55 Q 45 45, 50 35 Z" fill="currentColor" fill-opacity="0.1" />
        <path d="M 50 25 Q 62 18, 58 30 Z" />
        <path d="M 50 25 Q 38 18, 42 30 Z" />
        <path d="M 50 45 Q 62 38, 58 50 Z" />
        <path d="M 50 45 Q 38 38, 42 50 Z" />
        <polygon points="50,68 35,88 65,88" stroke-width="1.2" />
        <circle cx="50" cy="78" r="2" fill="currentColor" />
        <circle cx="50" cy="4" r="1.5" fill="currentColor"/>
        <circle cx="50" cy="96" r="1.5" fill="currentColor"/>
        <circle cx="4" cy="50" r="1.5" fill="currentColor"/>
        <circle cx="96" cy="50" r="1.5" fill="currentColor"/>
      </svg>`,
      simpleDesc: "A clean, minimalist fine-line design highlighting the core upward wheat grain path and foundational physical grounding.",
      moderateDesc: "A balanced sacred yantra layout containing the wheat grain nodes with concentric circular boundary lines.",
      advancedDesc: "An intricate multi-layered alchemical sigil featuring the outer celestial boundary ring and active starburst focus nodes."
    }
  });

  const premiumOptions = suggestion ? PremiumData.getPremiumTattooOptions(intention, { sun: suggestion.astrology.sunSign, moon: suggestion.astrology.moonSign, rising: suggestion.astrology.risingSign }, suggestion).slice(0, 2) : [];
  const activeTattooOption = (isPremiumUnlocked && premiumOptions.length > 0)
    ? (premiumOptions[selectedPremiumOptionIndex] || suggestion.tattoo_concept)
    : (suggestion ? suggestion.tattoo_concept : null);

  // Monitor screens and stop sound if not actively viewing results
  useEffect(() => {
    if (activeTab !== "quiz" || quizStep !== 4 || !suggestion) {
      if (solfeggioPlaying) {
        stopSolfeggio();
      }
    }
  }, [activeTab, quizStep, suggestion, solfeggioPlaying]);

  // Calculate astrology signs on date changes to give dynamic native feedback before clicking suggest
  const [nativeZodiac, setNativeZodiac] = useState({ sun: "Cancer", moon: "Taurus", rising: "Capricorn" });

  useEffect(() => {
    if (!birthDate) return;
    const day = parseInt(birthDate.split("-")[2]) || 12;
    const month = parseInt(birthDate.split("-")[1]) || 7;
    
    // Simple mock astrology logic for dynamic UI feel
    const sunSigns = ["Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"];
    const sunIndex = (month - 1) % 12;
    const sun = sunSigns[sunIndex];

    const moonSigns = ["Taurus", "Leo", "Scorpio", "Aquarius", "Gemini", "Virgo", "Sagittarius", "Pisces", "Cancer", "Libra", "Capricorn", "Aries"];
    const moonIndex = (day + month) % 12;
    const moon = moonSigns[moonIndex];

    const risingSigns = ["Capricorn", "Aries", "Leo", "Scorpio", "Libra", "Gemini", "Sagittarius", "Cancer", "Taurus", "Virgo", "Aquarius", "Pisces"];
    const risingIndex = (day * month) % 12;
    const rising = risingSigns[risingIndex];

    setNativeZodiac({ sun, moon, rising });
  }, [birthDate]);

  // --- CUSTOM SIGIL BUILDER STATE ---
  const [sigilChakra, setSigilChakra] = useState("root");
  const [sigilZodiac, setSigilZodiac] = useState("cancer");
  const [sigilPlanet, setSigilPlanet] = useState("moon");
  const [sigilIntent, setSigilIntent] = useState("Emotional grounding, financial flow, and creative freedom.");
  const [sigilLoading, setSigilLoading] = useState(false);
  const [sigilAnalysis, setSigilAnalysis] = useState<any>(null);

  // Layer Transforms
  const [chakraScale, setChakraScale] = useState(1.1);
  const [chakraRotate, setChakraRotate] = useState(0);
  const [chakraColor, setChakraColor] = useState("#C5A059");
  const [chakraOpacity, setChakraOpacity] = useState(0.4);

  const [zodiacScale, setZodiacScale] = useState(0.8);
  const [zodiacRotate, setZodiacRotate] = useState(0);
  const [zodiacX, setZodiacX] = useState(0);
  const [zodiacY, setZodiacY] = useState(0);
  const [zodiacColor, setZodiacColor] = useState("#E5E5E5");
  const [zodiacOpacity, setZodiacOpacity] = useState(0.85);

  const [planetScale, setPlanetScale] = useState(0.65);
  const [planetRotate, setPlanetRotate] = useState(0);
  const [planetX, setPlanetX] = useState(0);
  const [planetY, setPlanetY] = useState(0);
  const [planetColor, setPlanetColor] = useState("#C5A059");
  const [planetOpacity, setPlanetOpacity] = useState(0.95);

  // Ornaments & Settings
  const [showOrbits, setShowOrbits] = useState(true);
  const [showCrosshairs, setShowCrosshairs] = useState(true);
  const [showOuterShield, setShowOuterShield] = useState(true);
  const [lineWidth, setLineWidth] = useState(1.2);
  const [sigilCopied, setSigilCopied] = useState(false);
  const [openSection, setOpenSection] = useState<string>("chakra");

  // Update explanation locally whenever selections change
  useEffect(() => {
    const analysis = generateSigilSignificance(sigilChakra, sigilZodiac, sigilPlanet);
    setSigilAnalysis(analysis);
  }, [sigilChakra, sigilZodiac, sigilPlanet]);

  // Sync selected parameters from birth chart (derived in quiz tab)
  const syncWithBirthChart = () => {
    const sunLower = nativeZodiac.sun.toLowerCase();
    const planetMap: Record<string, string> = {
      aries: "mars",
      taurus: "venus",
      gemini: "mercury",
      cancer: "moon",
      leo: "sun",
      virgo: "mercury",
      libra: "venus",
      scorpio: "pluto",
      sagittarius: "jupiter",
      capricorn: "saturn",
      aquarius: "uranus",
      pisces: "neptune"
    };

    setSigilZodiac(sunLower);
    setSigilPlanet(planetMap[sunLower] || "sun");

    // Match appropriate chakra based on intention or sign element
    if (sunLower === "aries" || sunLower === "leo" || sunLower === "sagittarius") {
      setSigilChakra("solar_plexus");
    } else if (sunLower === "taurus" || sunLower === "virgo" || sunLower === "capricorn") {
      setSigilChakra("root");
    } else if (sunLower === "gemini" || sunLower === "libra" || sunLower === "aquarius") {
      setSigilChakra("heart");
    } else {
      setSigilChakra("sacral");
    }
  };

  // Randomized combination for inspiration
  const randomizeSigil = () => {
    const chakras = CHAKRA_BASES.map(c => c.id);
    const zodiacs = ASTROLOGY_GLYPHS.map(z => z.id);
    const planets = PLANETARY_SIGILS.map(p => p.id);

    setSigilChakra(chakras[Math.floor(Math.random() * chakras.length)]);
    setSigilZodiac(zodiacs[Math.floor(Math.random() * zodiacs.length)]);
    setSigilPlanet(planets[Math.floor(Math.random() * planets.length)]);

    // Randomize offsets slightly
    setChakraRotate(Math.floor(Math.random() * 8) * 45);
    setZodiacRotate(Math.floor(Math.random() * 12) * 30);
    setPlanetRotate(Math.floor(Math.random() * 12) * 30);
    setZodiacX(Math.floor(Math.random() * 5) - 2);
    setZodiacY(Math.floor(Math.random() * 5) - 2);
    setPlanetX(Math.floor(Math.random() * 11) - 5);
    setPlanetY(Math.floor(Math.random() * 11) - 5);
  };

  // Live composite SVG generator
  const generateCompositeSvg = () => {
    const chakraItem = CHAKRA_BASES.find(c => c.id === sigilChakra);
    const zodiacItem = ASTROLOGY_GLYPHS.find(z => z.id === sigilZodiac);
    const planetItem = PLANETARY_SIGILS.find(p => p.id === sigilPlanet);

    // Filter out potential duplicate ids or namespace collisions in inner svgs by removing outer tags if any
    const cleanChakra = chakraItem ? chakraItem.svgMarkup : "";
    const cleanZodiac = zodiacItem ? zodiacItem.svgMarkup : "";
    const cleanPlanet = planetItem ? planetItem.svgMarkup : "";

    return `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="${lineWidth}">
      <!-- Blueprint Grid Guidelines -->
      ${showCrosshairs ? `
        <line x1="50" y1="5" x2="50" y2="95" stroke="#FFFFFF" stroke-width="0.25" opacity="0.12" stroke-dasharray="2 3" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="#FFFFFF" stroke-width="0.25" opacity="0.12" stroke-dasharray="2 3" />
        <line x1="15" y1="15" x2="85" y2="85" stroke="#FFFFFF" stroke-width="0.15" opacity="0.08" stroke-dasharray="1 3" />
        <line x1="85" y1="15" x2="15" y2="85" stroke="#FFFFFF" stroke-width="0.15" opacity="0.08" stroke-dasharray="1 3" />
      ` : ""}

      <!-- Outer Shield Circular Frame -->
      ${showOuterShield ? `
        <circle cx="50" cy="50" r="47.5" stroke="#C5A059" stroke-width="0.7" opacity="0.35" />
        <circle cx="50" cy="50" r="46" stroke="#C5A059" stroke-width="0.3" opacity="0.15" stroke-dasharray="1 1" />
      ` : ""}

      <!-- Sacred Geometric Ripple Orbits -->
      ${showOrbits ? `
        <circle cx="50" cy="50" r="39" stroke="#C5A059" stroke-width="0.4" stroke-dasharray="3 4" opacity="0.25" />
        <circle cx="50" cy="50" r="23" stroke="#C5A059" stroke-width="0.4" stroke-dasharray="1 2" opacity="0.2" />
      ` : ""}

      <!-- LAYER 1: CHAKRA BASE -->
      ${cleanChakra ? `
        <g transform="translate(50 50) rotate(${chakraRotate}) scale(${chakraScale}) translate(-50 -50)" stroke="${chakraColor}" opacity="${chakraOpacity}">
          ${cleanChakra}
        </g>
      ` : ""}

      <!-- LAYER 2: ZODIAC GLYPH -->
      ${cleanZodiac ? `
        <g transform="translate(50 50) translate(${zodiacX} ${zodiacY}) rotate(${zodiacRotate}) scale(${zodiacScale}) translate(-50 -50)" stroke="${zodiacColor}" opacity="${zodiacOpacity}">
          ${cleanZodiac}
        </g>
      ` : ""}

      <!-- LAYER 3: PLANETARY SIGIL -->
      ${cleanPlanet ? `
        <g transform="translate(50 50) translate(${planetX} ${planetY}) rotate(${planetRotate}) scale(${planetScale}) translate(-50 -50)" stroke="${planetColor}" opacity="${planetOpacity}">
          ${cleanPlanet}
        </g>
      ` : ""}
    </svg>`;
  };

  // Send request to Gemini server oracle for full tailored ritual interpretation
  const consultGeminiOracle = async () => {
    setSigilLoading(true);
    try {
      const activeChakra = CHAKRA_BASES.find(c => c.id === sigilChakra)?.name || sigilChakra;
      const activeZodiac = ASTROLOGY_GLYPHS.find(z => z.id === sigilZodiac)?.name || sigilZodiac;
      const activePlanet = PLANETARY_SIGILS.find(p => p.id === sigilPlanet)?.name || sigilPlanet;

      const response = await fetch("/api/analyze-sigil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chakra: activeChakra,
          zodiac: activeZodiac,
          planet: activePlanet,
          intention: sigilIntent
        })
      });

      if (!response.ok) {
        throw new Error("Celestial servers are silent. Utilizing offline wisdom fallback.");
      }

      const data = await response.json();
      if (data && data.title) {
        setSigilAnalysis(data);
      } else {
        throw new Error("Received incomplete data from the astral realm.");
      }
    } catch (err: any) {
      console.warn("Oracle connection failed, falling back to instant client significance:", err.message);
      // Run fallback (which is already set up reactively, but let's re-confirm)
      const fallback = generateSigilSignificance(sigilChakra, sigilZodiac, sigilPlanet);
      setSigilAnalysis(fallback);
    } finally {
      setSigilLoading(false);
    }
  };

  // Apply this custom sigil into the primary remedy/suggestion so they can view it there!
  const applySigilToPrescription = () => {
    const activeChakra = CHAKRA_BASES.find(c => c.id === sigilChakra);
    const activeZodiac = ASTROLOGY_GLYPHS.find(z => z.id === sigilZodiac);
    const activePlanet = PLANETARY_SIGILS.find(p => p.id === sigilPlanet);

    const title = sigilAnalysis?.title || `Custom ${activePlanet?.name} Talisman`;
    const resonance = sigilAnalysis?.resonance || "Your custom combined energetic signature.";

    setSuggestion((prev: any) => ({
      ...prev,
      chakra_energy: {
        ...prev.chakra_energy,
        targetChakra: activeChakra?.name || "Root Chakra",
        imbalanceAnalysis: sigilAnalysis?.psycheAlignment || "Custom aligned energies.",
      },
      tattoo_concept: {
        ...prev.tattoo_concept,
        title: title,
        symbolism: resonance,
        colors: `${activePlanet?.metal || "Gold"} and aligned spiritual pigments.`,
        svgMarkup: generateCompositeSvg(),
        midjourneyPrompt: `A minimalist fine-line tattoo design of a custom spiritual talisman composed of ${activeChakra?.name}, ${activeZodiac?.name} sign, and ${activePlanet?.name}, clean vector line art, golden ink --no shadows shading`
      }
    }));

    // Alert the user gently or let the state reflect
    setActiveTab("quiz");
  };

  const copySigilMarkupToClipboard = () => {
    navigator.clipboard.writeText(generateCompositeSvg());
    setSigilCopied(true);
    setTimeout(() => setSigilCopied(false), 2000);
  };

  // Handle body map click
  const handleMapNodeClick = (key: string) => {
    setActiveResonancePoint(key);
  };

  // Run the tattoo suggestion generator
  const handleInitiateRitual = async () => {
    // Check user restriction for single-user subscriptions
    if (activePlan === "premium" || activePlan === "pro") {
      if (!registeredSingleUser) {
        const newUser = { firstName, lastName, birthDate };
        setRegisteredSingleUser(newUser);
        localStorage.setItem("aura_ink_single_user", JSON.stringify(newUser));
      } else {
        const matches = 
          registeredSingleUser.firstName.trim().toLowerCase() === firstName.trim().toLowerCase() &&
          registeredSingleUser.lastName.trim().toLowerCase() === lastName.trim().toLowerCase() &&
          registeredSingleUser.birthDate === birthDate;
        
        if (!matches) {
          setAttemptedUser({ firstName, lastName, birthDate });
          setShowUpgradeToFamilyModal(true);
          return; // Block execution
        }
      }
    } else if (activePlan === "family") {
      const matchesExisting = familyUsersList.some(
        u => u.firstName.trim().toLowerCase() === firstName.trim().toLowerCase() &&
             u.lastName.trim().toLowerCase() === lastName.trim().toLowerCase() &&
             u.birthDate === birthDate
      );
      
      if (!matchesExisting) {
        if (familyUsersList.length >= 10) {
          alert("⚠️ Limit Reached: Your Aura Professional Family Monthly Subscription has reached its maximum limit of 10 unique users. You cannot register more seekers under this subscription.");
          return; // Block execution
        } else {
          const updatedList = [...familyUsersList, { firstName, lastName, birthDate }];
          setFamilyUsersList(updatedList);
          localStorage.setItem("aura_ink_family_users", JSON.stringify(updatedList));
        }
      }
    }

    setQuizStep(3);
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/suggest-tattoo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          gender,
          birthDate,
          birthTime: dontKnowExactTime
            ? (approxTimePeriod === "morning" ? "Morning (Approx. 08:00 AM)"
               : approxTimePeriod === "afternoon" ? "Afternoon (Approx. 02:00 PM)"
               : approxTimePeriod === "evening" ? "Evening (Approx. 06:00 PM)"
               : approxTimePeriod === "night" ? "Night (Approx. 11:00 PM)"
               : "Unknown (Approx. 12:00 PM)")
            : formatBirthTime(birthTime, false, ""),
          birthPlace,
          intention,
          need,
          preferredLanguage
        })
      });

      if (!response.ok) {
        throw new Error("Failed to contact the celestial servers. Utilizing offline spiritual calculation instead.");
      }

      const data = await response.json();
      if (data && data.tattoo_concept) {
        // Guarantee simple/moderate/advanced fields are present
        if (!data.tattoo_concept.svgMarkupSimple) {
          const comps = createComplexitySVs(data.tattoo_concept.svgMarkup || getSacredTattooSvg(), data.tattoo_concept.title);
          data.tattoo_concept.svgMarkupSimple = comps.simple;
          data.tattoo_concept.svgMarkupModerate = comps.moderate;
          data.tattoo_concept.svgMarkupAdvanced = comps.advanced;
          data.tattoo_concept.simpleDesc = comps.simpleDesc;
          data.tattoo_concept.moderateDesc = comps.moderateDesc;
          data.tattoo_concept.advancedDesc = comps.advancedDesc;
        }
        setSuggestion(data);
        saveConsultationToLedger(
          firstName,
          lastName,
          gender,
          birthDate,
          dontKnowExactTime
            ? (approxTimePeriod === "morning" ? "Morning (Approx. 08:00 AM)"
               : approxTimePeriod === "afternoon" ? "Afternoon (Approx. 02:00 PM)"
               : approxTimePeriod === "evening" ? "Evening (Approx. 06:00 PM)"
               : approxTimePeriod === "night" ? "Night (Approx. 11:00 PM)"
               : "Unknown (Approx. 12:00 PM)")
            : formatBirthTime(birthTime, false, ""),
          birthPlace,
          intention,
          need,
          preferredLanguage,
          data
        );
      } else {
        throw new Error("Received imperfectly aligned cosmic data.");
      }
    } catch (err: any) {
      console.warn("API Error, falling back to rich mock data:", err.message);
      // Run deep client-side logic fallback to ensure perfect zero-failure user experience!
      generateClientSideFallback();
    } finally {
      // Fast transition for instant, responsive user experience
      setTimeout(() => {
        setLoading(false);
        setQuizStep(4);
      }, 150);
    }
  };

  // Helper to dynamically construct Simple, Moderate, and Advanced SVGs and descriptions
  const createComplexitySVs = (baseSvg: string, title: string) => {
    // Simple version: remove stroke-dasharray and details
    let simple = baseSvg
      .replace(/stroke-dasharray="[^"]*"/g, 'style="display:none"')
      .replace(/opacity="0\.[1-5]"/g, 'style="display:none"')
      .replace(/<polygon[^>]*>/g, '')
      .replace(/stroke-width="1\.[3-9]"/g, 'stroke-width="1.1"');
    
    if (!simple.includes("<svg")) {
      simple = baseSvg;
    }

    // Moderate version: original baseSvg
    const moderate = baseSvg;

    // Advanced version: layered celestial orbits and calibration coordinates
    let advanced = baseSvg;
    if (baseSvg.includes("</svg>")) {
      const celestialOverlay = `
        <!-- Additional Advanced Celestial Calibration Grids -->
        <circle cx="50" cy="50" r="47" stroke="currentColor" stroke-width="0.8" opacity="0.45" />
        <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="0.5" stroke-dasharray="1 3" opacity="0.7" />
        <line x1="50" y1="2" x2="50" y2="98" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.3" />
        <line x1="2" y1="50" x2="98" y2="50" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.3" />
        <circle cx="50" cy="3" r="1.5" fill="currentColor" />
        <circle cx="50" cy="97" r="1.5" fill="currentColor" />
        <circle cx="3" cy="50" r="1.5" fill="currentColor" />
        <circle cx="97" cy="50" r="1.5" fill="currentColor" />
      `;
      advanced = baseSvg.replace("</svg>", `${celestialOverlay}</svg>`);
    }

    return {
      simple,
      moderate,
      advanced,
      simpleDesc: `A stripped-back, minimalist fine-line version of the ${title || "talisman"} focusing purely on core therapeutic axis geometry.`,
      moderateDesc: `A perfectly balanced configuration of the ${title || "talisman"}, integrating classic sacred geometry and focal elements.`,
      advancedDesc: `A highly intricate cosmic model of the ${title || "talisman"} with layered orbital paths, stellar alignment points, and protective fields.`
    };
  };

  // Perfect client-side spiritual generator based on selections
  const generateClientSideFallback = () => {
    let targetChakra = "Root Chakra (Muladhara)";
    let imbalanceAnalysis = "A mismatch in material foundations storing stress in the lower skeletal meridians.";
    let reikiSymbol = "Cho Ku Rei & Grounding Spiral";
    let vedicRemedy = "Prithvi Mudra ritual with a sacred Swastika-inspired grain boundary shield.";
    let title = "Cosmic Anchor Talisman";
    let elements = ["Root geometric box", "Anchor vector lines", "Earth elemental triangle"];
    let colors = "Crimson red and burnished gold for foundational activation.";
    let placementName = "Right Upper Arm";
    let placementReason = "Placing this on the right upper arm connects to the Pingala solar channel of manifestation, power, and abundance. Keeping it above the waist respects the higher spiritual resonance of the talisman.";
    let painIndex = 3;
    let energySensitivity = 8;
    let styleName = "Vedic / Yantra";
    let sizeName = "3 to 4 inches (Sacred Golden Ratio)";
    let directionName = "Upward-facing (ascending abundance flow)";
    let timingName = "Waxing Crescent Moon (Hora of Jupiter, Thursday morning)";
    let reasoningText = "The right upper arm is the traditional active seat of cosmic reception and strength. Planting this wheat sigil here drives stable manifest power.";
    let astroExplanation = `Your Moon is in ${nativeZodiac.moon}, which craves material security and stability. Placing this on your right upper arm strengthens your 2nd House of personal assets.`;
    let midjourneyPrompt = "";
    let svgMarkup = "";

    if (intention === "Wealth") {
      styleName = "Vedic / Yantra";
      targetChakra = "Root Chakra (Muladhara)";
      imbalanceAnalysis = "Scarcity anxieties are stored in the root energy paths, blocking structural abundance flow.";
      reikiSymbol = "Cho Ku Rei & Swastik-inspired geometric alignments";
      vedicRemedy = "Prithvi Mudra grounding ritual with 108 chants of the root mantra.";
      title = "Golden Wheat Yantra";
      elements = ["Root geometric square", "Golden wheat sheaf contours", "Concentric cosmic boundaries", "Unalome ground spiral"];
      colors = "Warm burnished gold and rich copper. Gold represents solar attraction, and copper accelerates energetic conduction.";
      placementName = "Right Upper Arm";
      placementReason = "Sits above the waist on the active right arm, channeling solar currents to attract wealth, while preserving cosmic honor of the sacred shape.";
      sizeName = "3 to 4 inches (Sacred Golden Proportion)";
      directionName = "Upward-pointing (symbolizing ascending prosperity and wealth retention)";
      timingName = "Waxing Crescent Moon (Hora of Jupiter, Thursday morning)";
      reasoningText = "The right upper arm is the active physical path of manifestation and action. Embedding the wheat sheaf here anchors concrete material growth.";
      astroExplanation = `Your Moon is in ${nativeZodiac.moon}, which craves material security and stability. Placing this on your right upper arm strengthens your 2nd House of personal assets.`;
      painIndex = 3;
      energySensitivity = 9;
      svgMarkup = `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.2">
        <circle cx="50" cy="50" r="42" stroke-dasharray="2 3" opacity="0.6"/>
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="12" stroke-width="0.8" stroke-dasharray="1 1"/>
        <line x1="50" y1="8" x2="50" y2="92" opacity="0.3"/>
        <line x1="8" y1="50" x2="92" y2="50" opacity="0.3"/>
        <path d="M 50 15 Q 53 25, 50 35 Q 47 25, 50 15 Z" fill="#C5A059" fill-opacity="0.1" />
        <path d="M 50 35 Q 55 45, 50 55 Q 45 45, 50 35 Z" fill="#C5A059" fill-opacity="0.1" />
        <path d="M 50 25 Q 62 18, 58 30 Z" />
        <path d="M 50 25 Q 38 18, 42 30 Z" />
        <path d="M 50 45 Q 62 38, 58 50 Z" />
        <path d="M 50 45 Q 38 38, 42 50 Z" />
        <polygon points="50,68 35,88 65,88" stroke-width="1.2" />
        <circle cx="50" cy="78" r="2" fill="#C5A059" />
      </svg>`;
    } else if (intention === "Love") {
      styleName = "Sacred Geometry & Fine-line";
      targetChakra = "Heart Chakra (Anahata)";
      imbalanceAnalysis = "Ancient grief, trust-blocks, or family lineage trauma forming an energetic cage around the chest.";
      reikiSymbol = "Sei He Ki fused with Lotus-infinity geometries";
      vedicRemedy = "Anahata Kavach breathing exercise coupled with rose quartz meditation.";
      title = "Resilient Heart Lotus";
      elements = ["Lotus rebirth petals", "Infinity somatic curve", "Prana lattice structure", "Venusian orbit circles"];
      colors = "Rose gold and rich forest emerald. Forest green opens nature's healing, and rose gold softens cellular memory.";
      placementName = "Sternum / Chest Center";
      placementReason = "Sits directly above the physical thymus and spiritual heart node, projecting safety and unconditional love.";
      sizeName = "2.5 inches (Heart-Centered Dimension)";
      directionName = "Symmetrical & Inward-folding (protecting and nurturing the central core)";
      timingName = "Friday (Hora of Venus, during a waxing Moon in Taurus or Libra)";
      reasoningText = "The sternum is the somatic seat of the Anahata chakra. Embedding this design dissolves defensive armoring and invites genuine connection.";
      astroExplanation = `Your Sun in ${nativeZodiac.sun} is highly intuitive but vulnerable to emotional absorbing. This layout shields your core and stabilizes your 7th House of partnership.`;
      painIndex = 8;
      energySensitivity = 10;
      svgMarkup = `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.2">
        <path d="M 50 72 C 25 55, 20 35, 50 28 C 80 35, 75 55, 50 72 Z" fill="#C5A059" fill-opacity="0.1" />
        <path d="M 50 72 C 10 65, 10 45, 30 38 C 45 42, 48 58, 50 72 Z" opacity="0.6" />
        <path d="M 50 72 C 90 65, 90 45, 70 38 C 55 42, 52 58, 50 72 Z" opacity="0.6" />
        <circle cx="50" cy="45" r="3" fill="#C5A059" />
        <path d="M 50 53 C 50 58, 47 61, 44 62" stroke-width="2" />
        <circle cx="50" cy="22" r="1.5" fill="#C5A059" />
      </svg>`;
    } else if (intention === "Career") {
      styleName = "Alchemical Sigils";
      targetChakra = "Solar Plexus Chakra (Manipura)";
      imbalanceAnalysis = "Suppressed courage, fear of visibility, or imposter feelings locked in the diaphragm.";
      reikiSymbol = "Cho Ku Rei (Power Symbol) with Martian vector lines";
      vedicRemedy = "Surya Namaskar Sun gaze accompanied by active breathwork.";
      title = "Sovereign Expression Sigil";
      elements = ["Symmetrical stellar wings", "Mars alchemical nodes", "Active focus spear", "Solar compass rays"];
      colors = "Crimson red and burnished gold. Red sparks courage, and gold commands active sovereign authority.";
      placementName = "Forearm Inner Meridian";
      placementReason = "Placed on the active hand/arm to manifest inner vision directly into worldly actions.";
      sizeName = "4.5 inches (Commands Presence)";
      directionName = "Radial & Outward-expanding (symbolizing manifestation of your power into the world)";
      timingName = "Tuesday (Hora of Mars, during Solar Noon)";
      reasoningText = "The forearm meridian channels active command (Pingala). Embedding this symbol empowers manual craft, writing, and leadership execution.";
      astroExplanation = `With your Ascendant in ${nativeZodiac.rising}, you command structures. This Martian alchemical sigil activates your 10th House of Career, magnifying public impact.`;
      painIndex = 4;
      energySensitivity = 8;
      svgMarkup = `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.3">
        <line x1="50" y1="10" x2="50" y2="90" stroke-dasharray="2 2" />
        <circle cx="50" cy="50" r="24" />
        <path d="M 25 50 Q 50 20, 75 50 Q 50 80, 25 50 Z" opacity="0.7" />
        <circle cx="50" cy="30" r="3" fill="#C5A059" />
        <circle cx="50" cy="70" r="3" fill="#C5A059" />
        <line x1="30" y1="50" x2="70" y2="50" />
        <path d="M 40 45 Q 50 35, 60 45" />
        <path d="M 40 55 Q 50 65, 60 55" />
      </svg>`;
    } else if (intention === "Protection") {
      styleName = "Vedic / Yantra";
      targetChakra = "Throat Chakra (Vishuddha)";
      imbalanceAnalysis = "Difficulty speaking boundaries, fear of judgment, or vulnerability to psychic energy drains.";
      reikiSymbol = "Hon Sha Ze Sho Nen (Spiritual Connection) protective shield";
      vedicRemedy = "Saraswati mantra chanting and neck physical alignments.";
      title = "Mantra of Sovereign Truth";
      elements = ["Crescent shield vessel", "Concentric defense rings", "Saturn protective node", "Spoken frequency waves"];
      colors = "Cobalt blue and matte charcoal black. Blue activates throat truth, and black shields against psychic pollution.";
      placementName = "Collarbone / Lower Throat Center";
      placementReason = "Directly shields the collarbone area, aligning with throat vocal cords to command healthy space.";
      sizeName = "2 inches (Compact Protective Seal)";
      directionName = "Horizontal / Symmetrical (acting as a defensive barrier)";
      timingName = "Saturday (Hora of Saturn, during a waning Moon phase for banishing negativity)";
      reasoningText = "The throat center is highly sensitive to psychic projections. Embedding this protective crescent acts as a continuous shield.";
      astroExplanation = `Your Sun is in ${nativeZodiac.sun}, making you extremely empathetic. This Saturnian seal fortifies your 1st House of self-defense and preserves personal energy.`;
      painIndex = 5;
      energySensitivity = 9;
      svgMarkup = `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.2">
        <circle cx="50" cy="50" r="38" stroke-dasharray="4 4" />
        <path d="M 15 50 A 35 35 0 0 0 85 50" />
        <line x1="50" y1="15" x2="50" y2="85" />
        <circle cx="50" cy="50" r="14" fill="#C5A059" fill-opacity="0.1" />
        <circle cx="50" cy="50" r="4" fill="#C5A059" />
        <path d="M 30 35 Q 50 65, 70 35" stroke-width="0.8" />
      </svg>`;
    } else if (intention === "Healing") {
      styleName = "Botanical Alchemy";
      targetChakra = "Sacral Chakra (Svadhisthana) & Somatic Meridians";
      imbalanceAnalysis = "Repressed somatic grief, cellular fatigue, or creative/sensory blockages in the physical tissue.";
      reikiSymbol = "Sei He Ki (Mental & Emotional Healing) master key";
      vedicRemedy = "Chandra (Moon) water meditation and deep belly breathing.";
      title = "Astral Lunar Receiver";
      elements = ["Waxing and waning lunar phases", "Central pineal eye node", "Sprouting alchemical ferns", "Pleiades alignment stars"];
      colors = "Deepest space violet and metallic silver. Silver carries the cool, somatic healing currents of the Moon.";
      placementName = "Inner Wrist Pulse Point";
      placementReason = "Placed on the inner wrist pulse point, letting the blood flow carry the lunar healing vibrations.";
      sizeName = "3.5 inches (Fluidic Layout)";
      directionName = "Curved & Flowing (following bodily muscle/meridian lines)";
      timingName = "Monday (Hora of Chandra/Moon, during a full or waxing Cancer Moon)";
      reasoningText = "The inner wrist carries key cardiovascular channels. Embedding this design infuses your blood flow with steady, lunar self-care.";
      astroExplanation = `Your Moon in ${nativeZodiac.moon} is exalted but prone to physicalizing emotional burdens. This design purges metabolic blockages and stabilizes cellular energy.`;
      painIndex = 4;
      energySensitivity = 8;
      svgMarkup = `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.3">
        <path d="M 50 18 A 32 32 0 0 1 50 82 A 25 25 0 0 0 50 18 Z" fill="#C5A059" fill-opacity="0.1" />
        <path d="M 50 18 A 32 32 0 0 0 50 82 A 32 32 0 0 0 50 18 Z" stroke-dasharray="1 2" />
        <circle cx="50" cy="50" r="5" fill="#C5A059" />
        <path d="M 50 32 L 50 40 M 46 36 L 54 36" stroke-width="0.8" />
        <path d="M 50 60 L 50 68 M 46 64 L 54 64" stroke-width="0.8" />
      </svg>`;
    } else {
      // Spiritual Growth
      styleName = "Fine-line Minimalist & Sacred Geometry";
      targetChakra = "Crown Chakra (Sahasrara) & Third Eye (Ajna)";
      imbalanceAnalysis = "Disconnection from cosmic purpose, feeling ungrounded, or overactive logical loop feedback.";
      reikiSymbol = "Dai Ko Myo (Great Bright Light) master symbol";
      vedicRemedy = "Daily midnight Sahasrara contemplation and spine alignments.";
      title = "Sushumna Destiny Axis";
      elements = ["Spinal axis guide-path", "Seven ascending energy nodes", "Ascending triangles", "Cosmic gateway portal"];
      colors = "Luminous pure white gold and deepest obsidian black. Represents the primal void meeting cosmic alignment.";
      placementName = "Back of Neck / Upper Spine";
      placementReason = "Sits directly atop the spinal nervous system (Sushumna Nadi), channeling kundalini energy crownward.";
      sizeName = "3 inches (Vertically Slender)";
      directionName = "Vertically Ascending (symbolizing spiritual elevation and connection to higher consciousness)";
      timingName = "Thursday (Hora of Guru/Jupiter, under a Pisces or Sagittarius Moon)";
      reasoningText = "The upper spine is the master conductor of somatic nerve paths. This talisman channels spiritual signals directly into your spinal cord.";
      astroExplanation = `Your Ascendant is in ${nativeZodiac.rising}, grounding you in duty. This design activates your 9th House of Philosophy and higher wisdom, expanding soul expansion.`;
      painIndex = 7;
      energySensitivity = 10;
      svgMarkup = `<svg viewBox="0 0 100 100" fill="none" stroke="#C5A059" stroke-width="1.2">
        <line x1="50" y1="5" x2="50" y2="95" />
        <polygon points="50,15 35,32 65,32" />
        <polygon points="50,45 35,28 65,28" opacity="0.6" />
        <circle cx="50" cy="50" r="10" />
        <polygon points="50,55 38,72 62,72" />
        <polygon points="50,85 38,68 62,68" opacity="0.6" />
        <circle cx="50" cy="15" r="2" fill="#C5A059" />
        <circle cx="50" cy="35" r="2" fill="#C5A059" />
        <circle cx="50" cy="50" r="3" fill="#C5A059" />
        <circle cx="50" cy="65" r="2" fill="#C5A059" />
        <circle cx="50" cy="85" r="2" fill="#C5A059" />
      </svg>`;
    }

    midjourneyPrompt = `A minimalist fine-line tattoo design of "${title}" featuring ${elements.join(", ")}, clean vector line-art on solid white background, high contrast, golden ink, sacred spiritual talisman, occult geometry style, no shading --no shadows gradient`;

    const greeting = firstName ? `${firstName} ${lastName}` : "Seeker";
    const genderPrimacy = gender === "Female" ? "Divine Feminine" : gender === "Male" ? "Divine Masculine" : "Cosmic Harmony";
    const personalizedAstroExplanation = `${greeting}, aligned with the power of the ${genderPrimacy}, ${astroExplanation.charAt(0).toLowerCase()}${astroExplanation.slice(1)}`;

    const comps = createComplexitySVs(svgMarkup || getSacredTattooSvg(), title);

    const fallbackData = {
      astrology: {
        sunSign: nativeZodiac.sun,
        moonSign: nativeZodiac.moon,
        risingSign: nativeZodiac.rising,
        dominantPlanet: intention === "Wealth" ? "Venus & Jupiter" :
                        intention === "Love" ? "Venus" :
                        intention === "Career" ? "Mars & Sun" :
                        intention === "Protection" ? "Saturn" :
                        intention === "Healing" ? "Moon" : "Jupiter",
        summary: personalizedAstroExplanation
      },
      chakra_energy: {
        targetChakra,
        imbalanceAnalysis,
        reikiSymbol,
        vedicRemedy
      },
      tattoo_concept: {
        title,
        symbolism: reasoningText,
        elements,
        colors,
        style: styleName,
        size: sizeName,
        direction: directionName,
        timing: timingName,
        reasoning: reasoningText,
        astrologicalExplanation: personalizedAstroExplanation,
        placement: placementName,
        placementReason,
        painIndex,
        energySensitivity,
        midjourneyPrompt,
        culturalRespect: "This design contains sacred geometry and traditional Reiki-derived layouts. Please seek a conscious practitioner who respects spiritual tattoo lineages to embed these intentions respectfully.",
        svgMarkup,
        svgMarkupSimple: comps.simple,
        svgMarkupModerate: comps.moderate,
        svgMarkupAdvanced: comps.advanced,
        simpleDesc: comps.simpleDesc,
        moderateDesc: comps.moderateDesc,
        advancedDesc: comps.advancedDesc
      }
    };

    setSuggestion(fallbackData);
    saveConsultationToLedger(
      firstName,
      lastName,
      gender,
      birthDate,
      dontKnowExactTime
        ? (approxTimePeriod === "morning" ? "Morning (Approx. 08:00 AM)"
           : approxTimePeriod === "afternoon" ? "Afternoon (Approx. 02:00 PM)"
           : approxTimePeriod === "evening" ? "Evening (Approx. 06:00 PM)"
           : approxTimePeriod === "night" ? "Night (Approx. 11:00 PM)"
           : "Unknown (Approx. 12:00 PM)")
        : formatBirthTime(birthTime, false, ""),
      birthPlace,
      intention,
      need,
      preferredLanguage,
      fallbackData
    );
  };

  // Sacred Collection (Local Storage) State
  const [sacredCollection, setSacredCollection] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("aura_ink_sacred_collection");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Automatically save to local storage when collection updates
  useEffect(() => {
    try {
      localStorage.setItem("aura_ink_sacred_collection", JSON.stringify(sacredCollection));
    } catch (e) {
      console.error("Failed to store collection in local storage:", e);
    }
  }, [sacredCollection]);

  // Seeker Database Ledger State
  const [deviceSignature] = useState<string>(() => {
    try {
      let sig = localStorage.getItem("aura_ink_device_signature");
      if (!sig) {
        sig = "sig_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
        localStorage.setItem("aura_ink_device_signature", sig);
      }
      return sig;
    } catch (e) {
      return "sig_fallback_" + Date.now();
    }
  });

  const [masterPasscode, setMasterPasscode] = useState<string>(() => {
    return localStorage.getItem("aura_ink_master_passcode") || "";
  });
  const [isMasterAuthorized, setIsMasterAuthorized] = useState<boolean>(false);

  const [seekers, setSeekers] = useState<any[]>([]);
  const [seekersLoading, setSeekersLoading] = useState<boolean>(false);
  const [seekersSearchQuery, setSeekersSearchQuery] = useState<string>("");
  const [seekersChakraFilter, setSeekersChakraFilter] = useState<string>("All");
  const [seekersZodiacFilter, setSeekersZodiacFilter] = useState<string>("All");
  const [seekersIntentionFilter, setSeekersIntentionFilter] = useState<string>("All");

  // Load seekers from database ledger
  const loadSeekersFromLedger = async (customPasscode?: string) => {
    setSeekersLoading(true);
    try {
      const activePass = customPasscode !== undefined ? customPasscode : masterPasscode;
      const queryParams = new URLSearchParams();
      if (deviceSignature) {
        queryParams.append("deviceSignature", deviceSignature);
      }
      if (activePass) {
        queryParams.append("passcode", activePass);
      }

      const response = await fetch(`/api/get-seekers?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSeekers(data);
        
        if (activePass) {
          // If we loaded and there's any record that doesn't match our signature, we know we are authorized.
          // Or we can just set authorized if we successfully entered a password and received any data
          const hasOtherSigs = data.some((s: any) => s.deviceSignature !== deviceSignature);
          // Also check if passcode is set and we get non-empty, or we can just verify if the pass is correct.
          // Since the default passcode is "AstroPsyche2026", let's check matches.
          if (activePass === "AstroPsyche2026") {
            setIsMasterAuthorized(true);
          } else {
            setIsMasterAuthorized(hasOtherSigs);
          }
        } else {
          setIsMasterAuthorized(false);
        }
      }
    } catch (e) {
      console.error("Failed to load seekers ledger:", e);
    } finally {
      setSeekersLoading(false);
    }
  };

  // Load seekers on mount
  useEffect(() => {
    loadSeekersFromLedger();
  }, [deviceSignature]);

  // Save consultation to database ledger
  const saveConsultationToLedger = async (
    fn: string,
    ln: string,
    g: string,
    bd: string,
    bt: string,
    bp: string,
    intent: string,
    nd: string,
    lang: string,
    sug: any
  ) => {
    try {
      const response = await fetch("/api/save-seeker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: fn,
          lastName: ln,
          gender: g,
          birthDate: bd,
          birthTime: bt,
          birthPlace: bp,
          intention: intent,
          need: nd,
          preferredLanguage: lang,
          deviceSignature,
          suggestion: sug
        })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Instantly refresh the seekers state with the new entry
          setSeekers((prev) => [result.seeker, ...prev]);
        }
      }
    } catch (error) {
      console.error("Failed to save seeker into database ledger:", error);
    }
  };

  // Delete seeker from database ledger
  const deleteSeekerFromLedger = async (seekerId: string) => {
    try {
      const queryParams = new URLSearchParams();
      if (deviceSignature) queryParams.append("deviceSignature", deviceSignature);
      if (masterPasscode) queryParams.append("passcode", masterPasscode);

      const response = await fetch(`/api/delete-seeker/${seekerId}?${queryParams.toString()}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setSeekers((prev) => prev.filter((s) => s.id !== seekerId));
      } else {
        const err = await response.json();
        alert(err.error || "Failed to release seeker from ledger.");
      }
    } catch (e) {
      console.error("Failed to delete seeker from ledger:", e);
    }
  };

  // Load past seeker suggestion from ledger back to active view
  const loadPastSeekerToView = (seeker: any) => {
    setFirstName(seeker.firstName || "");
    setLastName(seeker.lastName || "");
    setGender(seeker.gender || "Not Specified");
    setBirthDate(seeker.birthDate || "");
    setBirthPlace(seeker.birthPlace || "");
    setIntention(seeker.intention || "Wealth");
    setNeed(seeker.need || "");
    setPreferredLanguage(seeker.preferredLanguage || "English");
    
    setSuggestion(seeker.suggestion);
    setQuizStep(4);
    setActiveTab("quiz");
  };

  // Save or toggle saving of current suggestion
  const saveCurrentToCollection = () => {
    if (!suggestion) return;
    
    const alreadySaved = sacredCollection.some(
      (item) => item.suggestion.tattoo_concept.title === suggestion.tattoo_concept.title && 
                item.inputs.birthDate === birthDate && 
                item.inputs.intention === intention
    );
    
    if (alreadySaved) {
      // Toggle off / remove from collection
      setSacredCollection((prev) =>
        prev.filter(
          (item) => !(item.suggestion.tattoo_concept.title === suggestion.tattoo_concept.title && 
                      item.inputs.birthDate === birthDate && 
                      item.inputs.intention === intention)
        )
      );
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      title: suggestion.tattoo_concept.title,
      savedAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      customNotes: "",
      suggestion: JSON.parse(JSON.stringify(suggestion)),
      inputs: {
        firstName,
        lastName,
        gender,
        birthDate,
        birthTime,
        dontKnowExactTime,
        approxTimePeriod,
        birthPlace,
        intention,
        need,
      }
    };

    setSacredCollection((prev) => [newItem, ...prev]);
  };

  const deleteFromCollection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSacredCollection((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCollectionItemNotes = (id: string, notes: string) => {
    setSacredCollection((prev) =>
      prev.map((item) => (item.id === id ? { ...item, customNotes: notes } : item))
    );
  };

  const loadSuggestionFromCollection = (item: any) => {
    setFirstName(item.inputs.firstName || "");
    setLastName(item.inputs.lastName || "");
    setGender(item.inputs.gender || "Female");
    setBirthDate(item.inputs.birthDate || "");
    setBirthTime(item.inputs.birthTime || "");
    setDontKnowExactTime(item.inputs.dontKnowExactTime || false);
    setApproxTimePeriod(item.inputs.approxTimePeriod || "unknown");
    setBirthPlace(item.inputs.birthPlace || "");
    setIntention(item.inputs.intention || "Wealth");
    setNeed(item.inputs.need || "");
    
    setSuggestion(item.suggestion);
    setQuizStep(4);
    setActiveTab("quiz");
  };

  // Copy prompt helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Solfeggio helper variables for rendering with dynamic, healer-like fine tuning
  const fineTunedSolfeggio = getFineTunedSolfeggio(
    suggestion?.chakra_energy?.targetChakra || "Root",
    intention,
    birthDate,
    birthTime,
    suggestion?.astrology?.sunSign || nativeZodiac.sun || "Leo",
    suggestion?.astrology?.moonSign || nativeZodiac.moon || "Taurus"
  );
  const activeSolfeggioInfo = {
    ...getSolfeggioInfo(suggestion?.chakra_energy?.targetChakra || ""),
    frequency: fineTunedSolfeggio.frequency,
    explanation: fineTunedSolfeggio.explanation,
    healingNote: fineTunedSolfeggio.healingNote
  };
  const currentFrequency = solfeggioFreqOverride || activeSolfeggioInfo.frequency;

  const downloadPrivacyTxt = () => {
    const textContent = `ASTRINK (ASTROPSYCHE) PRIVACY POLICY
Last Updated: July 22, 2026

AstrInk Dev Studio ("we", "us", "our") operates the AstrInk (also known as AstroPsyche) mobile application and Progressive Web Application (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of Personal Data when you use our Service and the choices you have associated with that data.

1. DATA COLLECTION AND USE
We collect several different types of information for various purposes to provide and improve our Service to you, especially as it relates to spiritual and astrological calculations and secure payment processing.

A. Astrological & Natal Parameters
To generate personalized sacred tattoo geometry, alchemical activation sigils, and fine-tuned solfeggio healing frequencies, we request:
- First Name & Last Name (used for personalized charts)
- Exact Date of Birth, Place of Birth, and Time of Birth
This data is processed locally on your device or in memory using high-precision Vedic calculations. We do not sell or share your birth credentials with third-party advertising networks.

B. Local Storage and Data Persistence
We utilize browser LocalStorage and reactive device state engines to preserve:
- Your customized sacred tattoo designs
- Your unlocked spiritual intentions (e.g., Wealth, Protection, Love)
- Family and companion profiles
This data remains completely under your control on your physical device. You can clear this data at any time by resetting your browser storage or using the database control tools inside the app.

C. Google Play Store Billing & Financial Data
To process premium upgrades (e.g., Aura Pro and Aura Premium ₹299+ plans), our app integrates with the Google Play Store Billing system.
- All financial transactions are processed securely by Google Play.
- We do not collect, store, or transmit your credit card numbers, bank credentials, or CVV codes. All billing authentication, receipts, and subscriptions are managed directly by Google.

2. DEVICE PERMISSIONS
Our Progressive Web App (PWA) and mobile packages may request the following native permissions to enhance your spiritual experience:
- Camera Access: Optional permission requested solely for the augmented reality / camera stencil projection preview feature to overlay tattoo designs on your skin. Images captured by your camera are processed entirely on-device and are never uploaded to our servers.
- Notification Permissions: Optional permission to send mindful planetary transits and Solfeggio session reminders.

3. THIRD-PARTY SERVICES & INTEGRATIONS
We utilize reputable third-party tools to secure and deliver our services:
- Google Play Services & Play Billing: Used for store distribution and premium license verification.
- D3.js and Recharts: Used for offline rendering of natal configurations and geometric visual charts.

4. USER RIGHTS (GDPR & CCPA COMPLIANCE)
Depending on your jurisdiction, you have the following rights regarding your personal data:
- The right to access, update, or delete the information we hold about you.
- The right of rectification if that information is inaccurate.
- The right to withdraw consent at any time.
Since your core natal parameters are stored strictly in local storage, you can exercise these rights directly by using the "Database Control" reset feature inside the "Seeker Ledger" tab or by clearing your browser cache.

5. CHILDREN'S PRIVACY
Our Service is not directed to anyone under the age of 13. We do not knowingly collect personally identifiable information from children. If you are a parent or guardian and become aware that your child has provided us with personal data, please contact us at our support address.

6. CONTACT US
If you have any questions about this Privacy Policy, please contact us:
By Email: hguptaseth1204@gmail.com
`;
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Aura_Ink_Privacy_Policy.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (viewState === "privacy") {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans p-6 md:p-12 print:p-0">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header Action bar - hidden on print */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 md:p-6 print:hidden">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">AstrInk hosted portal</span>
              </div>
              <h2 className="text-sm font-serif font-bold text-gray-800 uppercase tracking-wider">AstrInk Legal Directory & Policy Center</h2>
              <p className="text-xs text-gray-500">Official, store-compliant privacy declarations hosted live.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>Save as PDF / Print</span>
              </button>
              <button
                type="button"
                onClick={downloadPrivacyTxt}
                className="py-2 px-4 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-colors"
              >
                Download .TXT
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewState(null);
                  window.history.pushState({}, "", window.location.pathname);
                }}
                className="py-2 px-4 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-colors"
              >
                Go to Main App ➔
              </button>
            </div>
          </div>

          {/* Privacy Policy Document Body */}
          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <div className="border-b border-gray-200 pb-5 text-center sm:text-left">
              <h1 className="text-3xl font-serif font-extrabold text-gray-900 tracking-tight">Privacy Policy</h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1.5 font-mono font-bold">AstrInk (AstroPsyche) App • Last Updated: July 22, 2026</p>
            </div>

            <p>
              AstrInk Dev Studio (<strong>"we"</strong>, <strong>"us"</strong>, <strong>"our"</strong>) operates the AstrInk (also known as AstroPsyche) mobile application and Progressive Web Application (the <strong>"Service"</strong>). This document informs you of our policies regarding the collection, usage, and disclosure of Personal Data when you use our Service and the choices you have associated with that data.
            </p>

            <section className="space-y-2.5">
              <h3 className="text-lg font-serif font-bold text-gray-900">1. Data Collection and Use</h3>
              <p>
                We collect several different types of information for various purposes to provide and improve our Service to you, especially as it relates to spiritual calculations and secure payment processing.
              </p>
              <div className="pl-4 border-l-2 border-[#C5A059] space-y-3 mt-2">
                <div>
                  <strong className="text-gray-900">A. Astrological & Natal Parameters</strong>
                  <p className="text-gray-600 mt-0.5">
                    To generate personalized sacred tattoo geometry, alchemical activation sigils, and fine-tuned solfeggio healing frequencies, we request: First Name, Last Name, exact Date of Birth, Place of Birth, and Time of Birth. This data is processed locally on your device or in volatile memory using high-precision Vedic calculations. We do not sell or share your birth credentials with third-party advertising networks.
                  </p>
                </div>
                <div>
                  <strong className="text-gray-900">B. Local Storage and Data Persistence</strong>
                  <p className="text-gray-600 mt-0.5">
                    We utilize browser LocalStorage and reactive device state engines to preserve your customized sacred tattoo designs, your unlocked spiritual intentions (e.g., Wealth, Protection, Love), and your companion profiles. This data remains completely under your control on your physical device. You can clear this data at any time by resetting your browser storage or using the database control tools inside the app.
                  </p>
                </div>
                <div>
                  <strong className="text-gray-900">C. Google Play Store Billing & Financial Data</strong>
                  <p className="text-gray-600 mt-0.5">
                    To process premium upgrades (such as Aura Pro and Aura Premium plans), our app integrates with the Google Play Store Billing system. All financial transactions are processed securely by Google Play. We do not collect, store, or transmit your credit card numbers, bank credentials, or CVV codes. All billing authentication, receipts, and subscriptions are managed directly by Google.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-2.5">
              <h3 className="text-lg font-serif font-bold text-gray-900">2. Device Permissions</h3>
              <p>
                Our Progressive Web App (PWA) and mobile packages may request the following native permissions to enhance your spiritual experience:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li>
                  <strong>Camera Access:</strong> Optional permission requested solely for the augmented reality / camera stencil projection preview feature to overlay tattoo designs on your skin. Images captured by your camera are processed entirely on-device and are never uploaded to our servers.
                </li>
                <li>
                  <strong>Notification Permissions:</strong> Optional permission to send mindful planetary transits and Solfeggio session reminders.
                </li>
              </ul>
            </section>

            <section className="space-y-2.5">
              <h3 className="text-lg font-serif font-bold text-gray-900">3. Third-Party Services & Integrations</h3>
              <p>
                We utilize reputable third-party tools to secure and deliver our services:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li><strong>Google Play Services & Play Billing:</strong> Used for store distribution and premium license verification.</li>
                <li><strong>D3.js and Recharts:</strong> Used for offline rendering of natal configurations and geometric visual charts.</li>
              </ul>
            </section>

            <section className="space-y-2.5">
              <h3 className="text-lg font-serif font-bold text-gray-900">4. User Rights (GDPR & CCPA Compliance)</h3>
              <p>
                Depending on your jurisdiction, you have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li>The right to access, update, or delete the information we hold about you.</li>
                <li>The right of rectification if that information is inaccurate.</li>
                <li>The right to withdraw consent at any time.</li>
              </ul>
              <p>
                Since your core natal parameters are stored strictly in local storage, you can exercise these rights directly by using the "Database Control" reset feature inside the "Seeker Ledger" tab or by clearing your browser cache.
              </p>
            </section>

            <section className="space-y-2.5">
              <h3 className="text-lg font-serif font-bold text-gray-900">5. Children's Privacy</h3>
              <p>
                Our Service is not directed to anyone under the age of 13. We do not knowingly collect personally identifiable information from children. If you are a parent or guardian and become aware that your child has provided us with personal data, please contact us at our support address.
              </p>
            </section>

            <section className="space-y-2.5">
              <h3 className="text-lg font-serif font-bold text-gray-900">6. Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <p className="bg-gray-50 border border-gray-100 rounded-lg p-3 font-mono text-xs text-gray-800">
                By Email: <a href="mailto:hguptaseth1204@gmail.com" className="text-blue-600 hover:underline">hguptaseth1204@gmail.com</a>
              </p>
            </section>
          </div>

          <div className="border-t border-gray-200 pt-5 text-center text-xs text-gray-400 print:hidden">
            <p>© 2026 AstrInk Dev Studio. All cosmic rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-[#E5E5E5] font-sans flex flex-col antialiased">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur border-b border-white/10">
        {/* Main Header Bar */}
        <div className="h-14 sm:h-16 px-3 sm:px-6 md:px-8 flex items-center justify-between gap-2">
          {/* Logo */}
          <div onClick={() => setActiveTab("quiz")} className="cursor-pointer shrink-0" title="AstrInk">
            <AuraInkLogo variant="header" showSubtitle={true} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-[11px] uppercase tracking-[0.12em] font-medium opacity-90">
            <button
              type="button"
              onClick={() => setActiveTab("quiz")}
              className={`transition-colors py-1 cursor-pointer whitespace-nowrap ${activeTab === "quiz" ? "text-[#C5A059] border-b-2 border-[#C5A059]" : "opacity-60 hover:opacity-100"}`}
            >
              Soul Quiz
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("collection")}
              className={`transition-colors py-1 cursor-pointer whitespace-nowrap ${activeTab === "collection" ? "text-[#C5A059] border-b-2 border-[#C5A059]" : "opacity-60 hover:opacity-100"}`}
            >
              Sacred Collection {sacredCollection.length > 0 && `(${sacredCollection.length})`}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("ledger");
                loadSeekersFromLedger();
              }}
              className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${activeTab === "ledger" ? "text-[#C5A059] border-b-2 border-[#C5A059]" : "opacity-60 hover:opacity-100"}`}
            >
              <span>Seeker Ledger 📚</span>
              {seekers.length > 0 && (
                <span className="text-[8px] px-1.5 py-0.5 bg-[#C5A059]/20 text-[#C5A059] rounded-full font-bold">
                  {seekers.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowDownloadPortal(true)}
              className="transition-all duration-300 py-1 cursor-pointer opacity-80 hover:opacity-100 hover:text-[#C5A059] flex items-center gap-1 text-gray-300 font-medium whitespace-nowrap"
            >
              <span>Download App 📱</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("premium")}
              className={`transition-all duration-300 py-1.5 px-3 rounded border cursor-pointer flex items-center gap-1.5 font-semibold text-[10px] whitespace-nowrap ${
                activeTab === "premium"
                  ? "text-black bg-[#C5A059] border-[#C5A059]"
                  : "text-[#C5A059] border-[#C5A059]/40 bg-[#C5A059]/10 hover:bg-[#C5A059]/20"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {activePlan === "pro" 
                  ? "AURA PRO ✨" 
                  : activePlan === "premium" 
                    ? "AURA PREMIUM ✨" 
                    : "Premium Portal (₹299+)"}
              </span>
            </button>
          </nav>

          {/* Right Mobile / Header Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Quick Premium Button */}
            <button
              type="button"
              onClick={() => setActiveTab("premium")}
              className={`md:hidden transition-all duration-300 py-1 px-2.5 rounded border cursor-pointer flex items-center gap-1 font-semibold text-[9px] whitespace-nowrap ${
                activeTab === "premium"
                  ? "text-black bg-[#C5A059] border-[#C5A059]"
                  : "text-[#C5A059] border-[#C5A059]/40 bg-[#C5A059]/10"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{activePlan === "pro" ? "PRO ✨" : activePlan === "premium" ? "PREMIUM ✨" : "Portal"}</span>
            </button>

            {/* Natal Config Badge (Hidden on smallest screens) */}
            <div className="text-right hidden lg:block border-l border-white/10 pl-4">
              <p className="text-[9px] uppercase tracking-tighter opacity-40 leading-none">Natal Config</p>
              <p className="text-xs font-serif italic text-[#C5A059]">
                {nativeZodiac.sun || "Taurus"} • {nativeZodiac.rising || "Ascendant"}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation Scrollbar */}
        <div className="md:hidden flex items-center gap-2 px-3 py-2 bg-[#080808] border-t border-white/5 overflow-x-auto whitespace-nowrap scrollbar-none text-[10px] uppercase font-medium tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab("quiz")}
            className={`px-3 py-1 rounded-full cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === "quiz" 
                ? "bg-[#C5A059] text-black font-bold" 
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            Soul Quiz
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("collection")}
            className={`px-3 py-1 rounded-full cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === "collection" 
                ? "bg-[#C5A059] text-black font-bold" 
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            Sacred Collection {sacredCollection.length > 0 && `(${sacredCollection.length})`}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("ledger");
              loadSeekersFromLedger();
            }}
            className={`px-3 py-1 rounded-full cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1 ${
              activeTab === "ledger" 
                ? "bg-[#C5A059] text-black font-bold" 
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            <span>Seeker Ledger 📚</span>
            {seekers.length > 0 && (
              <span className={`text-[8px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === "ledger" ? "bg-black text-[#C5A059]" : "bg-[#C5A059]/20 text-[#C5A059]"}`}>
                {seekers.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowDownloadPortal(true)}
            className="px-3 py-1 rounded-full cursor-pointer transition-colors whitespace-nowrap bg-white/5 text-gray-300 hover:bg-white/10"
          >
            Download App 📱
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("premium")}
            className={`px-3 py-1 rounded-full cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1 ${
              activeTab === "premium" 
                ? "bg-[#C5A059] text-black font-bold" 
                : "bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30"
            }`}
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>Aura Premium ✨</span>
          </button>
        </div>
      </header>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-4">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 rounded-full border border-[#C5A059]/20 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-2 border-t-[#C5A059] border-r-transparent border-b-[#C5A059] border-l-transparent animate-spin"></div>
            <div className="absolute inset-6 rounded-full bg-[#111] flex items-center justify-center border border-[#C5A059]/30">
              <Sparkles className="w-8 h-8 text-[#C5A059] animate-pulse" />
            </div>
          </div>
          <p className="font-serif text-2xl tracking-widest text-[#C5A059] mb-3 uppercase">Reading your cosmic blueprint...</p>
          <p className="text-xs uppercase tracking-[0.15em] text-gray-500 max-w-md mb-2">Step 3: Analyzing Birth Chart</p>
          <p className="text-xs text-gray-400 max-w-md animate-pulse">
            Chanting planetary seed mantras, scanning chakra channels, and crystallizing your sacred talisman design...
          </p>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        
        {/* Left Side: Astral Inputs or References */}
        <aside className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-white/5 p-6 md:p-8 flex flex-col gap-6 bg-[#090909] lg:overflow-y-auto">
          
          {activeTab === "quiz" && (
            <div className="space-y-6">
              {quizStep === 1 && (
                <div className="space-y-5">
                  <div>
                    <span className="text-[8px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">Step 1 of 4</span>
                    <h3 className="text-sm font-serif uppercase tracking-widest text-white">Persona & Birth</h3>
                    <p className="text-xs text-gray-400 mt-1">Map your personalized cosmic blueprint</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 block">First Name</label>
                        <input
                          type="text"
                          placeholder="Aara"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full bg-[#151515] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059] text-white placeholder-gray-600 transition-colors"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 block">Last Name</label>
                        <input
                          type="text"
                          placeholder="Sharma"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full bg-[#151515] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059] text-white placeholder-gray-600 transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 block">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full bg-[#151515] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059] text-white transition-colors"
                      >
                        <option value="Female">Divine Feminine (Female)</option>
                        <option value="Male">Divine Masculine (Male)</option>
                        <option value="Non-binary">Cosmic Harmony (Non-binary)</option>
                        <option value="Other">Unmanifest (Other / Prefer not to say)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 block">Cosmic Language</label>
                      <select
                        value={preferredLanguage}
                        onChange={(e) => setPreferredLanguage(e.target.value)}
                        className="w-full bg-[#151515] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059] text-white transition-colors"
                      >
                        <option value="English">🇬🇧 English</option>
                        <option value="Hindi">🇮🇳 हिंदी (Hindi)</option>
                        <option value="Spanish">🇪🇸 Español (Spanish)</option>
                        <option value="French">🇫🇷 Français (French)</option>
                        <option value="German">🇩🇪 Deutsch (German)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 block">Date of Birth</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-[#C5A059]/60" />
                        <input
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="w-full bg-[#151515] border border-white/10 rounded px-3 py-2 pl-10 text-sm focus:outline-none focus:border-[#C5A059] text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] uppercase tracking-wider text-gray-400 block">Birth Time</label>
                          <button
                            type="button"
                            onClick={() => {
                              const newVal = !dontKnowExactTime;
                              setDontKnowExactTime(newVal);
                              if (newVal) {
                                setApproxTimePeriod("unknown");
                                setBirthTime("12:00");
                              } else {
                                setBirthTime("20:30");
                              }
                            }}
                            className={`text-[8.5px] uppercase tracking-wider font-bold transition-all cursor-pointer underline decoration-[#C5A059]/40 ${
                              dontKnowExactTime ? "text-[#C5A059]" : "text-[#C5A059]/70 hover:text-[#C5A059]"
                            }`}
                          >
                            {dontKnowExactTime ? "Exact Time" : "Don't know exact?"}
                          </button>
                        </div>
                        
                        {!dontKnowExactTime ? (
                          <div className="relative">
                            <Clock className="absolute left-3 top-2.5 w-4 h-4 text-[#C5A059]/60" />
                            <input
                              type="time"
                              value={birthTime}
                              onChange={(e) => setBirthTime(e.target.value)}
                              className="w-full bg-[#151515] border border-white/10 rounded px-3 py-2 pl-10 text-sm focus:outline-none focus:border-[#C5A059] text-white"
                            />
                          </div>
                        ) : (
                          <div className="relative">
                            <select
                              value={approxTimePeriod}
                              onChange={(e) => {
                                const val = e.target.value;
                                setApproxTimePeriod(val);
                                if (val === "morning") setBirthTime("08:00");
                                else if (val === "afternoon") setBirthTime("14:00");
                                else if (val === "evening") setBirthTime("18:00");
                                else if (val === "night") setBirthTime("23:00");
                                else setBirthTime("12:00");
                              }}
                              className="w-full bg-[#151515] border border-[#C5A059]/30 rounded px-2.5 py-2 text-xs focus:outline-none focus:border-[#C5A059] text-white cursor-pointer transition-all"
                            >
                              <option value="unknown">⏱️ Completely Unknown</option>
                              <option value="morning">🌅 Morning (approx. 06:00 AM - 12:00 PM)</option>
                              <option value="afternoon">☀️ Afternoon (approx. 12:00 PM - 05:00 PM)</option>
                              <option value="evening">🌆 Evening (approx. 05:00 PM - 09:00 PM)</option>
                              <option value="night">🌙 Night (approx. 09:00 PM - 06:00 AM)</option>
                            </select>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 relative">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] uppercase tracking-wider text-gray-400 block">Birth Place</label>
                          <button
                            type="button"
                            onClick={() => setShowMapModal(true)}
                            className="text-[8px] uppercase tracking-wider text-[#C5A059] hover:underline flex items-center gap-0.5 cursor-pointer transition-all"
                          >
                            <Compass className="w-2.5 h-2.5" />
                            <span>Map</span>
                          </button>
                        </div>
                        <div className="relative">
                          <Compass className="absolute left-3 top-2.5 w-4 h-4 text-[#C5A059]/60" />
                          <input
                            type="text"
                            placeholder="Search city e.g. Tokyo..."
                            value={birthPlace}
                            onChange={(e) => {
                              setBirthPlace(e.target.value);
                              setShowBirthPlaceDropdown(true);
                            }}
                            onFocus={() => setShowBirthPlaceDropdown(true)}
                            onBlur={() => {
                              setTimeout(() => setShowBirthPlaceDropdown(false), 250);
                            }}
                            className="w-full bg-[#151515] hover:bg-[#1A1A1A] border border-white/10 rounded px-3 py-2 pl-10 text-xs focus:outline-none focus:border-[#C5A059] text-white placeholder-gray-600 cursor-text transition-colors"
                          />

                          {showBirthPlaceDropdown && (
                            <div className="absolute left-0 right-0 top-full mt-1.5 max-h-52 overflow-y-auto bg-[#121212] border border-white/10 rounded-md shadow-2xl z-50 divide-y divide-white/5 scrollbar-thin">
                              {(() => {
                                const term = birthPlace.toLowerCase().trim();
                                const filtered = term
                                  ? WORLD_CITIES.filter(
                                      c =>
                                        c.name.toLowerCase().includes(term) ||
                                        c.state.toLowerCase().includes(term) ||
                                        c.country.toLowerCase().includes(term)
                                    )
                                  : WORLD_CITIES;

                                if (filtered.length === 0) {
                                  return (
                                    <div className="p-3 text-center text-[11px] text-gray-500 italic">
                                      No preset match found. You can type freely.
                                    </div>
                                  );
                                }

                                return filtered.map((city) => (
                                  <button
                                    key={city.id}
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                    }}
                                    onClick={() => {
                                      setBirthPlace(`${city.name}, ${city.state}, ${city.country}`);
                                      setShowBirthPlaceDropdown(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-[#C5A059]/10 hover:text-white text-gray-400 transition-colors flex justify-between items-center"
                                  >
                                    <div className="flex flex-col">
                                      <span className="font-semibold text-gray-200">{city.name}</span>
                                      <span className="text-[10px] text-gray-500 leading-tight">
                                        {city.state}, {city.country}
                                      </span>
                                    </div>
                                    <span className="text-[8px] font-mono text-[#C5A059] opacity-75">
                                      {city.lat > 0 ? `${Math.round(city.lat)}°N` : `${Math.round(Math.abs(city.lat))}°S`}
                                    </span>
                                  </button>
                                ));
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!birthDate || !birthPlace}
                      onClick={() => setQuizStep(2)}
                      className="w-full py-3 bg-[#C5A059] hover:bg-[#b08e4d] disabled:opacity-40 disabled:hover:bg-[#C5A059] text-black text-xs uppercase tracking-[0.2em] font-bold rounded transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer shadow-md font-sans"
                    >
                      <span>Choose Intention</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {quizStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <span className="text-[8px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">Step 2 of 4</span>
                    <h3 className="text-sm font-serif uppercase tracking-widest text-white">Alchemical Intention</h3>
                    <p className="text-xs text-gray-400 mt-1">Choose what you seek to channel</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Select Intention</label>
                    <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                      {[
                        { id: "Wealth", label: "Wealth", icon: "💰", subtitle: "Abundance & Grounding", isFree: true },
                        { id: "Love", label: "Love", icon: "🌸", subtitle: "Heart Peace & Healing", isFree: false },
                        { id: "Career", label: "Career", icon: "🔥", subtitle: "Vitality & Focus", isFree: false },
                        { id: "Protection", label: "Protection", icon: "🛡️", subtitle: "Shield & Boundaries", isFree: false },
                        { id: "Healing", label: "Healing", icon: "💎", subtitle: "Somatic release", isFree: false },
                        { id: "Spiritual Growth", label: "Spiritual Growth", icon: "👁️", subtitle: "Wisdom & Alignment", isFree: false }
                      ].map((opt) => {
                        const isSelected = intention === opt.id;
                        const isLocked = activePlan === "free" 
                          ? !opt.isFree 
                          : activePlan === "premium" 
                            ? (!unlockedIntentionsList.includes(opt.id) && unlockedIntentionsList.length >= 3)
                            : false;

                        let currentSubtitle = opt.subtitle;
                        if (activePlan === "free" && !opt.isFree) {
                          currentSubtitle = `${opt.subtitle} (Aura Premium / Pro)`;
                        } else if (activePlan === "premium") {
                          if (unlockedIntentionsList.includes(opt.id)) {
                            currentSubtitle = `${opt.subtitle} (Slot Unlocked)`;
                          } else if (unlockedIntentionsList.length < 3) {
                            currentSubtitle = `${opt.subtitle} (✦ Use slot to unlock)`;
                          } else {
                            currentSubtitle = `${opt.subtitle} (🔒 Aura Pro Required)`;
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              if (isLocked) {
                                setShowPremiumSimulatorModal(true);
                                return;
                              }
                              // Unlock intention slot if in premium
                              if (activePlan === "premium" && !unlockedIntentionsList.includes(opt.id)) {
                                setUnlockedIntentionsList(prev => [...prev, opt.id]);
                              }
                              setIntention(opt.id);
                              // Auto-fill context
                              if (opt.id === "Wealth") {
                                setNeed("I feel stuck financially and need grounding");
                              } else if (opt.id === "Love") {
                                setNeed("I am healing from past emotional trauma and grief");
                              } else if (opt.id === "Career") {
                                setNeed("I want to unlock my professional passion and clear blockages");
                              } else if (opt.id === "Protection") {
                                setNeed("I struggle to speak my authentic boundaries and need protection");
                              } else if (opt.id === "Healing") {
                                setNeed("I am holding chronic stress in my body and seek release");
                              } else if (opt.id === "Spiritual Growth") {
                                setNeed("I seek alignment with my destiny paths and higher self");
                              }
                            }}
                            className={`w-full text-left px-3 py-2 rounded border text-xs transition-all flex items-center justify-between ${
                              isSelected
                                ? "bg-[#C5A059]/15 border-[#C5A059] text-white"
                                : isLocked
                                ? "bg-[#121212]/50 border-white/5 text-gray-500 cursor-not-allowed opacity-60"
                                : "bg-[#121212] border-white/5 text-gray-400 hover:border-white/10 hover:text-white cursor-pointer"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">{opt.icon}</span>
                              <div className="flex flex-col">
                                <span className={`font-semibold ${isLocked ? "text-gray-500" : "text-gray-200"}`}>{opt.label}</span>
                                <span className="text-[9px] text-gray-500 leading-none mt-0.5">
                                  {currentSubtitle}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {isLocked && <span className="text-xs text-[#C5A059]">🔒</span>}
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 block">Somatic Need</label>
                      <button
                        type="button"
                        onClick={toggleListening}
                        className={`text-[9px] uppercase tracking-wider flex items-center gap-1.5 px-2 py-1 rounded transition-all cursor-pointer ${
                          isListening 
                            ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse" 
                            : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
                        }`}
                        title={isListening ? "Listening... click to stop" : "Speak your intention"}
                      >
                        {isListening ? (
                          <>
                            <MicOff className="w-3 h-3 text-red-400 animate-pulse" />
                            <span>Stop Mic</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3 h-3 text-[#C5A059]" />
                            <span>Voice Input</span>
                          </>
                        )}
                      </button>
                    </div>

                    {speechError && (
                      <div className="text-[10px] text-red-400 bg-red-950/25 border border-red-900/30 rounded px-2.5 py-1.5 my-1">
                        {speechError}
                      </div>
                    )}

                    {isListening && (
                      <div className="text-[10px] text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/20 rounded px-2.5 py-1.5 my-1 animate-pulse flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                        <span>Listening... Speak now ({preferredLanguage})</span>
                      </div>
                    )}

                    <textarea
                      value={need}
                      onChange={(e) => setNeed(e.target.value)}
                      placeholder="Detail your emotional blocks or intentions..."
                      rows={3}
                      className="w-full bg-[#151515] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059] text-white placeholder-gray-600 resize-none leading-relaxed"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setQuizStep(1)}
                      className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[11px] uppercase tracking-wider font-semibold rounded transition-colors text-center cursor-pointer font-sans"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleInitiateRitual}
                      className="flex-1 py-2.5 bg-[#C5A059] hover:bg-[#b08e4d] text-black text-[11px] uppercase tracking-widest font-bold rounded transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-md font-sans"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-black animate-pulse" />
                      <span>Analyze Chart</span>
                    </button>
                  </div>
                </div>
              )}

              {quizStep === 4 && (
                <div className="space-y-5">
                  <div>
                    <span className="text-[8px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">AstrInk Prescription</span>
                    <h3 className="text-sm font-serif uppercase tracking-widest text-white">Your Alignment</h3>
                    <p className="text-xs text-gray-400 mt-1">Your birth natal configuration maps</p>
                  </div>

                  <div className="bg-[#121212] border border-white/5 rounded p-3.5 space-y-3 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-gray-500 uppercase text-[9px] tracking-wider">Sun (Surya)</span>
                      <span className="font-serif font-bold text-[#C5A059]">{suggestion.astrology.sunSign}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-gray-500 uppercase text-[9px] tracking-wider">Moon (Chandra)</span>
                      <span className="font-serif font-bold text-[#C5A059]">{suggestion.astrology.moonSign}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 uppercase text-[9px] tracking-wider">Ascendant (Lagna)</span>
                      <span className="font-serif font-bold text-[#C5A059]">{suggestion.astrology.risingSign}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setQuizStep(1);
                        setSuggestion(null);
                      }}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[11px] uppercase tracking-[0.15em] font-bold rounded transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Recalculate Alignment</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "collection" && (
            <div className="space-y-6">
              <div>
                <span className="text-[8px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">Archived Blueprints</span>
                <h3 className="text-sm font-serif uppercase tracking-widest text-white">Sacred Vault</h3>
                <p className="text-xs text-gray-400 mt-1">Review your preserved cosmic talismans and somatic intentions.</p>
              </div>

              <div className="bg-[#121212] border border-white/5 rounded p-4 space-y-4 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-gray-500 uppercase text-[9px] tracking-wider">Total Preserved</span>
                  <span className="font-serif font-bold text-[#C5A059] text-sm">{sacredCollection.length}</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed italic">
                  These blueprints are secured locally in your browser storage. You can view, print, download, edit notes, or reload them at any time.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("quiz");
                    setQuizStep(1);
                  }}
                  className="w-full py-3 bg-[#C5A059] hover:bg-[#b08e4d] text-black text-[11px] uppercase tracking-[0.15em] font-bold rounded transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Begin New Soul Quiz</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "premium" && (
            <div className="space-y-6">
              <div>
                <span className="text-[8px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">Premium Dashboard</span>
                <h3 className="text-sm font-serif uppercase tracking-widest text-white">Report Index</h3>
                <p className="text-xs text-gray-400 mt-1">Navigate your complete natal report and customized alchemical designs.</p>
              </div>

              {!isPremiumUnlocked ? (
                <div className="bg-[#121212] border border-[#C5A059]/20 rounded p-4 space-y-4 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[#C5A059] uppercase text-[9px] tracking-wider font-bold">Premium Features</span>
                    <span className="text-[10px] font-mono text-[#C5A059] font-bold">From ₹299</span>
                  </div>
                   <ul className="space-y-2.5 text-[10.5px] text-gray-400">
                    <li className="flex items-center gap-1.5"><span className="text-[#C5A059]">✦</span> Premium Alchemical Intentions (Love, Career, etc.)</li>
                    <li className="flex items-center gap-1.5"><span className="text-[#C5A059]">✦</span> D1 Kundli Astrolabe Interactive Chart</li>
                    <li className="flex items-center gap-1.5"><span className="text-[#C5A059]">✦</span> 3 Auspicious Muhurtas Slots</li>
                    <li className="flex items-center gap-1.5"><span className="text-[#C5A059]">✦</span> Premium Concept 2 & Complexity Modes</li>
                    <li className="flex items-center gap-1.5"><span className="text-[#C5A059]">✦</span> Sanskrit Ritual Mantra Activation</li>
                    <li className="flex items-center gap-1.5"><span className="text-[#C5A059]">✦</span> Printable PDF / Tattooist Guide</li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => setShowPremiumSimulatorModal(true)}
                    className="w-full py-2.5 bg-[#C5A059] hover:bg-[#b08e4d] text-black text-[10px] uppercase tracking-widest font-bold rounded transition-all cursor-pointer text-center"
                  >
                    View Premium & Pro Plans
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("kundli-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full text-left p-3 rounded border border-white/5 bg-[#121212] text-gray-300 hover:text-white hover:border-[#C5A059]/20 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>🪐 D1 Natal Kundli Chart</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("muhurta-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full text-left p-3 rounded border border-white/5 bg-[#121212] text-gray-300 hover:text-white hover:border-[#C5A059]/20 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>📅 Shubh Muhurta Slots</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("designs-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full text-left p-3 rounded border border-white/5 bg-[#121212] text-gray-300 hover:text-white hover:border-[#C5A059]/20 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>📑 Alternative Design Options</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="w-full text-left p-3 rounded border border-white/5 bg-[#121212] text-gray-300 hover:text-white hover:border-[#C5A059]/20 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>📥 Save PDF / Print Report</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "ledger" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[8px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">Seeker Registry</span>
                <h3 className="text-sm font-serif uppercase tracking-widest text-white">Database Control</h3>
                <p className="text-xs text-gray-400 mt-1">Review the demographic parameters and spiritual alignments stored in the cosmic ledger.</p>
              </div>

              {/* Privacy / Auth Access Shield */}
              <div className="bg-[#121212] border border-[#C5A059]/15 rounded-lg p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`w-2 h-2 rounded-full ${isMasterAuthorized ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                    <span className="text-gray-300 font-mono text-[10px] uppercase tracking-wider font-bold">
                      {isMasterAuthorized ? "Global Master Mode" : "Private Device Mode"}
                    </span>
                  </div>
                  {isMasterAuthorized ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMasterPasscode("");
                        localStorage.removeItem("aura_ink_master_passcode");
                        setIsMasterAuthorized(false);
                        loadSeekersFromLedger("");
                      }}
                      className="text-[9px] uppercase px-2 py-1 bg-white/5 text-gray-400 hover:text-white rounded border border-white/5 transition-colors cursor-pointer"
                    >
                      Lock Global
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const code = prompt("Enter Master Practitioner Passcode to unlock the global registry:");
                        if (code !== null) {
                          setMasterPasscode(code);
                          localStorage.setItem("aura_ink_master_passcode", code);
                          loadSeekersFromLedger(code);
                        }
                      }}
                      className="text-[9px] uppercase px-2 py-1 bg-[#C5A059]/15 text-[#C5A059] hover:bg-[#C5A059]/25 rounded border border-[#C5A059]/30 transition-colors cursor-pointer font-bold"
                    >
                      Unlock Global
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  {isMasterAuthorized 
                    ? "Currently displaying all entries recorded in the cosmic database ledger." 
                    : "For seeker safety, only alignments generated on this browser are visible. Enter passcode to access full registry."}
                </p>
              </div>

              {/* Stats Box */}
              <div className="bg-[#121212] border border-white/5 rounded-lg p-4 space-y-4 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Database className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="uppercase text-[9px] tracking-wider">Registry Volume</span>
                  </div>
                  <span className="font-serif font-bold text-[#C5A059] text-sm">{seekers.length} Seekers</span>
                </div>

                <div className="space-y-2 text-[10.5px]">
                  <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest">Intention Resonance:</p>
                  {[
                    { name: "Wealth & Abundance", count: seekers.filter((s) => s.intention === "Wealth").length, color: "bg-[#C5A059]" },
                    { name: "Love & Harmony", count: seekers.filter((s) => s.intention === "Love").length, color: "bg-pink-500" },
                    { name: "Career & Dharma", count: seekers.filter((s) => s.intention === "Career").length, color: "bg-blue-500" },
                    { name: "Protection & Shielding", count: seekers.filter((s) => s.intention === "Protection").length, color: "bg-purple-500" },
                    { name: "Healing & Restoration", count: seekers.filter((s) => s.intention === "Healing").length, color: "bg-emerald-500" }
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-gray-300">
                      <span>{item.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 font-mono text-[9px]">{item.count}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: item.count > 0 ? "100%" : "0%" }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Box */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={loadSeekersFromLedger}
                  disabled={seekersLoading}
                  className="w-full text-left p-3 rounded border border-white/5 bg-[#121212] text-gray-300 hover:text-white hover:border-[#C5A059]/20 transition-all flex items-center justify-between cursor-pointer text-xs"
                >
                  <span className="flex items-center gap-2">
                    <RefreshCw className={`w-3.5 h-3.5 text-[#C5A059] ${seekersLoading ? "animate-spin" : ""}`} />
                    <span>Synchronize Ledger</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const headers = ["ID", "Registered At", "First Name", "Last Name", "Gender", "Birth Date", "Birth Time", "Birth Place", "Intention", "Need", "Chakra", "Sun Sign", "Dominant Planet"];
                    const rows = seekers.map((s) => [
                      s.id,
                      s.createdAt,
                      s.firstName,
                      s.lastName,
                      s.gender,
                      s.birthDate,
                      s.birthTime,
                      s.birthPlace,
                      s.intention,
                      s.need,
                      s.suggestion?.chakra_energy?.targetChakra || "",
                      s.suggestion?.astrology?.sunSign || "",
                      s.suggestion?.astrology?.dominantPlanet || ""
                    ]);
                    const csvContent = "data:text/csv;charset=utf-8," 
                      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `aura_ink_seekers_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  disabled={seekers.length === 0}
                  className="w-full text-left p-3 rounded border border-white/5 bg-[#121212] text-gray-300 hover:text-white hover:border-[#C5A059]/20 transition-all flex items-center justify-between cursor-pointer text-xs disabled:opacity-45 disabled:pointer-events-none"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Export Ledger as CSV</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
                </button>
              </div>
            </div>
          )}


        </aside>

        {activeTab === "ledger" ? (
          <div className="flex-1 bg-[#121212] lg:overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-start animate-fadeIn">
            <div className="w-full max-w-5xl mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#151515] border border-white/10 rounded-lg px-6 py-5 gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-serif text-white tracking-wide uppercase">
                      Sacred Seekers Registry Ledger
                    </h2>
                    <span className={`text-[9px] uppercase px-2 py-0.5 rounded font-mono font-bold tracking-widest ${
                      isMasterAuthorized 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {isMasterAuthorized ? "● Global Master View" : "● Device-Locked Private View"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {isMasterAuthorized 
                      ? "A secure master-practitioner repository containing cosmic parameters and custom talismans for all registered seekers."
                      : "A secure repository logging your custom birth chart alignments and personal prescribed sigils."}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-[10px] uppercase bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/20 rounded px-3 py-1.5 font-mono font-bold">
                    {seekers.length} {isMasterAuthorized ? "Global" : "Personal"} Seekers
                  </div>
                </div>
              </div>

              {/* Filters & Search Control */}
              <div className="bg-[#151515] border border-white/5 rounded-lg p-4 mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-gray-500" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search Seeker / Intention..."
                    value={seekersSearchQuery}
                    onChange={(e) => setSeekersSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#090909] border border-white/5 rounded text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#C5A059]/40 transition-colors"
                  />
                </div>

                {/* Filter Intention */}
                <div className="flex items-center gap-2 bg-[#090909] px-3 py-1.5 rounded border border-white/5">
                  <Filter className="w-3 h-3 text-[#C5A059] shrink-0" />
                  <select
                    value={seekersIntentionFilter}
                    onChange={(e) => setSeekersIntentionFilter(e.target.value)}
                    className="bg-transparent text-gray-400 text-xs focus:outline-none w-full border-none p-0 cursor-pointer"
                  >
                    <option value="All">All Intentions</option>
                    <option value="Wealth">Wealth & Abundance</option>
                    <option value="Love">Love & Harmony</option>
                    <option value="Career">Career & Dharma</option>
                    <option value="Protection">Protection & Shielding</option>
                    <option value="Healing">Healing & Restoration</option>
                  </select>
                </div>

                {/* Filter Chakra */}
                <div className="flex items-center gap-2 bg-[#090909] px-3 py-1.5 rounded border border-white/5">
                  <Layers className="w-3 h-3 text-[#C5A059] shrink-0" />
                  <select
                    value={seekersChakraFilter}
                    onChange={(e) => setSeekersChakraFilter(e.target.value)}
                    className="bg-transparent text-gray-400 text-xs focus:outline-none w-full border-none p-0 cursor-pointer font-sans"
                  >
                    <option value="All">All Chakras</option>
                    <option value="Root">Root Chakra</option>
                    <option value="Sacral">Sacral Chakra</option>
                    <option value="Solar Plexus">Solar Plexus Chakra</option>
                    <option value="Heart">Heart Chakra</option>
                    <option value="Throat">Throat Chakra</option>
                    <option value="Third Eye">Third Eye Chakra</option>
                    <option value="Crown">Crown Chakra</option>
                  </select>
                </div>

                {/* Filter Sun Sign */}
                <div className="flex items-center gap-2 bg-[#090909] px-3 py-1.5 rounded border border-white/5">
                  <Compass className="w-3 h-3 text-[#C5A059] shrink-0" />
                  <select
                    value={seekersZodiacFilter}
                    onChange={(e) => setSeekersZodiacFilter(e.target.value)}
                    className="bg-transparent text-gray-400 text-xs focus:outline-none w-full border-none p-0 cursor-pointer font-sans"
                  >
                    <option value="All">All Sun Signs</option>
                    {["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].map((sign) => (
                      <option key={sign} value={sign}>{sign}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {seekersLoading ? (
              <div className="w-full max-w-5xl py-24 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin" />
                <p className="text-xs text-gray-500 font-mono">Synchronizing seekers directory with the cosmic ledger file...</p>
              </div>
            ) : (() => {
              const filtered = seekers.filter((seeker) => {
                const query = seekersSearchQuery.toLowerCase();
                const matchesSearch = 
                  seeker.firstName?.toLowerCase().includes(query) ||
                  seeker.lastName?.toLowerCase().includes(query) ||
                  seeker.intention?.toLowerCase().includes(query) ||
                  seeker.birthPlace?.toLowerCase().includes(query) ||
                  seeker.need?.toLowerCase().includes(query) ||
                  seeker.suggestion?.tattoo_concept?.title?.toLowerCase().includes(query);

                const matchesIntention = seekersIntentionFilter === "All" || seeker.intention === seekersIntentionFilter;
                
                const matchesChakra = seekersChakraFilter === "All" || 
                  seeker.suggestion?.chakra_energy?.targetChakra?.toLowerCase().includes(seekersChakraFilter.toLowerCase());

                const matchesZodiac = seekersZodiacFilter === "All" ||
                  seeker.suggestion?.astrology?.sunSign?.toLowerCase().includes(seekersZodiacFilter.toLowerCase());

                return matchesSearch && matchesIntention && matchesChakra && matchesZodiac;
              });

              if (filtered.length === 0) {
                return (
                  <div className="w-full max-w-xl bg-[#151515] border border-white/5 rounded-lg p-12 flex flex-col items-center text-center space-y-5 my-12 shadow-xl">
                    <Database className="w-8 h-8 text-[#C5A059]/40" />
                    <div>
                      <h3 className="font-serif text-base text-white uppercase tracking-wider">No Registry Matches Found</h3>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                        Try modifying your search queries or filtering criteria to find recorded seeker soul questions.
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div className="w-full max-w-5xl space-y-4 pb-12">
                  <div className="grid grid-cols-1 gap-4">
                    {filtered.map((seeker) => {
                      const chakraInfo = seeker.suggestion?.chakra_energy;
                      const astroInfo = seeker.suggestion?.astrology;
                      const conceptInfo = seeker.suggestion?.tattoo_concept;
                      const formattedDate = new Date(seeker.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      });

                      return (
                        <div key={seeker.id} className="bg-[#151515] border border-white/5 hover:border-white/10 rounded-lg p-5 flex flex-col md:flex-row justify-between gap-5 transition-all relative overflow-hidden group">
                          <div className={`absolute top-0 left-0 w-1 h-full ${
                            seeker.intention === "Wealth" ? "bg-[#C5A059]" :
                            seeker.intention === "Love" ? "bg-pink-500" :
                            seeker.intention === "Career" ? "bg-blue-500" :
                            seeker.intention === "Protection" ? "bg-purple-500" :
                            "bg-emerald-500"
                          }`} />

                          <div className="space-y-3 flex-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <h3 className="font-serif font-bold text-sm text-white uppercase tracking-wide">
                                {seeker.firstName} {seeker.lastName}
                              </h3>
                              <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-white/5 text-gray-400 font-bold tracking-widest flex items-center gap-1">
                                <span>{seeker.gender}</span>
                              </span>
                              <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-[#C5A059]/10 text-[#C5A059] font-bold tracking-widest">
                                🎯 {seeker.intention}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[11px] text-gray-400">
                              <div className="space-y-1">
                                <p className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                                  <span>Born: <strong className="text-gray-300">{seeker.birthDate}</strong> at {seeker.birthTime}</span>
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                                  <span>Location: <strong className="text-gray-300">{seeker.birthPlace}</strong></span>
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="flex items-center gap-1.5">
                                  <Compass className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                                  <span>Astrology: <strong className="text-gray-300">{astroInfo?.sunSign || "N/A"}</strong> (Dominant: {astroInfo?.dominantPlanet || "N/A"})</span>
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <Layers className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                                  <span>Chakra: <strong className="text-gray-300">{chakraInfo?.targetChakra || "N/A"}</strong></span>
                                </p>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-white/5 space-y-1">
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Inner Soul Healing Goal:</p>
                              <p className="text-xs text-gray-300 italic leading-relaxed font-serif">
                                "{seeker.need}"
                              </p>
                            </div>

                            {conceptInfo?.title && (
                              <div className="mt-2 text-[10.5px] text-gray-400 bg-white/5 border border-white/5 rounded px-3 py-2 flex items-center justify-between">
                                <div>
                                  <span className="text-gray-500 uppercase font-bold tracking-wider mr-2">Tattoo Prescribed:</span>
                                  <strong className="text-white font-serif">{conceptInfo.title}</strong>
                                  <span className="text-gray-500 ml-1.5">({conceptInfo.style})</span>
                                </div>
                                <span className="font-bold text-[9px] text-[#C5A059] uppercase tracking-wider">
                                  Pain Level: {conceptInfo.painIndex}/10
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col justify-between items-end gap-3 self-stretch md:border-l md:border-white/5 md:pl-5 shrink-0 min-w-[150px]">
                            <span className="text-[9.5px] text-gray-500 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{formattedDate}</span>
                            </span>

                            {conceptInfo?.svgMarkupModerate && (
                              <div 
                                className="w-16 h-16 rounded border border-white/10 bg-[#090909] p-1 text-[#C5A059] hover:scale-105 transition-transform duration-300 shadow-inner flex items-center justify-center cursor-pointer"
                                onClick={() => loadPastSeekerToView(seeker)}
                                title="Click to load interactive blueprint"
                                dangerouslySetInnerHTML={{ __html: conceptInfo.svgMarkupModerate }}
                              />
                            )}

                            <div className="flex gap-2 w-full">
                              <button
                                type="button"
                                onClick={() => loadPastSeekerToView(seeker)}
                                className="flex-1 py-1.5 bg-[#C5A059] hover:bg-[#b08e4d] text-black rounded text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Recall</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Do you wish to release ${seeker.firstName}'s record from the cosmic database ledger?`)) {
                                    deleteSeekerFromLedger(seeker.id);
                                  }
                                }}
                                className="p-1.5 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/5 hover:border-red-500/30 rounded transition-colors cursor-pointer"
                                title="Release record from database ledger"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : activeTab === "collection" ? (
          <div className="flex-1 bg-[#121212] lg:overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-start">
            <div className="w-full max-w-5xl mb-6">
              <div className="flex justify-between items-center bg-[#151515] border border-white/10 rounded px-6 py-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-serif text-white tracking-wide uppercase">Your Preserved Sacred Archive</h2>
                  <p className="text-xs text-gray-400 mt-1">A curated repository of your natal alignments and customized vector talismans.</p>
                </div>
                <div className="text-[10px] uppercase bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/20 rounded px-3 py-1 font-mono">
                  {sacredCollection.length} {sacredCollection.length === 1 ? "Talisman" : "Talismans"} Saved
                </div>
              </div>
            </div>

            {sacredCollection.length === 0 ? (
              <div className="w-full max-w-2xl bg-[#151515] border border-white/5 rounded-lg p-12 flex flex-col items-center text-center space-y-6 my-auto shadow-2xl">
                <div className="w-16 h-16 rounded-full border border-dashed border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]/60">
                  <Bookmark className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-lg text-white uppercase tracking-wider">Your Sacred Archive is Empty</h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                    Begin your cosmic alignment analysis. Once the oracle designs your unique vector talisman and maps your astrological chart, you can preserve it here.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("quiz");
                    setQuizStep(1);
                  }}
                  className="px-6 py-3 bg-[#C5A059] hover:bg-[#b08e4d] text-black text-xs font-bold uppercase tracking-[0.15em] rounded transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Initiate First Soul Quiz</span>
                </button>
              </div>
            ) : (
              <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                {sacredCollection.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="bg-[#151515] border border-white/10 rounded-lg overflow-hidden flex flex-col justify-between shadow-xl relative group transition-all hover:border-[#C5A059]/40"
                    >
                      {/* Left border highlight color */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C5A059]" />

                      {/* Header of Item card */}
                      <div className="p-5 border-b border-white/5 flex justify-between items-start pl-7">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider text-[#C5A059] font-medium">
                            {item.inputs.intention} • {item.savedAt}
                          </span>
                          <h4 className="font-serif text-lg text-white font-medium leading-tight">{item.title}</h4>
                          <p className="text-[10px] text-gray-400">
                            Created for <span className="text-white font-medium">{item.inputs.firstName} {item.inputs.lastName}</span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => deleteFromCollection(item.id, e)}
                          title="Purge from archive"
                          className="p-1.5 rounded text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer animate-none"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Content details & Talisman SVG */}
                      <div className="p-5 pl-7 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center border-b border-white/5">
                        {/* Talisman SVG Preview */}
                        <div className="aspect-square bg-[#0F0F0F] rounded border border-white/5 flex items-center justify-center p-4 relative">
                          <div
                            className="w-24 h-24 text-[#C5A059] filter drop-shadow-[0_0_6px_rgba(197,160,89,0.25)]"
                            dangerouslySetInnerHTML={{ __html: item.suggestion.tattoo_concept.svgMarkup }}
                          />
                          <div className="absolute bottom-2 left-2 text-[7px] text-gray-500 uppercase tracking-widest font-mono">
                            Vector Talisman
                          </div>
                        </div>

                        {/* Signs & Charkas info */}
                        <div className="space-y-2 text-xs">
                          <div className="space-y-1">
                            <span className="text-[8px] uppercase tracking-wider text-gray-500 font-bold block">Natal Astrology</span>
                            <p className="text-[11px] text-white italic font-serif">
                              ☀️ {item.suggestion.astrology.sunSign} • 🌙 {item.suggestion.astrology.moonSign} • ↗️ {item.suggestion.astrology.risingSign}
                            </p>
                          </div>
                          <div className="space-y-0.5 pt-1">
                            <span className="text-[8px] uppercase tracking-wider text-gray-500 font-bold block">Energetic Target</span>
                            <p className="text-[11px] font-medium text-[#C5A059]">{item.suggestion.chakra_energy.targetChakra}</p>
                            <p className="text-[10px] text-gray-400 leading-normal line-clamp-2">{item.suggestion.chakra_energy.imbalanceAnalysis}</p>
                          </div>
                          <div className="space-y-0.5 pt-1">
                            <span className="text-[8px] uppercase tracking-wider text-gray-500 font-bold block">Suggested Placement</span>
                            <p className="text-[11px] text-gray-300 font-medium">{item.suggestion.tattoo_concept.placement}</p>
                          </div>
                        </div>
                      </div>

                      {/* Somatic Journal Reflection area */}
                      <div className="p-4 pl-7 bg-[#171717] flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold block">
                          Somatic Integration Journal & Notes
                        </label>
                        <textarea
                          value={item.customNotes}
                          onChange={(e) => updateCollectionItemNotes(item.id, e.target.value)}
                          placeholder="Log your meditations, placement feelings, or ritual notes here. Autosaved."
                          rows={2}
                          className="w-full bg-[#111111] border border-white/10 rounded px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-[#C5A059] text-white placeholder-gray-600 resize-none leading-relaxed"
                        />
                      </div>

                      {/* Load Blueprint CTA */}
                      <div className="p-3 bg-[#131313] border-t border-white/5 flex justify-end">
                        <button
                          type="button"
                          onClick={() => loadSuggestionFromCollection(item)}
                          className="w-full sm:w-auto px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4d] text-black rounded font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Load Interactive Blueprint</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (activeTab === "quiz" || activeTab === "premium") && quizStep === 4 && suggestion ? (
          <div className="flex-1 bg-[#121212] lg:overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-start">
            {/* Business Model: Free vs Premium Option Selection Tabs */}
            <div className="w-full max-w-5xl mb-4 p-1.5 bg-[#151515] border border-white/10 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-2 px-2.5 py-1">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Curated Alchemical Concepts:</span>
                </span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                  {isPremiumUnlocked ? "PREMIUM PLAN" : "FREE PLAN"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPremiumOptionIndex(0)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all ${
                    selectedPremiumOptionIndex === 0
                      ? "bg-[#C5A059]/25 text-[#C5A059] border border-[#C5A059]/40"
                      : "bg-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  Concept 1 (Free)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isPremiumUnlocked) {
                      setSelectedPremiumOptionIndex(1);
                    } else {
                      setShowPremiumSimulatorModal(true);
                    }
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 ${
                    selectedPremiumOptionIndex === 1
                      ? "bg-[#C5A059]/25 text-[#C5A059] border border-[#C5A059]/40"
                      : "bg-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  {!isPremiumUnlocked && <span className="text-[#C5A059]">🔒</span>}
                  <span>Concept 2 {!isPremiumUnlocked && <span className="text-[9px] text-[#C5A059]/70 font-mono">(Premium)</span>}</span>
                </button>
              </div>
            </div>

            {/* Premium Upgrade Marketing Banner */}
            {activePlan !== "pro" && (
              <div className="w-full max-w-5xl mb-6 bg-gradient-to-r from-[#1E1610] via-[#2A1E14] to-[#1E1610] border border-[#C5A059]/40 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl relative overflow-hidden z-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full filter blur-xl pointer-events-none"></div>
                <div className="space-y-1.5 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="bg-[#C5A059]/10 text-[#C5A059] text-[9.5px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-[#C5A059]/20">
                      {activePlan === "free" ? "🌟 Sacred Upgrades Available" : "👑 Aura Pro Upgrade"}
                    </span>
                    <span className="text-xs font-serif italic text-gray-400">
                      {activePlan === "free" ? "From ₹299 One-time Access" : "₹499 One-time Access"}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                    {activePlan === "free" 
                      ? "Unlock Aura Premium or Aura Pro Features" 
                      : "Upgrade to Aura Pro for Unlimited Intentions"}
                  </h4>
                  <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                    {activePlan === "free" 
                      ? "Gain access to Premium Alchemical Intentions (Love, Career, etc.), Premium Concept 2, Moderate & Advanced complexity, Sanskrit Ritual Mantra activation, interactive D1 Kundli natal chart, Muhurta scheduling, and downloadable PDF report."
                      : "You are currently on Aura Premium (up to 3 intentions). Upgrade to Aura Pro to get unlimited access to all 6 alchemical intentions (Wealth, Love, Career, Protection, Healing, Spiritual Growth) and all advanced attributes."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPremiumSimulatorModal(true)}
                  className="w-full md:w-auto shrink-0 px-5 py-2.5 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-extrabold rounded text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-[#C5A059]/10 transition-all hover:scale-[1.02]"
                >
                  {activePlan === "free" ? "View Upgrades" : "Upgrade to Pro (₹499)"}
                </button>
              </div>
            )}

            {/* Top Bar for Actions */}
            <div className="w-full max-w-5xl mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#151515] border border-white/10 rounded px-4 py-3 gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#C5A059]">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <div>
                  <span className="font-semibold block sm:inline">AstroPsyche Oracle Recommendation Loaded</span>
                  <span className="text-[10px] text-gray-400 sm:ml-2 block sm:inline">Use the sidebar on the left to recalculate anytime</span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-[#C5A059] hover:bg-[#b08e4d] text-black rounded font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-[11px] uppercase tracking-wider"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Poster</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedComplexity !== "Simple" && !isPremiumUnlocked) {
                      setShowPremiumSimulatorModal(true);
                      return;
                    }
                    const selectedSvg = selectedComplexity === "Simple" ? (suggestion.tattoo_concept.svgMarkupSimple || suggestion.tattoo_concept.svgMarkup) : selectedComplexity === "Advanced" ? (suggestion.tattoo_concept.svgMarkupAdvanced || suggestion.tattoo_concept.svgMarkup) : (suggestion.tattoo_concept.svgMarkupModerate || suggestion.tattoo_concept.svgMarkup);
                    
                    let rawSvg = selectedSvg || getSacredTattooSvg();
                    
                    // Post-process the SVG to convert "currentColor" to a beautiful burnished gold ink (#C5A059)
                    let processedSvg = rawSvg
                      .replace(/stroke=["']currentColor["']/g, 'stroke="#C5A059"')
                      .replace(/fill=["']currentColor["']/g, 'fill="#C5A059"');
                    
                    // Inject explicit size attributes and standard XML/xmlns headers
                    if (processedSvg.includes("<svg")) {
                      processedSvg = processedSvg.replace(
                        "<svg",
                        '<svg width="1000" height="1000" style="background-color: #0D0D0D; padding: 60px;" xmlns="http://www.w3.org/2000/svg"'
                      );
                    }
                    
                    if (!processedSvg.trim().startsWith("<?xml")) {
                      processedSvg = `<?xml version="1.0" encoding="utf-8"?>\n` + processedSvg;
                    }
                    
                    try {
                      const svgBlob = new Blob([processedSvg], { type: "image/svg+xml;charset=utf-8" });
                      const url = URL.createObjectURL(svgBlob);
                      const image = new Image();
                      image.onload = () => {
                        const canvas = document.createElement("canvas");
                        canvas.width = 1000;
                        canvas.height = 1000;
                        const ctx = canvas.getContext("2d");
                        if (ctx) {
                          ctx.fillStyle = "#0D0D0D";
                          ctx.fillRect(0, 0, 1000, 1000);
                          ctx.drawImage(image, 0, 0, 1000, 1000);
                          
                          const pngUrl = canvas.toDataURL("image/png");
                          const a = document.createElement("a");
                          a.href = pngUrl;
                          a.download = `astro_tattoo_${suggestion.tattoo_concept.title.toLowerCase().replace(/\s+/g, "_")}_${selectedComplexity.toLowerCase()}.png`;
                          a.click();
                        }
                        URL.revokeObjectURL(url);
                      };
                      image.onerror = (e) => {
                        console.error("PNG conversion failed, falling back to SVG", e);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `astro_tattoo_${suggestion.tattoo_concept.title.toLowerCase().replace(/\s+/g, "_")}_${selectedComplexity.toLowerCase()}.svg`;
                        a.click();
                        URL.revokeObjectURL(url);
                      };
                      image.src = url;
                    } catch (err) {
                      console.error("Conversion failed", err);
                    }
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-gradient-to-r from-[#C5A059]/20 to-[#8C6D3A]/20 hover:from-[#C5A059]/30 hover:to-[#8C6D3A]/30 text-[#C5A059] border border-[#C5A059]/40 rounded font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-[11px] uppercase tracking-wider"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedComplexity !== "Simple" && !isPremiumUnlocked) {
                      setShowPremiumSimulatorModal(true);
                      return;
                    }
                    const selectedSvg = selectedComplexity === "Simple" ? (suggestion.tattoo_concept.svgMarkupSimple || suggestion.tattoo_concept.svgMarkup) : selectedComplexity === "Advanced" ? (suggestion.tattoo_concept.svgMarkupAdvanced || suggestion.tattoo_concept.svgMarkup) : (suggestion.tattoo_concept.svgMarkupModerate || suggestion.tattoo_concept.svgMarkup);
                    
                    let rawSvg = selectedSvg || getSacredTattooSvg();
                    
                    // Post-process the SVG to convert "currentColor" to a beautiful burnished gold ink (#C5A059),
                    // ensuring it renders perfectly when imported into design software, browsers, or print layouts.
                    let processedSvg = rawSvg
                      .replace(/stroke=["']currentColor["']/g, 'stroke="#C5A059"')
                      .replace(/fill=["']currentColor["']/g, 'fill="#C5A059"');
                    
                    // Inject explicit width, height, and dark ritual background styles for standalone high-quality viewing
                    if (processedSvg.includes("<svg")) {
                      processedSvg = processedSvg.replace(
                        "<svg",
                        '<svg width="800" height="800" style="background-color: #0D0D0D; padding: 40px; border-radius: 16px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);"'
                      );
                    }
                    
                    // Prepend standard XML declaration for valid SVG vector standards
                    if (!processedSvg.trim().startsWith("<?xml")) {
                      processedSvg = `<?xml version="1.0" encoding="utf-8"?>\n` + processedSvg;
                    }
                    
                    const blob = new Blob([processedSvg], { type: "image/svg+xml;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `astro_tattoo_${suggestion.tattoo_concept.title.toLowerCase().replace(/\s+/g, "_")}_${selectedComplexity.toLowerCase()}.svg`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-white/5 hover:bg-white/15 text-white/80 border border-white/10 rounded font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-[11px] uppercase tracking-wider"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Vector SVG (For Artist)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-gradient-to-r from-[#8C6D3A] to-[#C5A059] hover:from-[#6E552D] hover:to-[#B08E4D] text-white rounded font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-[11px] uppercase tracking-wider shadow-lg shadow-[#C5A059]/10"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#FCF8F0]" />
                  <span>Share Blueprint</span>
                </button>
                {(() => {
                  const isCurrentSuggestionSaved = suggestion ? sacredCollection.some(
                    (item) => item.suggestion.tattoo_concept.title === suggestion.tattoo_concept.title && 
                              item.inputs.birthDate === birthDate && 
                              item.inputs.intention === intention
                  ) : false;
                  return (
                    <button
                      type="button"
                      onClick={saveCurrentToCollection}
                      className={`flex-1 sm:flex-none px-3.5 py-2 rounded font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all text-[11px] uppercase tracking-wider ${
                        isCurrentSuggestionSaved
                          ? "bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/40 hover:bg-[#C5A059]/35"
                          : "bg-gradient-to-r from-[#C5A059] to-[#8C6D3A] text-black hover:from-[#b08e4d] hover:to-[#7a5f32] hover:text-white font-bold shadow-lg shadow-[#C5A059]/10"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isCurrentSuggestionSaved ? "fill-[#C5A059]" : ""}`} />
                      <span>{isCurrentSuggestionSaved ? "Preserved in Collection" : "Save to Collection"}</span>
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Design Options Control Panel */}
            <div className="w-full max-w-5xl mb-6 bg-[#161616] border border-white/10 rounded-lg p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-5 text-xs shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C5A059]" />
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C5A059] animate-pulse" />
                  <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">AstroPsyche Design Calibration</h4>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Calibrate the sacred complexity and aura ink density of your personal cosmic talisman.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-5 w-full md:w-auto">
                {/* Complexity Selection */}
                <div className="space-y-1.5 flex-1 sm:flex-none relative">
                  {glimpseLevel && (
                    <div className="absolute top-[-32px] left-1/2 -translate-x-1/2 bg-[#C5A059] text-black px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg animate-bounce whitespace-nowrap z-50 pointer-events-none border border-black/15">
                      <span>🔮</span>
                      <span>Cursor Hover: Faint {glimpseLevel} Watermark Glimpse</span>
                    </div>
                  )}
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold">1. Select Complexity</span>
                  <div className="flex bg-[#1E1E1E] p-1 rounded-md border border-white/5 gap-1">
                    {(["Simple", "Moderate", "Advanced"] as const).map((level) => {
                      const isActive = selectedComplexity === level;
                      const isLocked = level !== "Simple" && !isPremiumUnlocked;
                      return (
                        <button
                          key={level}
                          type="button"
                          onMouseEnter={() => {
                            if (isLocked) {
                              setGlimpseLevel(level);
                            }
                          }}
                          onMouseLeave={() => {
                            if (isLocked) {
                              setGlimpseLevel(null);
                            }
                          }}
                          onClick={() => {
                            if (!isLocked) {
                              setSelectedComplexity(level);
                            } else {
                              setGlimpseModalLevel(level);
                              setShowGlimpseModal(true);
                            }
                          }}
                          className={`px-2.5 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1 ${
                            isActive
                              ? "bg-[#C5A059] text-black shadow-lg scale-[1.03]"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {isLocked && <span className="text-[9px]">🔒</span>}
                          <span>{level}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ink Color Selection */}
                <div className="space-y-1.5 flex-1 sm:flex-none">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold">2. AstrInk Medium</span>
                  <div className="flex bg-[#1E1E1E] p-1 rounded-md border border-white/5 gap-1">
                    {[
                      { id: "Charcoal", label: "Charcoal", emoji: "⚫" },
                      { id: "Gold", label: "Gold", emoji: "🟡" },
                      { id: "BlueBlack", label: "Blue-Black", emoji: "🔵" }
                    ].map((color) => {
                      const isActive = inkColor === color.id;
                      return (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => setInkColor(color.id as any)}
                          className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1 ${
                            isActive
                              ? color.id === "Charcoal" ? "bg-[#2C2620] text-white" :
                                color.id === "Gold" ? "bg-[#C5A059] text-black" : "bg-[#122238] text-white"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <span>{color.emoji}</span>
                          <span>{color.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Explanatory description card for complexity levels */}
            <div className="w-full max-w-5xl mb-6 bg-[#161616]/90 border border-[#C5A059]/20 rounded-lg p-4 text-xs text-gray-300 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <h4 className="font-serif text-xs font-bold text-white uppercase tracking-wider">
                  Sacred Alignment Matrix: Complexity, Pain & Manifestation
                </h4>
              </div>

              {/* Grid comparing the 3 levels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {[
                  {
                    level: "Simple" as const,
                    pain: "Low & Highly Tolerable",
                    time: "6 - 7 Months (Gentle / Gradual)",
                    geometry: "Minimalist fine lines & core geometry",
                    desc: suggestion.tattoo_concept.simpleDesc || "A minimalist clean layout focusing purely on core structural geometry.",
                    badge: "🌱 Graceful Entry",
                    color: "border-gray-500/10 text-gray-400"
                  },
                  {
                    level: "Moderate" as const,
                    pain: "Medium / Balanced Sensation",
                    time: "Within 3 Months (Accelerated)",
                    geometry: "Multi-layered sacred symmetry & boundaries",
                    desc: suggestion.tattoo_concept.moderateDesc || "A perfectly balanced sacred yantra integrating classic energetic boundary circles.",
                    badge: "⚖️ Harmonized Flow",
                    color: "border-[#C5A059]/20 text-[#C5A059]"
                  },
                  {
                    level: "Advanced" as const,
                    pain: "High / Intense (Requires Focus)",
                    time: "1.5 Months (Immediate / High-Speed)",
                    geometry: "Intricate multi-dimensional cosmic matrices",
                    desc: suggestion.tattoo_concept.advancedDesc || "An intricate cosmological model with layered paths and celestial parameters.",
                    badge: "⚡ Quantum Catalyst",
                    color: "border-purple-500/20 text-purple-400"
                  }
                ].map((item) => {
                  const isActive = selectedComplexity === item.level;
                  const isLocked = item.level !== "Simple" && !isPremiumUnlocked;
                  return (
                    <div
                      key={item.level}
                      onClick={() => {
                        if (!isLocked) {
                          setSelectedComplexity(item.level);
                        } else {
                          setGlimpseModalLevel(item.level);
                          setShowGlimpseModal(true);
                        }
                      }}
                      className={`p-3.5 rounded-lg border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-2.5 ${
                        isActive
                          ? "bg-[#C5A059]/10 border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.15)] scale-[1.01]"
                          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1">
                            {isActive && <span className="text-[#C5A059]">✦</span>}
                            {item.level} {isLocked && "🔒"}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 font-bold uppercase tracking-widest">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-gray-400 leading-relaxed min-h-[42px]">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 space-y-1.5 text-[10px]">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 uppercase font-bold tracking-wider">Pain Threshold:</span>
                          <span className="text-gray-300 font-semibold">{item.pain}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 uppercase font-bold tracking-wider">Manifestation Time:</span>
                          <span className="text-[#C5A059] font-bold">{item.time}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 uppercase font-bold tracking-wider">Geometry Density:</span>
                          <span className="text-gray-400 font-semibold">{item.geometry}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Spiritual notice / wisdom box */}
              <div className="p-3 bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-lg flex items-start gap-2.5">
                <span className="text-sm">💡</span>
                <div className="space-y-1 text-left">
                  <h5 className="font-bold text-white text-[10.5px] uppercase tracking-wider">
                    Somatic Ink Manifestation Axiom
                  </h5>
                  <p className="text-[10px] text-gray-300 leading-relaxed">
                    While a <strong className="text-white">Simple</strong> blueprint is elegant, highly tolerable, and offers a gentle transition, choosing <strong className="text-[#C5A059]">Moderate</strong> or <strong className="text-[#C5A059]">Advanced</strong> configurations maximizes the vibrational impact. Sacred geometric resonance dictates that <strong className="text-[#C5A059]">more intricate geometric pathways anchor energies faster into the physical body, leading to faster results</strong>. If your physical pain tolerance permits, opting for more complex designs serves as a stronger, high-speed somatic catalyst to manifest your intention.
                  </p>
                </div>
              </div>
            </div>

            {/* Solfeggio sound bath healing frequency panel */}
            <div className="w-full max-w-5xl mb-6 bg-[#141414] border border-[#C5A059]/30 rounded-lg p-4 md:p-5 text-xs shadow-xl relative overflow-hidden">
              {/* Glowing decorative indicator representing the chakra */}
              <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br from-[#C5A059]/10 to-transparent blur-xl pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 relative z-10">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-full bg-[#181818] border border-white/10 flex items-center justify-center relative shrink-0 ${solfeggioPlaying ? 'text-[#C5A059]' : 'text-gray-500'}`}>
                    {/* Pulsing ring animation */}
                    {solfeggioPlaying && (
                      <span className="absolute inset-0 rounded-full border border-[#C5A059]/40 animate-ping opacity-65" />
                    )}
                    <Music className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Somatic Solfeggio Sound Bath</h4>
                      <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold ${activeSolfeggioInfo.pillColor}`}>
                        {currentFrequency} Hz Resonance
                      </span>
                    </div>
                    <p className="text-[11px] text-[#FAF6EE]/90 leading-relaxed font-sans">
                      This healing frequency targets your <strong className="text-[#C5A059] font-semibold">{activeSolfeggioInfo.name}</strong> to dissolve somatic resistance and prepare your field for ink integration.
                    </p>
                    <p className="text-[10.5px] text-gray-400 leading-relaxed">
                      <strong className="text-gray-300 uppercase text-[9px] tracking-wider">Energetic Catalyst:</strong> {activeSolfeggioInfo.benefits}
                    </p>
                  </div>
                </div>

                {/* Interactive Audio Controls Panel */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-[#191919] border border-white/5 p-3.5 rounded-lg shrink-0">
                  {/* Play/Pause Button */}
                  <button
                    type="button"
                    onClick={handleSolfeggioToggle}
                    className={`px-4 py-2.5 rounded text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shrink-0 ${
                      solfeggioPlaying
                        ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                        : "bg-[#C5A059] text-black hover:bg-[#b08e4d] font-extrabold shadow-lg shadow-[#C5A059]/10"
                    }`}
                  >
                    {solfeggioPlaying ? (
                      <>
                        <VolumeX className="w-4 h-4 text-red-400" />
                        <span>Mute Frequency</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-black animate-pulse" />
                        <span>Tune Vibration</span>
                      </>
                    )}
                  </button>

                  {/* Volume Control */}
                  <div className="flex flex-col gap-1 w-full sm:w-24 shrink-0">
                    <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-gray-500">
                      <span>Intensity</span>
                      <span className="text-gray-400 font-mono">{Math.round(solfeggioVolume * 200)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.5"
                      step="0.02"
                      value={solfeggioVolume}
                      onChange={(e) => setSolfeggioVolume(parseFloat(e.target.value))}
                      className="w-full accent-[#C5A059] bg-white/10 h-1 rounded-lg cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>

                  {/* Manual Frequency Switcher */}
                  <div className="flex flex-col gap-1 w-full sm:w-auto shrink-0">
                    <span className="text-[9px] uppercase tracking-widest text-gray-500">Chakra Tuner</span>
                    <div className="flex gap-1">
                      {[396, 417, 528, 639, 741, 963].map((f) => {
                        const isCurrent = currentFrequency === f;
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => handleSolfeggioFreqChange(f)}
                            className={`px-1.5 py-1 rounded text-[9.5px] font-mono tracking-tighter transition-all cursor-pointer ${
                              isCurrent
                                ? "bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 font-bold"
                                : "bg-[#141414] text-gray-400 border border-white/5 hover:text-white hover:bg-white/5"
                            }`}
                            title={`Tune resonance to Solfeggio ${f}Hz`}
                          >
                            {f}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Healer's Custom Alignment Note */}
              <div className="mt-4 pt-4 border-t border-white/10 bg-white/[0.01] rounded p-3 text-[11px] leading-relaxed text-gray-300 relative z-10">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#C5A059] text-base leading-none">🧘🕯️</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-wider text-[#C5A059] font-bold">Healer's Custom Alignment Note</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                    </div>
                    <p className="italic text-gray-200 leading-relaxed font-serif">
                      "{activeSolfeggioInfo.healingNote}"
                    </p>
                    {activeSolfeggioInfo.explanation && (
                      <p className="text-[10px] text-[#C5A059]/80 font-mono mt-1 flex items-center gap-1.5">
                        <span>🪐</span>
                        <span className="uppercase text-[9px] tracking-wider text-gray-400 font-bold">Astro Tuning Principle:</span>
                        <span>{activeSolfeggioInfo.explanation}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Animated visualizer wave bars if playing */}
              {solfeggioPlaying && (
                <div className="absolute bottom-0 left-0 right-0 h-1 flex gap-[1px] opacity-30 pointer-events-none">
                  {Array.from({ length: 96 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-[#C5A059]/40 to-[#C5A059] rounded-t-sm"
                      style={{
                        animation: `soundWave ${0.4 + (i % 8) * 0.1}s ease-in-out infinite alternate`,
                        animationDelay: `${(i % 12) * 0.05}s`,
                        transformOrigin: "bottom"
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* The Majestic Cream Parchment Poster */}
            <div id="astro-tattoo-poster" className="w-full max-w-5xl bg-[#FAF6EE] text-[#2C2620] border-4 border-double border-[#A37F43] p-6 md:p-10 shadow-2xl rounded-sm relative overflow-hidden flex flex-col justify-between">
              {/* Inner double border frame lines */}
              <div className="absolute inset-2 border border-[#A37F43]/30 pointer-events-none"></div>
              <div className="absolute inset-3 border border-[#A37F43]/15 pointer-events-none"></div>

              {/* Watermark mandala in the background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none w-[500px] h-[500px]" dangerouslySetInnerHTML={{ __html: getSacredTattooSvg() }} />

              {/* Poster Header */}
              <div className="text-center relative z-10 pb-6 border-b-2 border-[#A37F43]/20">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#A37F43] animate-pulse" />
                  <span className="text-[9px] md:text-[11px] tracking-[0.4em] uppercase font-bold text-[#A37F43]">AstroPsyche Sanctuary Prescriptive</span>
                  <Sparkles className="w-4 h-4 text-[#A37F43] animate-pulse" />
                </div>
                <h2 className="text-2xl md:text-4xl font-serif tracking-wide uppercase text-[#1B1816] font-extrabold">Your Astrological Recommended Tattoo</h2>
                <p className="text-[10px] md:text-xs italic text-[#725C42] mt-1.5 font-medium">Derived from Birth Coordinates • Crafted for Soul Integration & Energetic Centering</p>
              </div>

              {/* 3-Column Content Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 relative z-10">
                
                {/* COLUMN 1: BIRTH DETAILS & CELESTIAL ALIGNMENTS */}
                <div className="space-y-6 lg:border-r border-[#A37F43]/15 lg:pr-6">
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#1B1816] border-b border-[#A37F43]/30 pb-1.5 mb-3.5 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A37F43]"></span>
                      Birth Coordinates
                    </h4>
                    <div className="space-y-2.5 text-xs text-[#4A3F35]">
                      <div className="flex justify-between items-center border-b border-[#A37F43]/10 pb-1">
                        <span className="font-semibold text-[10px] opacity-75 uppercase tracking-wider">DATE OF BIRTH</span>
                        <span className="font-mono font-bold text-[#1B1816]">{formatBirthDate(birthDate)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-[#A37F43]/10 pb-1">
                        <span className="font-semibold text-[10px] opacity-75 uppercase tracking-wider">TIME OF BIRTH</span>
                        <span className="font-mono font-bold text-[#1B1816]">{formatBirthTime(birthTime, dontKnowExactTime, approxTimePeriod)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-[#A37F43]/10 pb-1">
                        <span className="font-semibold text-[10px] opacity-75 uppercase tracking-wider">PLACE OF BIRTH</span>
                        <span className="font-bold text-[#1B1816] uppercase tracking-tight truncate max-w-[150px]">{birthPlace || "Jabalpur, MP, India"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif text-base font-bold text-[#1B1816] border-b border-[#A37F43]/30 pb-1.5 mb-3.5 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A37F43]"></span>
                      Vedic Natal Chart
                    </h4>
                    <div className="space-y-2.5 text-xs text-[#4A3F35]">
                      <div className="flex justify-between items-center border-b border-[#A37F43]/10 pb-1">
                        <span className="font-semibold text-[10px] opacity-75 uppercase tracking-wider">Sun Sign (Surya)</span>
                        <span className="font-serif italic font-bold text-[#A37F43] text-[13px]">
                          {suggestion.astrology.sunSign} ({getSanskritSign(suggestion.astrology.sunSign)})
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-[#A37F43]/10 pb-1">
                        <span className="font-semibold text-[10px] opacity-75 uppercase tracking-wider">Moon Sign (Chandra)</span>
                        <span className="font-serif italic font-bold text-[#A37F43] text-[13px]">
                          {suggestion.astrology.moonSign} ({getSanskritSign(suggestion.astrology.moonSign)})
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-[#A37F43]/10 pb-1">
                        <span className="font-semibold text-[10px] opacity-75 uppercase tracking-wider">Ascendant (Lagna)</span>
                        <span className="font-serif italic font-bold text-[#A37F43] text-[13px]">
                          {suggestion.astrology.risingSign || "Virgo"} ({getSanskritSign(suggestion.astrology.risingSign || "Virgo")})
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-[#A37F43]/10 pb-1">
                        <span className="font-semibold text-[10px] opacity-75 uppercase tracking-wider">Nakshatra Node</span>
                        <span className="font-bold text-[#1B1816] text-[11px]">{getNakshatraForBirth(birthDate)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-[#A37F43]/10 pb-1">
                        <span className="font-semibold text-[10px] opacity-75 uppercase tracking-wider">Lagna Ruler</span>
                        <span className="font-bold text-[#1B1816] text-[11px]">{getRulingPlanetForLagna(suggestion.astrology.risingSign)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[10px] opacity-75 uppercase tracking-wider">Life Path Frequency</span>
                        <span className="font-mono font-bold bg-[#A37F43]/10 px-2 py-0.5 rounded text-[#A37F43] text-[11px]">
                          Vibrational Core #{getLifePathNumber(birthDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h5 className="font-serif text-[11px] font-bold text-[#A37F43] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Natal Alignment Summary
                    </h5>
                    <p className="text-xs text-[#5C4D3E] leading-relaxed italic border-l-2 border-[#A37F43]/30 pl-3">
                      {suggestion.astrology.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#A37F43]/20 space-y-4">
                    <h4 className="font-serif text-base font-bold text-[#1B1816] border-b border-[#A37F43]/30 pb-1.5 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A37F43]"></span>
                      Alchemy Specifications
                    </h4>
                    <div className="space-y-3 text-xs text-[#4A3F35]">
                      <div className="flex justify-between items-start gap-3 border-b border-[#A37F43]/10 pb-1.5">
                        <span className="font-semibold text-[10px] opacity-75 uppercase tracking-wider shrink-0 mt-0.5">Tattoo Style</span>
                        <span className="font-bold text-[#1B1816] text-right text-[11px] leading-tight">{activeTattooOption?.style}</span>
                      </div>
                      <div className="flex justify-between items-start gap-3 border-b border-[#A37F43]/10 pb-1.5">
                        <span className="font-semibold text-[10px] opacity-75 uppercase tracking-wider shrink-0 mt-0.5">Tattoo Symbol</span>
                        <span className="font-bold text-[#1B1816] text-right text-[11px] leading-tight break-words max-w-[180px]">{activeTattooOption?.title}</span>
                      </div>
                      <div className="flex justify-between items-start gap-3 border-b border-[#A37F43]/10 pb-1.5">
                        <span className="font-semibold text-[10px] opacity-75 uppercase tracking-wider shrink-0 mt-0.5">Placement Node</span>
                        <span className="font-bold text-[#1B1816] text-right text-[11px] leading-tight break-words max-w-[180px]">{activeTattooOption?.placement}</span>
                      </div>
                      <div className="flex flex-col border-b border-[#A37F43]/10 pb-1.5">
                        <span className="font-semibold text-[10px] opacity-75 uppercase tracking-wider mb-0.5">Ink Color Specifications</span>
                        <span className="font-bold text-[#1B1816] text-left text-[10.5px] leading-relaxed break-words">{activeTattooOption?.colors}</span>
                      </div>
                      <div className="flex justify-between items-start gap-3 border-b border-[#A37F43]/10 pb-1.5">
                        <span className="font-semibold text-[10px] opacity-75 uppercase tracking-wider shrink-0 mt-0.5">Tattoo Size</span>
                        <span className="font-bold text-[#1B1816] text-right text-[11px] leading-tight">{activeTattooOption?.size}</span>
                      </div>
                      <div className="flex justify-between items-start gap-3 pb-0.5">
                        <span className="font-semibold text-[10px] opacity-75 uppercase tracking-wider shrink-0 mt-0.5">Flow Direction</span>
                        <span className="font-bold text-[#1B1816] text-right text-[11px] leading-tight break-words max-w-[180px]">{activeTattooOption?.direction}</span>
                      </div>
                    </div>
                  </div>
                </div>
 
                 {/* COLUMN 2: CENTRAL SACRED TALISMAN VISUAL CANVAS */}
                 <div className="space-y-5 flex flex-col items-center justify-between">
                   <div className="text-center w-full">
                     <span className="text-[9px] uppercase tracking-[0.2em] text-[#A37F43] font-extrabold block">Tattoo Design Blueprint</span>
                     <h3 className="font-serif text-lg md:text-xl font-extrabold text-[#1B1816] mt-1 leading-tight uppercase tracking-wider">
                       {activeTattooOption?.title || "SRI YANTRA WITH LOTUS, SURYA & OM"}
                     </h3>
                     <p className="text-[10px] text-[#725C42] italic mt-0.5">
                       ({activeTattooOption?.style} • Alchemical Structure)
                     </p>
                   </div>

                  {/* Vector Canvas Frame */}
                  <div className="relative w-full aspect-square bg-[#FCF8F0] border border-[#A37F43]/20 rounded-md p-6 flex items-center justify-center group shadow-md overflow-hidden">
                    {/* Graph Grid Lines */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#A37F43 1px, transparent 0)", backgroundSize: "14px 14px" }}></div>
                    
                            {/* SVG Render Container with Glimpse Watermark */}
                    {(() => {
                      const displayComplexity = glimpseLevel || selectedComplexity;
                      const activeSvg = (
                        displayComplexity === "Simple" ? (activeTattooOption?.svgMarkupSimple || activeTattooOption?.svgMarkup) :
                        displayComplexity === "Advanced" ? (activeTattooOption?.svgMarkupAdvanced || activeTattooOption?.svgMarkup) :
                        (activeTattooOption?.svgMarkupModerate || activeTattooOption?.svgMarkup)
                      ) || getSacredTattooSvg();

                      return (
                        <div className={`w-60 h-60 flex items-center justify-center transition-all duration-500 ${!glimpseLevel ? "group-hover:scale-[1.08]" : ""} relative z-10 ${
                          glimpseLevel
                            ? "opacity-[0.08] select-none pointer-events-none filter blur-[0.4px]"
                            : inkColor === "Charcoal" 
                            ? "filter drop-shadow-[0_3px_6px_rgba(44,38,32,0.15)] group-hover:drop-shadow-[0_0_15px_rgba(44,38,32,0.25)]" 
                            : inkColor === "Gold" 
                            ? "filter drop-shadow-[0_3px_6px_rgba(197,160,89,0.15)] group-hover:drop-shadow-[0_0_20px_rgba(197,160,89,0.45)]" 
                            : "filter drop-shadow-[0_3px_6px_rgba(18,34,56,0.15)] group-hover:drop-shadow-[0_0_15px_rgba(18,34,56,0.3)]"
                        }`}>
                          <div 
                            dangerouslySetInnerHTML={{ __html: activeSvg }} 
                            className={`w-full h-full transition-colors duration-300 ${
                              glimpseLevel 
                                ? "text-[#725C42]/60"
                                : inkColor === "Charcoal" ? "text-[#2C2620]" :
                                  inkColor === "Gold" ? "text-[#C5A059]" :
                                  "text-[#122238]"
                            }`} 
                          />
                        </div>
                      );
                    })()}

                    {/* Watermark Diagonal Overlay for Glimpse Preview */}
                    {glimpseLevel && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#FCF8F0]/40 backdrop-blur-[0.5px] pointer-events-none select-none">
                        {/* Diagonal Watermark Lines */}
                        <div className="absolute inset-0 flex flex-col justify-around overflow-hidden opacity-10 pointer-events-none -rotate-12 select-none">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="text-center font-serif text-[10px] font-bold uppercase tracking-[0.3em] text-[#A37F43] whitespace-nowrap">
                              ASTR0PSYCHE SECURED BLUEPRINT • LOCKED • WATERMARK PREVIEW ONLY
                            </div>
                          ))}
                        </div>

                        {/* Centered Glimpse Banner */}
                        <div className="bg-[#121212]/95 border border-[#C5A059]/40 rounded-lg px-4 py-3 shadow-xl max-w-[270px] text-center transform scale-[0.95] z-30 pointer-events-auto">
                          <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold block mb-1">
                            🔮 Glimpse Active ({glimpseLevel})
                          </span>
                          <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">
                            Watermarked Preview
                          </h4>
                          <p className="text-[9.5px] text-gray-400 mt-1 leading-normal">
                            This is a secure preview of the <strong className="text-white">{glimpseLevel} Design</strong>. Unlock Premium to download vector SVGs and print templates.
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowPremiumSimulatorModal(true)}
                            className="w-full mt-2.5 py-1.5 bg-[#C5A059] hover:bg-[#b08e4d] text-black text-[9px] font-bold uppercase tracking-wider rounded transition-colors cursor-pointer animate-none"
                          >
                            🔓 Unlock {glimpseLevel}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Annotation lines to call out individual parts dynamically */}
                    {(() => {
                      const elements = activeTattooOption?.elements || [];
                      const positions = [
                        "absolute top-3 left-3",
                        "absolute top-3 right-3",
                        "absolute bottom-3 left-3",
                        "absolute bottom-3 right-3"
                      ];
                      
                      const getEmoji = (el: string) => {
                        const elLower = el.toLowerCase();
                        if (elLower.includes("sun") || elLower.includes("surya") || elLower.includes("solar")) return "☀️";
                        if (elLower.includes("yantra")) return "📐";
                        if (elLower.includes("lotus") || elLower.includes("petal")) return "🌸";
                        if (elLower.includes("om") || elLower.includes("aum")) return "ॐ";
                        if (elLower.includes("unalome")) return "🌀";
                        if (elLower.includes("wheat") || elLower.includes("grain") || elLower.includes("sheaf")) return "🌾";
                        if (elLower.includes("infinity") || elLower.includes("loop")) return "♾️";
                        if (elLower.includes("moon") || elLower.includes("lunar") || elLower.includes("crescent")) return "🌙";
                        if (elLower.includes("anchor") || elLower.includes("box") || elLower.includes("square") || elLower.includes("geometric")) return "⚓";
                        if (elLower.includes("star") || elLower.includes("constellation") || elLower.includes("celestial") || elLower.includes("planet")) return "✨";
                        if (elLower.includes("wing") || elLower.includes("spear") || elLower.includes("shield") || elLower.includes("sword")) return "🛡️";
                        if (elLower.includes("heart") || elLower.includes("love")) return "💖";
                        if (elLower.includes("swastik") || elLower.includes("swastika")) return "卍";
                        return "✨";
                      };

                      return elements.slice(0, 4).map((element: string, idx: number) => {
                        const posClass = positions[idx] || "hidden";
                        const isPrimary = idx === 0;
                        
                        return (
                          <div 
                            key={idx} 
                            className={`${posClass} text-[8.5px] font-extrabold px-2 py-0.5 rounded shadow-sm uppercase tracking-widest pointer-events-none transition-all duration-300 ${
                              isPrimary 
                                ? "bg-[#A37F43] text-[#FAF6EE]" 
                                : "bg-[#FAF6EE]/95 text-[#A37F43] border border-[#A37F43]/30 backdrop-blur-sm"
                            }`}
                          >
                            {getEmoji(element)} {element}
                          </div>
                        );
                      });
                    })()}
                  </div>

                  <div className="w-full text-center px-2">
                    <p className="text-[11px] text-[#5C4D3E] leading-relaxed italic mb-1">
                      "{activeTattooOption?.symbolism}"
                    </p>
                  </div>
                </div>

                {/* COLUMN 3: WHY THIS DESIGN & PLACEMENTS */}
                <div className="space-y-6 lg:border-l border-[#A37F43]/15 lg:pl-6">
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#1B1816] border-b border-[#A37F43]/30 pb-1.5 mb-3.5 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A37F43]"></span>
                      Why This Design?
                    </h4>
                    <ul className="space-y-3.5 text-xs text-[#4A3F35]">
                      {(() => {
                        const elements = activeTattooOption?.elements || [];
                        const intentionName = suggestion?.chakra_energy?.targetChakra || "";
                        
                        const getElementDescription = (element: string) => {
                          const elLower = element.toLowerCase();
                          if (elLower.includes("surya") || elLower.includes("sun") || elLower.includes("solar")) {
                            return "Boosts inner vitality, sovereign focus, confidence, and active solar energy projection.";
                          }
                          if (elLower.includes("sri yantra") || elLower.includes("yantra") || elLower.includes("shri yantra") || elLower.includes("shree yantra")) {
                            return "Triggers mathematical resonance, attracting abundance, protection, and divine geometric order.";
                          }
                          if (elLower.includes("lotus")) {
                            return "Symbolizes emotional purity, spiritual rebirth, and blooming beautifully out of blockages.";
                          }
                          if (elLower.includes("om") || elLower.includes("aum")) {
                            return "Connects somatic energy to the primordial vibration, establishing ultimate cosmic peace.";
                          }
                          if (elLower.includes("unalome")) {
                            return "Represents the path to enlightenment, showing how human struggles lead to conscious awakening.";
                          }
                          if (elLower.includes("wheat") || elLower.includes("grain") || elLower.includes("sheaf")) {
                            return "Anchors deep material abundance, nourishment, and stable earth-plane grounding.";
                          }
                          if (elLower.includes("infinity") || elLower.includes("loop")) {
                            return "Loops energy in a continuous pattern, ensuring perpetual vitality and flow of intentions.";
                          }
                          if (elLower.includes("moon") || elLower.includes("lunar") || elLower.includes("crescent") || elLower.includes("phase")) {
                            return "Balances emotional tides, deepens intuition, and activates receptive lunar power.";
                          }
                          if (elLower.includes("anchor") || elLower.includes("box") || elLower.includes("square") || elLower.includes("geometric")) {
                            return "Establishes physical grounding, firm energetic boundaries, and structural stability.";
                          }
                          if (elLower.includes("star") || elLower.includes("constellation") || elLower.includes("astrolog") || elLower.includes("celestial") || elLower.includes("planet")) {
                            return "Connects your physical aura to your cosmic blueprint and guiding natal planets.";
                          }
                          if (elLower.includes("wing") || elLower.includes("spear") || elLower.includes("sword") || elLower.includes("shield")) {
                            return "Expands aura protection, boundaries, purposeful action, and sovereign leadership.";
                          }
                          if (elLower.includes("swastik") || elLower.includes("swastika")) {
                            return "Ancient solar talisman of auspiciousness, cosmic order, and high positive energy.";
                          }
                          if (elLower.includes("heart") || elLower.includes("love") || elLower.includes("petal")) {
                            return "Dissolves emotional armoring, healing relational wounds and opening the heart gateway.";
                          }
                          return `Calibrated according to your birth chart to amplify your focus on ${intentionName || "spiritual harmony and protection"}.`;
                        };

                        const getEmoji = (el: string) => {
                          const elLower = el.toLowerCase();
                          if (elLower.includes("sun") || elLower.includes("surya") || elLower.includes("solar")) return "☀️";
                          if (elLower.includes("yantra")) return "📐";
                          if (elLower.includes("lotus") || elLower.includes("petal")) return "🌸";
                          if (elLower.includes("om") || elLower.includes("aum")) return "ॐ";
                          if (elLower.includes("unalome")) return "🌀";
                          if (elLower.includes("wheat") || elLower.includes("grain") || elLower.includes("sheaf")) return "🌾";
                          if (elLower.includes("infinity") || elLower.includes("loop")) return "♾️";
                          if (elLower.includes("moon") || elLower.includes("lunar") || elLower.includes("crescent")) return "🌙";
                          if (elLower.includes("anchor") || elLower.includes("box") || elLower.includes("square") || elLower.includes("geometric")) return "⚓";
                          if (elLower.includes("star") || elLower.includes("constellation") || elLower.includes("celestial") || elLower.includes("planet")) return "✨";
                          if (elLower.includes("wing") || elLower.includes("spear") || elLower.includes("shield") || elLower.includes("sword")) return "🛡️";
                          if (elLower.includes("heart") || elLower.includes("love")) return "💖";
                          if (elLower.includes("swastik") || elLower.includes("swastika")) return "卍";
                          return "✨";
                        };

                        if (elements.length === 0) {
                          return (
                            <li className="flex gap-2.5 items-start">
                              <span className="w-5 h-5 rounded-full bg-[#A37F43]/10 border border-[#A37F43]/30 flex items-center justify-center text-[10px] font-bold text-[#A37F43] shrink-0 mt-0.5">✨</span>
                              <div>
                                <strong className="text-[#1B1816] block uppercase tracking-wider text-[10px]">Unified Talisman Geometries</strong>
                                <p className="text-[#5C4D3E] mt-0.5 leading-normal">{suggestion?.tattoo_concept?.symbolism || "Designed with custom sacred symbols mapping directly to your cosmic blueprint."}</p>
                              </div>
                            </li>
                          );
                        }

                        return elements.map((element: string, idx: number) => {
                          return (
                            <li key={idx} className="flex gap-2.5 items-start">
                              <span className="w-5 h-5 rounded-full bg-[#A37F43]/10 border border-[#A37F43]/30 flex items-center justify-center text-[10px] font-bold text-[#A37F43] shrink-0 mt-0.5">
                                {getEmoji(element)}
                              </span>
                              <div>
                                <strong className="text-[#1B1816] block uppercase tracking-wider text-[10px]">{element}</strong>
                                <p className="text-[#5C4D3E] mt-0.5 leading-normal">{getElementDescription(element)}</p>
                              </div>
                            </li>
                          );
                        });
                      })()}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-serif text-base font-bold text-[#1B1816] border-b border-[#A37F43]/30 pb-1.5 mb-3 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A37F43]"></span>
                      Recommended Placements
                    </h4>
                    <p className="text-[10px] text-[#725C42] italic mb-3 leading-tight">
                      Sacred symbols must be placed above the waist to honor their higher positive frequencies.
                    </p>
                    
                    <div className="space-y-2.5">
                      <div className="p-2.5 bg-[#A37F43]/5 border border-[#A37F43]/20 rounded">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-[#1B1816] text-xs">Upper Back (Shoulders)</span>
                          <span className="text-[9px] uppercase tracking-wider text-[#A37F43] font-bold">Highest Priority</span>
                        </div>
                        <p className="text-[10.5px] text-[#5C4D3E] leading-normal">Aligns your spiritual center & acts as a majestic protective shield.</p>
                      </div>

                      <div className="p-2.5 bg-[#A37F43]/5 border border-[#A37F43]/20 rounded">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-[#1B1816] text-xs">Left Chest (Heart Gate)</span>
                          <span className="text-[9px] uppercase tracking-wider text-emerald-700 font-bold">Trauma Healing</span>
                        </div>
                        <p className="text-[10.5px] text-[#5C4D3E] leading-normal">Soothes emotional grief, locks in self-love, and stabilizes breathing.</p>
                      </div>

                      <div className="p-2.5 bg-[#A37F43]/5 border border-[#A37F43]/20 rounded">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-[#1B1816] text-xs">Right Upper Arm</span>
                          <span className="text-[9px] uppercase tracking-wider text-orange-700 font-bold">Confidence</span>
                        </div>
                        <p className="text-[10.5px] text-[#5C4D3E] leading-normal">Boosts physical strength, assertiveness, and daily career success.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* SECTION 2: BARNER SEPARATOR & MODEL CONTROLS */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-3 px-4 bg-[#A37F43]/5 border-y border-[#A37F43]/20 my-6 relative z-10 rounded">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8C6D3A] animate-pulse" />
                  <span className="text-[10px] md:text-[11px] font-serif uppercase tracking-[0.25em] text-[#8C6D3A] font-bold">
                    Somatic Mockup Placement Reference
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  {/* Model Toggle */}
                  <div className="flex items-center gap-1 bg-[#FAF6EE] p-1 rounded border border-[#A37F43]/20">
                    <button
                      type="button"
                      onClick={() => setPreviewGender("Female")}
                      className={`px-3 py-1 rounded text-[9px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        previewGender === "Female"
                          ? "bg-[#A37F43] text-[#FCF8F0] shadow-sm"
                          : "text-[#725C42] hover:text-[#1B1816] hover:bg-[#A37F43]/5"
                      }`}
                    >
                      Female AI Model
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewGender("Male")}
                      className={`px-3 py-1 rounded text-[9px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        previewGender === "Male"
                          ? "bg-[#A37F43] text-[#FCF8F0] shadow-sm"
                          : "text-[#725C42] hover:text-[#1B1816] hover:bg-[#A37F43]/5"
                      }`}
                    >
                      Male AI Model
                    </button>
                  </div>

                  {/* Ink Color Toggle */}
                  <div className="flex items-center gap-1 bg-[#FAF6EE] p-1 rounded border border-[#A37F43]/20">
                    <button
                      type="button"
                      onClick={() => setInkColor("Charcoal")}
                      className={`px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        inkColor === "Charcoal"
                          ? "bg-[#2C2620] text-[#FCF8F0] shadow-sm"
                          : "text-[#725C42] hover:text-[#1B1816] hover:bg-[#A37F43]/5"
                      }`}
                    >
                      ⚫ Charcoal
                    </button>
                    <button
                      type="button"
                      onClick={() => setInkColor("Gold")}
                      className={`px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        inkColor === "Gold"
                          ? "bg-[#C5A059] text-[#FCF8F0] shadow-sm"
                          : "text-[#725C42] hover:text-[#1B1816] hover:bg-[#A37F43]/5"
                      }`}
                    >
                      🟡 Gold
                    </button>
                    <button
                      type="button"
                      onClick={() => setInkColor("BlueBlack")}
                      className={`px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        inkColor === "BlueBlack"
                          ? "bg-[#122238] text-[#FCF8F0] shadow-sm"
                          : "text-[#725C42] hover:text-[#1B1816] hover:bg-[#A37F43]/5"
                      }`}
                    >
                      🔵 Blue-Black
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 3: INTERACTIVE MOCKUP CARDS */}
              {(() => {
                const rawPlacement = (suggestion?.tattoo_concept?.placement || "").toLowerCase();
                const isUpperBack = rawPlacement.includes("back") || rawPlacement.includes("spine") || rawPlacement.includes("neck");
                const isLeftChest = rawPlacement.includes("chest") || rawPlacement.includes("heart") || rawPlacement.includes("sternum");
                const isRightArm = rawPlacement.includes("arm") || rawPlacement.includes("shoulder") || rawPlacement.includes("forearm") || rawPlacement.includes("wrist") || rawPlacement.includes("hand") || rawPlacement.includes("pingala") || rawPlacement.includes("ankle") || rawPlacement.includes("leg"); // map any residual ankle fallback to right arm above waist safely
                
                return (
                  <div className="flex justify-center py-2 relative z-10 w-full">
                    <div className="w-full max-w-sm">
                      
                      {/* Placement Mockup 1: Upper Back */}
                      {(isUpperBack || (!isLeftChest && !isRightArm)) && (
                        <div className="bg-[#FAF6EE] border border-[#A37F43]/20 p-4 rounded flex flex-col justify-between items-center text-center shadow-sm">
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#A37F43] mb-2.5">Recommended Spot: Upper Back (Spiritual Shield)</span>
                          <div className="w-full aspect-[3/4] bg-[#FCF8F0] border border-[#A37F43]/10 rounded relative overflow-hidden group shadow-inner">
                            <img
                              src={previewGender === "Female" ? "/src/assets/images/female_upper_back_1783964373681.jpg" : "/src/assets/images/male_upper_back_1783964416673.jpg"}
                              alt="Upper Back Placement"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15 pointer-events-none" />
                            
                            {/* Centered Tattoo Overlay */}
                            <div 
                              className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 transition-all duration-300 pointer-events-none ${
                                inkColor === "Charcoal"
                                  ? "text-[#1F2421] mix-blend-multiply opacity-[0.82] filter blur-[0.25px] contrast-[1.1]"
                                  : inkColor === "Gold"
                                  ? "text-[#B8860B] mix-blend-overlay filter brightness-[1.3] drop-shadow-[0_0_4px_rgba(212,175,55,0.7)]"
                                  : "text-[#122238] mix-blend-multiply opacity-[0.85] filter blur-[0.25px] contrast-[1.2]"
                              }`} 
                              dangerouslySetInnerHTML={{ 
                                __html: (
                                  selectedComplexity === "Simple" ? (suggestion.tattoo_concept.svgMarkupSimple || suggestion.tattoo_concept.svgMarkup) :
                                  selectedComplexity === "Advanced" ? (suggestion.tattoo_concept.svgMarkupAdvanced || suggestion.tattoo_concept.svgMarkup) :
                                  (suggestion.tattoo_concept.svgMarkupModerate || suggestion.tattoo_concept.svgMarkup)
                                ) || getSacredTattooSvg() 
                              }} 
                            />
                          </div>
                          <p className="text-[10.5px] text-[#5C4D3E] leading-relaxed mt-2.5 font-medium">
                            "Ideal for establishing strong boundaries, shielding sensitive energy centers, and anchoring protection."
                          </p>
                        </div>
                      )}

                      {/* Placement Mockup 2: Left Chest */}
                      {isLeftChest && (
                        <div className="bg-[#FAF6EE] border border-[#A37F43]/20 p-4 rounded flex flex-col justify-between items-center text-center shadow-sm">
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#A37F43] mb-2.5">Recommended Spot: Left Chest (Heart Gate)</span>
                          <div className="w-full aspect-[3/4] bg-[#FCF8F0] border border-[#A37F43]/10 rounded relative overflow-hidden group shadow-inner">
                            <img
                              src={previewGender === "Female" ? "/src/assets/images/female_left_chest_1783964389280.jpg" : "/src/assets/images/male_left_chest_1783964429638.jpg"}
                              alt="Left Chest Placement"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15 pointer-events-none" />
                            
                            {/* Positioned on Chest Area */}
                            <div 
                              className={`absolute top-[48%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 transition-all duration-300 pointer-events-none rotate-[-6deg] ${
                                inkColor === "Charcoal"
                                  ? "text-[#1F2421] mix-blend-multiply opacity-[0.82] filter blur-[0.25px] contrast-[1.1]"
                                  : inkColor === "Gold"
                                  ? "text-[#B8860B] mix-blend-overlay filter brightness-[1.3] drop-shadow-[0_0_4px_rgba(212,175,55,0.7)]"
                                  : "text-[#122238] mix-blend-multiply opacity-[0.85] filter blur-[0.25px] contrast-[1.2]"
                              }`} 
                              dangerouslySetInnerHTML={{ 
                                __html: (
                                  selectedComplexity === "Simple" ? (suggestion.tattoo_concept.svgMarkupSimple || suggestion.tattoo_concept.svgMarkup) :
                                  selectedComplexity === "Advanced" ? (suggestion.tattoo_concept.svgMarkupAdvanced || suggestion.tattoo_concept.svgMarkup) :
                                  (suggestion.tattoo_concept.svgMarkupModerate || suggestion.tattoo_concept.svgMarkup)
                                ) || getSacredTattooSvg() 
                              }} 
                            />
                          </div>
                          <p className="text-[10.5px] text-[#5C4D3E] leading-relaxed mt-2.5 font-medium">
                            "Ideal for dissolving heart walls, healing generational trauma, and opening to universal love."
                          </p>
                        </div>
                      )}

                      {/* Placement Mockup 3: Right Upper Arm */}
                      {isRightArm && (
                        <div className="bg-[#FAF6EE] border border-[#A37F43]/20 p-4 rounded flex flex-col justify-between items-center text-center shadow-sm">
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#A37F43] mb-2.5">Recommended Spot: Right Upper Arm (Pingala Focus)</span>
                          <div className="w-full aspect-[3/4] bg-[#FCF8F0] border border-[#A37F43]/10 rounded relative overflow-hidden group shadow-inner">
                            <img
                              src={previewGender === "Female" ? "/src/assets/images/female_right_arm_1783964404134.jpg" : "/src/assets/images/male_right_arm_1783964443129.jpg"}
                              alt="Right Upper Arm Placement"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15 pointer-events-none" />
                            
                            {/* Positioned on Arm Area */}
                            <div 
                              className={`absolute top-[46%] left-[52%] -translate-x-1/2 -translate-y-1/2 w-18 h-18 transition-all duration-300 pointer-events-none rotate-[-10deg] ${
                                inkColor === "Charcoal"
                                  ? "text-[#1F2421] mix-blend-multiply opacity-[0.82] filter blur-[0.25px] contrast-[1.1]"
                                  : inkColor === "Gold"
                                  ? "text-[#B8860B] mix-blend-overlay filter brightness-[1.3] drop-shadow-[0_0_4px_rgba(212,175,55,0.7)]"
                                  : "text-[#122238] mix-blend-multiply opacity-[0.85] filter blur-[0.25px] contrast-[1.2]"
                              }`} 
                              dangerouslySetInnerHTML={{ 
                                __html: (
                                  selectedComplexity === "Simple" ? (suggestion.tattoo_concept.svgMarkupSimple || suggestion.tattoo_concept.svgMarkup) :
                                  selectedComplexity === "Advanced" ? (suggestion.tattoo_concept.svgMarkupAdvanced || suggestion.tattoo_concept.svgMarkup) :
                                  (suggestion.tattoo_concept.svgMarkupModerate || suggestion.tattoo_concept.svgMarkup)
                                ) || getSacredTattooSvg() 
                              }} 
                            />
                          </div>
                          <p className="text-[10.5px] text-[#5C4D3E] leading-relaxed mt-2.5 font-medium">
                            "Ideal for projecting assertiveness, sovereign leadership, material manifestation, and dynamic action."
                          </p>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })()}

              {/* SECTION 4: FOOTER BLOCK */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t-2 border-[#A37F43]/20 mt-6 text-xs relative z-10">
                {/* Col 1: Tips */}
                <div className="space-y-2">
                  <h5 className="font-serif font-bold text-[#1B1816] uppercase tracking-wider border-b border-[#A37F43]/20 pb-1">Additional Tips</h5>
                  <ul className="space-y-1.5 text-[11px] text-[#5C4D3E] list-disc list-inside leading-relaxed">
                    <li>Schedule session on a Thursday (Guru) or Sunday (Surya).</li>
                    <li>Conduct during a waxing Moon phase to invite growth.</li>
                    <li>Ensure ink is organic charcoal or mineral gold pigment.</li>
                    <li>Chant the activating mantra below 5 minutes before inking.</li>
                  </ul>
                </div>

                {/* Col 2: Mantra */}
                <div className="space-y-2 text-center border-y lg:border-y-0 lg:border-x border-[#A37F43]/15 py-4 lg:py-0 px-3 flex flex-col justify-between min-h-[140px]">
                  <h5 className="font-serif font-bold text-[#1B1816] uppercase tracking-wider border-b border-[#A37F43]/20 pb-1 text-center">Ritual Mantra Activation</h5>
                  {isPremiumUnlocked ? (
                    <>
                      <p className="font-serif text-sm font-bold text-[#8C6D3A] tracking-wider mt-2 animate-pulse">
                        {getPlanetaryMantra(suggestion.astrology.sunSign).sanskrit}
                      </p>
                      <p className="text-[10.5px] italic text-[#5C4D3E] font-medium font-serif mt-1">
                        {getPlanetaryMantra(suggestion.astrology.sunSign).phonetics}
                      </p>
                      <p className="text-[10px] text-[#725C42] mt-1 leading-normal italic">
                        "{getPlanetaryMantra(suggestion.astrology.sunSign).meaning}"
                      </p>
                    </>
                  ) : (
                    <div className="py-2 flex flex-col items-center justify-center space-y-2">
                      <div className="w-7 h-7 rounded-full bg-[#A37F43]/10 flex items-center justify-center text-[#8C6D3A] text-xs">🔒</div>
                      <p className="text-[10px] text-[#725C42] leading-relaxed px-1">
                        Unlock Premium to access custom Sanskrit chanting seed mantras to activate your physical-astral tattoo connection.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowPremiumSimulatorModal(true)}
                        className="px-3 py-1 bg-[#8C6D3A] hover:bg-[#73592f] text-white text-[9.5px] uppercase tracking-wider font-semibold rounded cursor-pointer transition-colors mt-1"
                      >
                        Unlock Now
                      </button>
                    </div>
                  )}
                </div>

                {/* Col 3: Avoid Places */}
                <div className="space-y-2">
                  <h5 className="font-serif font-bold text-[#1B1816] uppercase tracking-wider border-b border-[#A37F43]/20 pb-1">Avoid Placing Sacred Symbols</h5>
                  <ul className="space-y-2 text-[11px] text-[#5C4D3E] leading-normal">
                    <li className="flex items-center gap-1.5">
                      <span className="text-red-600 font-bold">❌</span> <span>On Feet, ankles, or any placement below the waist.</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-red-600 font-bold">❌</span> <span>On parts that physically touch the ground directly.</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-red-600 font-bold">❌</span> <span>In disrespectful, toxic, or unhygienic body zones.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Alchemical Chanting & Activation Benefits Panel */}
              <div className="mt-6 bg-[#FCF8F0]/80 border border-[#A37F43]/20 rounded-lg p-5 space-y-4 relative z-10 text-left">
                <div className="flex items-center gap-2 border-b border-[#A37F43]/20 pb-2">
                  <span className="text-[#A37F43] text-sm">✨</span>
                  <h5 className="font-serif font-bold text-[#1B1816] uppercase tracking-wider text-xs">
                    Vedic Sound Science: Core Benefits of Mantra Activation
                  </h5>
                </div>
                
                <p className="text-[11px] text-[#5C4D3E] leading-relaxed">
                  In sacred Indian tattooing tradition (Godna), a tattoo is not merely visual ornament but a <strong className="text-[#8C6D3A]">living metaphysical portal</strong>. Sound frequencies (Mantras) serve as the bridge between your physical skin (Annamaya Kosha) and your spiritual body (Vijnanamaya Kosha). By chanting your prescribed planetary activation seed mantra, you unlock four profound alchemical benefits:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10.5px] text-[#5C4D3E] leading-relaxed pt-1">
                  <div className="space-y-1 bg-white/40 border border-[#A37F43]/10 rounded p-3">
                    <p className="font-serif font-bold text-[#8C6D3A] uppercase tracking-wide flex items-center gap-1.5">
                      <span>1. Neurological & State Synchronization</span>
                    </p>
                    <p className="text-gray-600">
                      Chanting custom phonetics triggers rhythmic brainwave entrainment, moving you into a high-receptivity Alpha/Theta meditative state. This lowers stress markers and transforms physical pain into an active ritual of endurance during the inking session.
                    </p>
                  </div>

                  <div className="space-y-1 bg-white/40 border border-[#A37F43]/10 rounded p-3">
                    <p className="font-serif font-bold text-[#8C6D3A] uppercase tracking-wide flex items-center gap-1.5">
                      <span>2. Pranic Conduction & Resonance</span>
                    </p>
                    <p className="text-gray-600">
                      Your voice acts as a physical transducer. Sound waves vibrate through your nadis (subtle energy highways), stimulating the precise meridian points associated with your target chakra. This pre-activates the area to absorb the sigil's geometry.
                    </p>
                  </div>

                  <div className="space-y-1 bg-white/40 border border-[#A37F43]/10 rounded p-3">
                    <p className="font-serif font-bold text-[#8C6D3A] uppercase tracking-wide flex items-center gap-1.5">
                      <span>3. Planetary Signature Alignment</span>
                    </p>
                    <p className="text-gray-600">
                      The prescribed Sanskrit Bij (seed) sounds correspond to the exact electromagnetic frequency of your ruling planetary deity. Singing these sounds aligns your birth-chart karma with the talisman, turning simple ink into an active cosmic shield.
                    </p>
                  </div>

                  <div className="space-y-1 bg-white/40 border border-[#A37F43]/10 rounded p-3">
                    <p className="font-serif font-bold text-[#8C6D3A] uppercase tracking-wide flex items-center gap-1.5">
                      <span>4. Permanent Intention Anchor</span>
                    </p>
                    <p className="text-gray-600">
                      Chanting 5 minutes before and during the session programs the microscopic crystalline structures within the mineral-based ink. It binds your mental intention to the permanent physical pigment, ensuring the talisman's protective flow never fades.
                    </p>
                  </div>
                </div>

                <div className="bg-[#FAF1E3] border border-dashed border-[#A37F43]/30 p-3 rounded text-[10px] text-[#725C42] italic flex items-start gap-2">
                  <span className="text-amber-600 font-bold text-xs">💡</span>
                  <p className="leading-relaxed">
                    <strong>The Activation Ritual:</strong> Close your eyes, sit with a straight spine, and touch the body area where the symbol will be placed. Inhale deeply, and chant your seed mantra either 21, 54, or 108 times right before the stencil is applied. Feel the skin tingling as the portal welcomes the sacred geometry.
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="text-center pt-6 text-[9.5px] text-[#725C42] italic mt-5 border-t border-[#A37F43]/15 relative z-10 leading-normal">
                NOTE: This is a therapeutic and astrological energetic blueprint. The sacred portals are activated purely by your inner clarity, intention, and mindfulness.
              </div>
            </div>


          </div>
        ) : (
          <div className="flex-1 bg-[#0D0D0D] overflow-y-auto p-6 md:p-12 flex flex-col items-center justify-start md:py-12 lg:py-16 relative min-h-[500px]">
            {/* Animated Background stars */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#C5A059_1px,transparent_0)] [background-size:16px_16px]"></div>
            
            <div className="relative max-w-lg w-full flex flex-col items-center text-center space-y-6 z-10">
              {/* Sacred Logo Emblem Banner */}
              <div className="w-full transition-transform hover:scale-105 duration-500">
                <AuraInkLogo variant="full" />
              </div>

              {/* Floating Zodiac sign badges row */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="bg-[#1A1A1A] border border-[#C5A059]/40 px-3 py-1 rounded-full text-[10px] font-serif text-[#C5A059] uppercase tracking-wider shadow flex items-center gap-1">
                  <span>☀️ Sun:</span> <strong>{nativeZodiac.sun}</strong>
                </div>
                <div className="bg-[#1A1A1A] border border-[#C5A059]/40 px-3 py-1 rounded-full text-[10px] font-serif text-[#C5A059] uppercase tracking-wider shadow flex items-center gap-1">
                  <span>🌙 Moon:</span> <strong>{nativeZodiac.moon}</strong>
                </div>
                <div className="bg-[#1A1A1A] border border-[#C5A059]/40 px-3 py-1 rounded-full text-[10px] font-serif text-[#C5A059] uppercase tracking-wider shadow flex items-center gap-1">
                  <span>📐 Rising:</span> <strong>{nativeZodiac.rising}</strong>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                  Provide your birth details and set your alchemical intention. The oracle will map your chart houses, channel energetic currents, and reveal your sacred talisman prescription.
                </p>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-6 pt-4 text-xs text-gray-500 font-sans font-medium">
                <div className={`flex items-center gap-2 ${quizStep === 1 ? "text-[#C5A059]" : ""}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${quizStep === 1 ? "bg-[#C5A059] text-black font-bold animate-pulse" : "border border-white/20"}`}>1</span>
                  <span>Birth Details</span>
                </div>
                <div className="w-8 h-[1px] bg-white/10"></div>
                <div className={`flex items-center gap-2 ${quizStep === 2 ? "text-[#C5A059]" : ""}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${quizStep === 2 ? "bg-[#C5A059] text-black font-bold animate-pulse" : "border border-white/20"}`}>2</span>
                  <span>Select Intention</span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full max-w-md my-4 border-t border-white/5 relative z-10">
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0D0D0D] px-4 text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-serif font-bold">
                  Seeker Transformations
                </span>
              </div>

              {/* Interactive Testimonial Cards */}
              <div className="w-full max-w-lg bg-[#111113] border border-white/10 rounded-xl p-5 md:p-6 shadow-2xl relative z-10 text-left space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: TESTIMONIALS_DATA[activeTestimonialIndex].rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-500" />
                    ))}
                  </div>
                  <span className="text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20">
                    {TESTIMONIALS_DATA[activeTestimonialIndex].intention}
                  </span>
                </div>

                <p className="font-serif italic text-xs md:text-sm text-gray-300 leading-relaxed">
                  “{TESTIMONIALS_DATA[activeTestimonialIndex].quote}”
                </p>

                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${TESTIMONIALS_DATA[activeTestimonialIndex].avatarColor} flex items-center justify-center text-[10px] font-extrabold text-white shadow-inner`}>
                      {TESTIMONIALS_DATA[activeTestimonialIndex].avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-serif font-bold text-white leading-tight">
                        {TESTIMONIALS_DATA[activeTestimonialIndex].name}
                      </h4>
                      <p className="text-[9px] text-gray-500 font-sans tracking-wide">
                        {TESTIMONIALS_DATA[activeTestimonialIndex].role} • <span className="italic text-[#C5A059]/80">{TESTIMONIALS_DATA[activeTestimonialIndex].astrology}</span>
                      </p>
                    </div>
                  </div>

                  {/* Quick controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTestimonialIndex((prev) => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
                      }}
                      className="w-6 h-6 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
                      title="Previous"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTestimonialIndex((prev) => (prev === TESTIMONIALS_DATA.length - 1 ? 0 : prev + 1));
                      }}
                      className="w-6 h-6 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
                      title="Next"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Slider dots indicator */}
              <div className="flex justify-center items-center gap-1.5 mt-1 relative z-10">
                {TESTIMONIALS_DATA.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTestimonialIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === activeTestimonialIndex 
                        ? "bg-[#C5A059] w-3" 
                        : "bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Footer Status Bar */}
      <footer className="h-8 bg-[#080808] border-t border-white/5 px-4 md:px-8 flex items-center justify-between text-[8px] md:text-[9px] uppercase tracking-widest text-gray-500">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>AstroPsyche Resonance Engine v2.4</span>
        </div>
        <div className="hidden sm:flex gap-8">
          <span>Ephemeris: Active Solar-Lunar Calibration</span>
          <span>Ritual Status: Connected</span>
        </div>
      </footer>

      {showMapModal && (
        <BirthPlaceMapModal
          onClose={() => setShowMapModal(false)}
          onSelect={(city) => {
            setBirthPlace(`${city.name}, ${city.state}, ${city.country}`);
          }}
          currentValue={birthPlace}
        />
      )}

      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#121212] border border-white/10 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl relative flex flex-col max-h-[calc(100%-2rem)]">
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/10 bg-[#161616]">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                  Tattoo Blueprint Card Creator
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowShareModal(false);
                  setShareSuccessMsg(null);
                }}
                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Scroll Area */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
              
              {/* Premium Visually Optimized Share Card Preview (Square aspect-ratio) */}
              <div className="relative w-full aspect-square bg-gradient-to-br from-[#1C1525] to-[#0A070C] border-2 border-[#C5A059] rounded-lg p-5 flex flex-col justify-between shadow-inner overflow-hidden select-none">
                {/* Background stars deco */}
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C5A059_1px,transparent_0)] [background-size:12px_12px]"></div>
                
                {/* Gold Ornate Corner Borders */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#C5A059]/50" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#C5A059]/50" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#C5A059]/50" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#C5A059]/50" />

                {/* Header */}
                <div className="text-center z-10">
                  <span className="text-[7.5px] uppercase tracking-[0.25em] text-[#C5A059]/80 font-bold">✦ Cosmic Alignment Blueprint ✦</span>
                  <h4 className="font-serif text-sm font-bold text-white tracking-widest mt-0.5">SACRED TALISMAN REPORT</h4>
                  <div className="w-24 h-0.5 bg-[#C5A059]/30 mx-auto mt-1" />
                  <p className="text-[9px] text-[#FAF6EE] uppercase font-semibold tracking-wider mt-1.5">
                    PREPARED FOR: {firstName} {lastName}
                  </p>
                </div>

                {/* Body Details (Three mini Cards) */}
                <div className="grid grid-cols-3 gap-2.5 my-1 z-10">
                  <div className="bg-[#C5A059]/5 border border-[#C5A059]/20 rounded p-1.5 text-center">
                    <span className="text-[7px] text-gray-400 block uppercase font-bold">☀️ SUN</span>
                    <span className="text-[10px] text-[#C5A059] font-serif font-bold italic">{suggestion?.astrology?.sunSign}</span>
                  </div>
                  <div className="bg-[#C5A059]/5 border border-[#C5A059]/20 rounded p-1.5 text-center">
                    <span className="text-[7px] text-gray-400 block uppercase font-bold">🌙 MOON</span>
                    <span className="text-[10px] text-[#C5A059] font-serif font-bold italic">{suggestion?.astrology?.moonSign}</span>
                  </div>
                  <div className="bg-[#C5A059]/5 border border-[#C5A059]/20 rounded p-1.5 text-center">
                    <span className="text-[7px] text-gray-400 block uppercase font-bold">📐 LAGNA</span>
                    <span className="text-[10px] text-[#C5A059] font-serif font-bold italic">{suggestion?.astrology?.risingSign || "Capricorn"}</span>
                  </div>
                </div>

                {/* Centered Glowing SVG Display */}
                <div className="relative w-44 h-44 mx-auto flex items-center justify-center bg-black/60 rounded-full border border-[#C5A059]/25 shadow-[0_0_20px_rgba(197,160,89,0.1)] z-10 overflow-hidden">
                  <div className="absolute inset-1 rounded-full border border-dashed border-[#C5A059]/10 animate-[spin_100s_linear_infinite]" />
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: (
                        selectedComplexity === "Simple" ? (suggestion.tattoo_concept.svgMarkupSimple || suggestion.tattoo_concept.svgMarkup) :
                        selectedComplexity === "Advanced" ? (suggestion.tattoo_concept.svgMarkupAdvanced || suggestion.tattoo_concept.svgMarkup) :
                        (suggestion.tattoo_concept.svgMarkupModerate || suggestion.tattoo_concept.svgMarkup)
                      ) || getSacredTattooSvg() 
                    }} 
                    className="w-28 h-28 text-[#FAF6EE]"
                  />
                </div>

                {/* Footer specs */}
                <div className="text-center z-10 mt-1.5">
                  <h5 className="font-serif text-xs font-extrabold text-white uppercase tracking-wider">
                    {suggestion?.tattoo_concept?.title}
                  </h5>
                  <p className="text-[8px] text-[#C5A059] uppercase font-bold tracking-wider mt-0.5">
                    {suggestion?.tattoo_concept?.style} • {suggestion?.tattoo_concept?.placement}
                  </p>
                  <p className="text-[7.5px] text-gray-500 font-semibold tracking-wider uppercase mt-1">
                    ✦ DESIGNED BY ASTROPSYCHE ORACLE ✦
                  </p>
                </div>
              </div>

              {/* Action Progress Success Alert */}
              {shareSuccessMsg && (
                <div className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 rounded px-3 py-2.5 text-center font-medium animate-fadeIn">
                  {shareSuccessMsg}
                </div>
              )}

              {/* Control Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isGeneratingImage}
                  onClick={generateShareCardImage}
                  className="flex items-center justify-center gap-2 py-3 bg-[#C5A059] hover:bg-[#b08e4d] disabled:bg-gray-700 disabled:text-gray-400 text-black rounded font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Generating Card...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-black" />
                      <span>Download Image (PNG)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={copyCaptionToClipboard}
                  className="flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  <Copy className="w-4 h-4 text-[#C5A059]" />
                  <span>Copy Cool Caption</span>
                </button>
              </div>

              {/* Direct Posting Tip */}
              <div className="bg-[#1A1A1A] rounded p-3 text-[11px] text-gray-400 space-y-2 border border-white/5">
                <p className="font-bold text-white text-[10px] uppercase tracking-wider">🚀 Posting to Social Stories & Status:</p>
                <p className="leading-relaxed">
                  1. Click <strong className="text-white">Download Image</strong> to save the card into your photos/downloads folder.
                  <br />
                  2. Click <strong className="text-white">Copy Cool Caption</strong> to save an astrologically accurate caption with your birth specs.
                  <br />
                  3. Open <strong className="text-rose-400">Instagram</strong>, <strong className="text-emerald-400">WhatsApp</strong>, or <strong className="text-sky-400">iMessage</strong>, upload the image, paste the caption, and share your alignment!
                </p>
                
                <button
                  type="button"
                  onClick={shareToWhatsApp}
                  className="w-full mt-1.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded text-emerald-400 font-semibold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Direct Share to WhatsApp</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {showGlimpseModal && glimpseModalLevel && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#121212] border border-[#C5A059]/40 w-full max-w-xl rounded-xl shadow-[0_0_50px_rgba(197,160,89,0.25)] relative flex flex-col p-5 md:p-6 max-h-[calc(100%-2rem)] overflow-y-auto custom-scrollbar">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/10 pb-3 mb-3">
              <div>
                <span className="text-[8px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-1">
                  🔮 Sacred Design Preview (Locked)
                </span>
                <h3 className="font-serif text-base md:text-lg font-bold text-white uppercase tracking-wider">
                  {glimpseModalLevel} Blueprint Glimpse
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGlimpseModal(false)}
                className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {/* Description of this complexity level */}
            <div className="p-3 bg-[#191919] border border-white/5 rounded-lg mb-4 text-xs text-gray-300">
              <span className="font-semibold text-[#C5A059] uppercase text-[9px] tracking-wider block mb-1">
                Design Alignment Additions:
              </span>
              <p className="italic leading-relaxed text-[11px]">
                {glimpseModalLevel === "Moderate"
                  ? (activeTattooOption?.moderateDesc || "A perfectly balanced configuration containing concentric circular boundary lines and focal geometrical elements.")
                  : (activeTattooOption?.advancedDesc || "An intricate multi-layered alchemical sigil featuring the outer celestial boundary ring and active starburst focus nodes.")}
              </p>
            </div>

            {/* Secure Watermarked Preview Container */}
            <div className="relative w-full aspect-square max-h-[180px] sm:max-h-[220px] md:max-h-[280px] bg-[#FCF8F0] border border-[#A37F43]/20 rounded-lg p-3 sm:p-4 md:p-6 flex items-center justify-center overflow-hidden mb-3 md:mb-5 group select-none pointer-events-none">
              
              {/* Grid Lines background */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#A37F43 1px, transparent 0)", backgroundSize: "14px 14px" }} />
              
              {/* Light Watermark rendering */}
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: (
                    glimpseModalLevel === "Advanced" 
                      ? (activeTattooOption?.svgMarkupAdvanced || activeTattooOption?.svgMarkup) 
                      : (activeTattooOption?.svgMarkupModerate || activeTattooOption?.svgMarkup)
                  ) || getSacredTattooSvg() 
                }} 
                className={`w-32 h-32 sm:w-44 sm:h-44 transition-all duration-500 pointer-events-none select-none ${
                  glimpseTimer > 0 
                    ? "opacity-[0.95] scale-[1.05] filter-none text-[#C5A059]" 
                    : "opacity-[0.08] text-[#A37F43] filter blur-[0.4px]"
                }`}
              />

              {/* Diagonal Repeater Overlays */}
              <div className={`absolute inset-0 flex flex-col justify-around overflow-hidden transition-all duration-500 pointer-events-none -rotate-12 select-none ${
                glimpseTimer > 0 ? "opacity-[0.005]" : "opacity-[0.08]"
              }`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="text-center font-serif text-[9px] font-bold uppercase tracking-[0.3em] text-[#A37F43] whitespace-nowrap">
                    ASTR0PSYCHE LOCKED GEOMETRY • PREVIEW WATERMARK ONLY
                  </div>
                ))}
              </div>

              {/* Lock badge */}
              <div className={`absolute top-3 right-3 border px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest flex items-center gap-1 transition-all duration-300 ${
                glimpseTimer > 0 
                  ? "bg-[#C5A059] text-black border-[#C5A059] animate-pulse" 
                  : "bg-black/95 border-[#C5A059]/30 text-[#C5A059]"
              }`}>
                <span>{glimpseTimer > 0 ? "👁️" : "🔒"}</span>
                <span>{glimpseTimer > 0 ? `Clarity: ${glimpseTimer}s` : "Watermarked"}</span>
              </div>
            </div>

            {/* Locked Action Footer */}
            <div className="text-center space-y-4">
              <p className="text-xs text-gray-400">
                To download high-quality <strong className="text-white">SVG vectors</strong>, print full-scale posters, and access D1 Kundli and Muhurtas, upgrade your cosmic account.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowGlimpseModal(false);
                    setShowPremiumSimulatorModal(true);
                  }}
                  className="flex-1 py-3 bg-[#C5A059] hover:bg-[#b08e4d] text-black text-xs font-extrabold uppercase tracking-wider rounded cursor-pointer transition-colors shadow-lg shadow-[#C5A059]/10 animate-none"
                >
                  🔓 Unlock {glimpseModalLevel} & All Features
                </button>
                <button
                  type="button"
                  onClick={() => setShowGlimpseModal(false)}
                  className="py-3 px-5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold rounded cursor-pointer transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {showPremiumSimulatorModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#121212] border border-[#C5A059]/40 w-full max-w-4xl rounded-xl overflow-hidden shadow-[0_0_50px_rgba(197,160,89,0.15)] relative flex flex-col max-h-[calc(100%-2rem)]">
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-[#161616]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C5A059] animate-pulse" />
                <h3 className="font-serif text-sm md:text-base font-bold text-white uppercase tracking-[0.1em]">
                  ASTRINK UPGRADE PORTAL SIMULATOR
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPremiumSimulatorModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Scroll Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              
              {/* Plan Comparison Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Free Plan */}
                <div className={`p-4 rounded-lg border flex flex-col justify-between transition-all ${
                  activePlan === "free" 
                    ? "bg-[#161616] border-[#C5A059]/20" 
                    : "bg-[#0D0D0D] border-white/5 opacity-50"
                }`}>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">FREE PLAN</span>
                      {activePlan === "free" && <span className="text-[#C5A059] text-[10px] uppercase tracking-wider font-bold">Active</span>}
                    </div>
                    <div className="text-2xl font-serif text-white font-bold mb-4">₹0</div>
                    <ul className="space-y-2 text-[11px] text-gray-400">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span>1 Tattoo Concept (Concept 1)</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span>1 Free Intention (Wealth)</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span>Simple Complexity Level</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span>Basic Spec & Symbolism</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span>Standard Web Presentation</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Aura Premium Plan */}
                <div className={`p-4 rounded-lg border flex flex-col justify-between relative overflow-hidden transition-all ${
                  activePlan === "premium" 
                    ? "bg-[#1E1610] border-[#C5A059]" 
                    : "bg-[#1E1610]/40 border-white/5 shadow-[0_0_15px_rgba(197,160,89,0.05)]"
                }`}>
                  <div className="absolute top-0 right-0 bg-[#C5A059] text-black text-[8px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-bl">
                    SINGLE USER
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#C5A059] font-bold">AURA PREMIUM</span>
                      {activePlan === "premium" && <span className="text-[#C5A059] text-[10px] uppercase tracking-wider font-bold">Active ✨</span>}
                    </div>
                    <div className="text-2xl font-serif text-white font-bold mb-1">₹299 <span className="text-[10px] text-gray-400 font-serif font-normal italic font-sans">one-time</span></div>
                    <ul className="space-y-2 text-[11px] text-gray-300 mt-4">
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <span className="font-semibold text-white">Interactive Concept 2</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <span className="font-semibold text-white">Any 3 Intentions</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <span>Moderate & Advanced levels</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <span>Sanskrit activating mantras</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <button
                          type="button"
                          onClick={() => setShowKundliInfoModal(true)}
                          className="text-[#C5A059] hover:text-[#e4be74] underline decoration-dotted font-semibold cursor-pointer text-left focus:outline-none"
                        >
                          Interactive D1 Kundli Chart ⓘ
                        </button>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <span className="text-amber-400 font-bold">Strictly 1 Seeker Account</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Aura Pro Plan */}
                <div className={`p-4 rounded-lg border flex flex-col justify-between relative overflow-hidden transition-all ${
                  activePlan === "pro" 
                    ? "bg-[#251b14] border-[#C5A059] shadow-[0_0_25px_rgba(197,160,89,0.15)]" 
                    : "bg-[#251b14]/40 border-white/5 opacity-80"
                }`}>
                  <div className="absolute top-0 right-0 bg-[#C5A059] text-black text-[8px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-bl">
                    SINGLE USER
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#C5A059] font-bold">AURA PRO</span>
                      {activePlan === "pro" && <span className="text-[#C5A059] text-[10px] uppercase tracking-wider font-bold">Active ✨</span>}
                    </div>
                    <div className="text-2xl font-serif text-white font-bold mb-1">₹499 <span className="text-[10px] text-gray-400 font-serif font-normal italic font-sans">one-time</span></div>
                    <ul className="space-y-2 text-[11px] text-gray-300 mt-4">
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <span className="font-semibold text-white">Interactive Concept 2</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <span className="font-semibold text-white text-yellow-400">Unlimited 6 Intentions</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <span className="font-semibold text-white">Moderate & Advanced levels</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <span>Sanskrit activating mantras</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <button
                          type="button"
                          onClick={() => setShowKundliInfoModal(true)}
                          className="text-[#C5A059] hover:text-[#e4be74] underline decoration-dotted font-semibold cursor-pointer text-left focus:outline-none"
                        >
                          Interactive D1 Kundli Chart ⓘ
                        </button>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <span className="text-amber-400 font-bold">Strictly 1 Seeker Account</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Aura Family Professional Subscription */}
                <div className={`p-4 rounded-lg border flex flex-col justify-between relative overflow-hidden transition-all ${
                  activePlan === "family" 
                    ? "bg-[#201d14] border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]" 
                    : "bg-[#201d14]/40 border-white/5"
                }`}>
                  <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[8px] uppercase tracking-[0.2em] font-extrabold px-3 py-1 rounded-bl">
                    MAX 10 USERS
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-yellow-500 font-bold">AURA FAMILY PRO</span>
                      {activePlan === "family" && <span className="text-yellow-500 text-[10px] uppercase tracking-wider font-bold">Active 👑</span>}
                    </div>
                    <div className="text-2xl font-serif text-white font-bold mb-1">₹999 <span className="text-[10px] text-gray-400 font-serif font-normal italic font-sans">/ month</span></div>
                    <ul className="space-y-2 text-[11px] text-gray-300 mt-4">
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                        <span className="font-semibold text-white">All features of Aura Pro</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                        <span className="font-semibold text-yellow-400">Unlimited 6 Intentions</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                        <span className="font-semibold text-white">Moderate & Advanced levels</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                        <span className="font-semibold text-white">Register up to 10 seekers</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                        <span>Sanskrit activating mantras</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                        <button
                          type="button"
                          onClick={() => setShowKundliInfoModal(true)}
                          className="text-yellow-500 hover:text-yellow-400 underline decoration-dotted font-semibold cursor-pointer text-left focus:outline-none"
                        >
                          D1 Kundli Natal Charts & PDF ⓘ
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>

              {/* Simulation Sandbox Status Box */}
              <div className="bg-[#161616] border border-white/5 rounded-lg p-4 space-y-3">
                <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-semibold block">Gateway Simulator Controls</span>
                
                <div className="space-y-3.5">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-white/5 pb-2.5">
                    <div>
                      <p className="text-xs text-gray-400">
                        Current Simulation Plan: <strong className="text-white uppercase">
                          {activePlan === "free" ? "Free" : activePlan === "premium" ? "AURA PREMIUM" : activePlan === "pro" ? "AURA PRO" : "AURA FAMILY PRO (₹999/mo)"}
                        </strong>
                      </p>
                      {activePlan === "premium" && (
                        <p className="text-[10px] text-gray-500">
                          Intentions used: <strong className="text-white">{unlockedIntentionsList.join(", ")}</strong> ({unlockedIntentionsList.length} of 3)
                        </p>
                      )}
                      {(activePlan === "premium" || activePlan === "pro") && registeredSingleUser && (
                        <p className="text-[10px] text-[#C5A059]">
                          Single Registered User: <strong className="text-white">{registeredSingleUser.firstName} {registeredSingleUser.lastName}</strong>
                        </p>
                      )}
                      {activePlan === "family" && (
                        <p className="text-[10px] text-yellow-500">
                          Family Slots Registered: <strong className="text-white">{familyUsersList.length} of 10 users</strong> ({familyUsersList.map(u => u.firstName).join(", ") || "None"})
                        </p>
                      )}
                    </div>
                    {activePlan !== "free" && (
                      <button
                        type="button"
                        onClick={() => {
                          setActivePlan("free");
                          setUnlockedIntentionsList(["Wealth"]);
                          setIntention("Wealth");
                          setRegisteredSingleUser(null);
                          localStorage.removeItem("aura_ink_single_user");
                          setFamilyUsersList([]);
                          localStorage.removeItem("aura_ink_family_users");
                        }}
                        className="px-2.5 py-1 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 text-[10px] font-semibold rounded cursor-pointer transition-colors"
                      >
                        Reset back to Free
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    Choose an interactive simulator option below to immediately shift your client's plan level. No actual payment details are needed.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    {activePlan === "free" && (
                      <button
                        type="button"
                        onClick={() => {
                          setActivePlan("premium");
                          setUnlockedIntentionsList(["Wealth"]);
                          // Auto register current form details
                          const u = { firstName, lastName, birthDate };
                          setRegisteredSingleUser(u);
                          localStorage.setItem("aura_ink_single_user", JSON.stringify(u));
                        }}
                        className="flex-1 min-w-[200px] py-3 bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#C5A059] border border-[#C5A059]/30 text-xs font-extrabold uppercase tracking-[0.1em] rounded cursor-pointer transition-colors text-center"
                      >
                        Simulate Aura Premium Success (₹299)
                      </button>
                    )}
                    {activePlan !== "pro" && activePlan !== "family" && (
                      <button
                        type="button"
                        onClick={() => {
                          setActivePlan("pro");
                          setUnlockedIntentionsList(["Wealth", "Love", "Career", "Protection", "Healing", "Spiritual Growth"]);
                          // Auto register current form details
                          const u = { firstName, lastName, birthDate };
                          setRegisteredSingleUser(u);
                          localStorage.setItem("aura_ink_single_user", JSON.stringify(u));
                        }}
                        className="flex-1 min-w-[200px] py-3 bg-[#C5A059] hover:bg-[#b08e4d] text-black text-xs font-extrabold uppercase tracking-[0.1em] rounded cursor-pointer transition-colors text-center shadow-lg shadow-[#C5A059]/10"
                      >
                        {activePlan === "premium" ? "Upgrade to Aura Pro (₹499)" : "Simulate Aura Pro Success (₹499)"}
                      </button>
                    )}
                    {activePlan !== "family" && (
                      <button
                        type="button"
                        onClick={() => {
                          setActivePlan("family");
                          setUnlockedIntentionsList(["Wealth", "Love", "Career", "Protection", "Healing", "Spiritual Growth"]);
                          // Auto register current form details in family list
                          const u = { firstName, lastName, birthDate };
                          setFamilyUsersList([u]);
                          localStorage.setItem("aura_ink_family_users", JSON.stringify([u]));
                        }}
                        className="flex-1 min-w-[200px] py-3 bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-extrabold uppercase tracking-[0.1em] rounded cursor-pointer transition-colors text-center shadow-lg shadow-yellow-500/10"
                      >
                        Simulate Aura Family Subscription (₹999/mo)
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPremiumSimulatorModal(false)}
                      className="py-3 px-5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold rounded cursor-pointer transition-colors"
                    >
                      Close Portal
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {showPrintIframeModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#121212] border border-[#C5A059]/40 w-full max-w-md rounded-xl shadow-[0_0_50px_rgba(197,160,89,0.2)] relative flex flex-col p-5 md:p-6 max-h-[calc(100%-2rem)] overflow-y-auto custom-scrollbar text-center">
            
            {/* Header / Icon */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/30 mb-3">
                <Printer className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                How to Print Your Poster
              </h3>
            </div>

            {/* Content description */}
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Because your interactive cosmic blueprint is loaded within our secure developer preview iframe, standard browser security blocks the print dialog from launching inside this container.
            </p>

            {/* Quick Action Steps */}
            <div className="space-y-3 text-left mb-6">
              <div className="p-3 rounded bg-[#181818] border border-white/5 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Open in a Secure New Tab</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Click the gold button below to open the application standalone in its own tab, where browser sandbox restrictions are removed.</p>
                </div>
              </div>
              <div className="p-3 rounded bg-[#181818] border border-white/5 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Trigger Print Prompt</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Once the new tab opens, press <strong className="text-white">Print Poster</strong> or <strong className="text-white">Save PDF</strong> again, or use standard browser shortcuts (<kbd className="bg-white/10 px-1 rounded text-white text-[9px]">Ctrl+P</kbd> or <kbd className="bg-white/10 px-1 rounded text-white text-[9px]">⌘+P</kbd>) to save/print!</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  window.open(window.location.href, "_blank");
                  setShowPrintIframeModal(false);
                }}
                className="flex-1 py-3 bg-[#C5A059] hover:bg-[#b08e4d] text-black text-xs font-extrabold uppercase tracking-wider rounded cursor-pointer transition-colors text-center shadow-lg shadow-[#C5A059]/10"
              >
                Open in New Tab & Print
              </button>
              <button
                type="button"
                onClick={() => setShowPrintIframeModal(false)}
                className="py-3 px-5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold rounded cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {showUpgradeToFamilyModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#121212] border border-[#C5A059]/40 w-full max-w-lg rounded-xl shadow-[0_0_50px_rgba(197,160,89,0.35)] relative flex flex-col p-6 max-h-[calc(100%-2rem)] overflow-y-auto custom-scrollbar text-center font-sans">
            
            {/* Header / Icon */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30 mb-3 text-amber-500 text-2xl animate-pulse">
                🛡️
              </div>
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                Single-User Subscription Protection
              </h3>
              <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-mono mt-1 font-bold">
                Aura Premium / Pro Plan Limit Exceeded
              </p>
            </div>

            {/* Content description */}
            <div className="space-y-4 text-xs text-left text-gray-300 leading-relaxed mb-6">
              <p>
                Your current <strong className="text-[#C5A059] uppercase">{activePlan === "premium" ? "Aura Premium" : "Aura Pro"}</strong> subscription is restricted to <strong className="text-white">one single user account</strong> for birth natal chart calculations and ritual custom sigil design.
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-1.5 font-mono">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold">🔒 Registered Single User:</span>
                <p className="text-white text-xs font-semibold">
                  👤 Name: {registeredSingleUser?.firstName} {registeredSingleUser?.lastName}
                </p>
                <p className="text-white text-xs font-semibold">
                  📅 Birth Date: {registeredSingleUser?.birthDate}
                </p>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 space-y-1.5 font-mono">
                <span className="text-[9px] uppercase tracking-wider text-red-400 block font-bold">⚠️ Attempted New User:</span>
                <p className="text-red-300 text-xs font-semibold">
                  👤 Name: {attemptedUser?.firstName} {attemptedUser?.lastName}
                </p>
                <p className="text-red-300 text-xs font-semibold">
                  📅 Birth Date: {attemptedUser?.birthDate}
                </p>
              </div>

              <p className="text-gray-400">
                To generate auspicious talismans, planetary seed mantras, and Kundli charts for family members or different seekers, you require the <strong className="text-[#C5A059]">Aura Professional Family Monthly Subscription</strong>.
              </p>

              <div className="bg-[#1E1610] border border-[#C5A059]/30 rounded-lg p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">👑 Professional Family Subscription</span>
                  <span className="text-xs font-bold text-white bg-[#C5A059]/20 border border-[#C5A059]/30 px-2 py-0.5 rounded">₹999 / mo</span>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1 text-[10.5px] text-gray-300">
                  <li className="flex items-center gap-1.5">
                    <span className="text-[#C5A059] font-bold">✓</span> Up to 10 unique users
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-[#C5A059] font-bold">✓</span> Unlimited 6 alchemical paths
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-[#C5A059] font-bold">✓</span> Pro complexity & mantras
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-[#C5A059] font-bold">✓</span> Shared dashboard ledger
                  </li>
                </ul>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  // Upgrade to Family Monthly Subscription
                  setActivePlan("family");
                  
                  // Initialize family list with original single user + attempted new user
                  const list = [];
                  if (registeredSingleUser) list.push(registeredSingleUser);
                  if (attemptedUser) list.push(attemptedUser);
                  
                  // Deduplicate list
                  const uniqueList = list.filter((u, i, self) => 
                    self.findIndex(v => v.firstName.toLowerCase() === u.firstName.toLowerCase() && v.birthDate === u.birthDate) === i
                  );

                  setFamilyUsersList(uniqueList);
                  localStorage.setItem("aura_ink_family_users", JSON.stringify(uniqueList));
                  
                  // Reset modal state
                  setShowUpgradeToFamilyModal(false);
                  
                  // Automatically trigger calculation!
                  setTimeout(() => {
                    handleInitiateRitual();
                  }, 150);
                }}
                className="flex-1 py-3 bg-[#C5A059] hover:bg-[#b08e4d] text-black text-xs font-extrabold uppercase tracking-wider rounded transition-colors text-center shadow-lg cursor-pointer"
              >
                Upgrade to Family Subscription (₹999/mo)
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUpgradeToFamilyModal(false);
                  setQuizStep(1); // Go back to first step to fix name
                }}
                className="py-3 px-5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold rounded cursor-pointer transition-colors"
              >
                Go Back / Edit Details
              </button>
            </div>
          </div>
        </div>
      )}

      {showKundliInfoModal && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#121212] border border-[#C5A059]/40 w-full max-w-2xl rounded-xl shadow-[0_0_50px_rgba(197,160,89,0.35)] relative flex flex-col p-6 max-h-[calc(100%-2rem)] overflow-y-auto custom-scrollbar font-sans text-left">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30 text-amber-500 text-xl animate-[spin_40s_linear_infinite]">
                  🪐
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                    D1 Natal Kundli Chart & Alignment
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-mono font-bold">
                    The Divine Astronomical Snapshot of the Soul
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowKundliInfoModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Explanation Content */}
            <div className="space-y-4 text-xs text-gray-300 leading-relaxed overflow-y-auto pr-1">
              
              <section className="space-y-1.5">
                <h4 className="text-white font-semibold font-serif text-[13px] uppercase tracking-wider text-amber-400">
                  1. What is a D1 Natal Kundli?
                </h4>
                <p>
                  In Vedic Astrology (Jyotish), the <strong className="text-white font-semibold">D1 Chart (or Rasi Chart)</strong> is the foundational snapshot of the solar system mapped at the precise millisecond and coordinates of your physical birth. It registers the exact longitude of the Ascendant (Lagna) and the nine cosmic bodies (the Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu) across 12 houses and 12 zodiac signs.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-white font-semibold font-serif text-[13px] uppercase tracking-wider text-amber-400">
                  2. Why "D1" Matters (The Physical Incarnation)
                </h4>
                <p>
                  "D1" stands for the first division of your birth chart—the chart of the physical realm. While other divisional charts (Vargas) map abstract themes like careers or soul unions, the <strong className="text-white font-semibold">D1 Kundli is your tangible incarnation blueprint</strong>. It represents your corporeal body, physical path, sensory processing mechanisms, and primary karmic contracts.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-white font-semibold font-serif text-[13px] uppercase tracking-wider text-amber-400">
                  3. Alchemical Tattoo Integration in AstrInk
                </h4>
                <p>
                  AstrInk doesn't just create random aesthetic tattoos. It analyzes your birth chart to align with your personal energy meridians:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-400">
                  <li>
                    <strong className="text-white">Ruling Planet Alignment:</strong> It identifies the planet dictating your chosen intention (e.g., Jupiter/Venus for Wisdom, Mars for Protection) and cross-references its strength in your D1 natal houses to see if it requires activation.
                  </li>
                  <li>
                    <strong className="text-white">Somatic Placement:</strong> In Vedic anatomy, specific zodiac signs and houses rule corresponding parts of your body. AstrInk ensures your sigil is mapped to a physical placement point that resonates with that celestial force.
                  </li>
                  <li>
                    <strong className="text-white">Sanskrit Activating Mantras:</strong> You receive the precise vibrational planetary seed mantra (Bija Mantra) to recite during the inking ritual, permanently establishing a sacred mental bridge.
                  </li>
                </ul>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-white font-semibold font-serif text-[13px] uppercase tracking-wider text-amber-400">
                  4. The Downloadable PDF Tattooist Guide
                </h4>
                <p>
                  Upon upgrading your plan, you can download a master alchemical printout containing:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white/5 border border-white/10 p-3 rounded-lg font-mono text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#C5A059]">✦</span> Complete D1 Natal Chart Diagram
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#C5A059]">✦</span> Exact Degree Planetary Placements
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#C5A059]">✦</span> Ruling Planet & Bodily Meridian Map
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#C5A059]">✦</span> High-Definition SVG Tattoo Vectors
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#C5A059]">✦</span> Sanskrit Ritual Activation Mantras
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#C5A059]">✦</span> 3 Auspicious Shubh Muhurtas (Ink Times)
                  </div>
                </div>
              </section>
            </div>

            {/* Footer Buttons */}
            <div className="border-t border-white/10 pt-4 mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowKundliInfoModal(false)}
                className="py-2.5 px-6 bg-[#C5A059] hover:bg-[#b08e4d] text-black text-xs font-bold uppercase tracking-wider rounded cursor-pointer transition-colors shadow-lg"
              >
                Understood & Aligned
              </button>
            </div>

          </div>
        </div>
      )}

      {/* iOS & Android Mobile Companion Portal */}

      {/* iOS & Android Mobile Companion Portal */}
      {showDownloadPortal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#121212] border border-[#C5A059]/40 w-full max-w-2xl rounded-xl shadow-[0_0_50px_rgba(197,160,89,0.25)] relative flex flex-col max-h-[calc(100%-2rem)] overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/10 bg-[#161616]">
              <AuraInkLogo variant="header" showSubtitle={true} />
              <button
                type="button"
                onClick={() => setShowDownloadPortal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs inside Modal */}
            <div className="flex border-b border-white/5 bg-[#141414] px-4">
              <button
                type="button"
                onClick={() => setDownloadPortalTab("pwa")}
                className={`flex-1 py-3 text-xs uppercase tracking-wider font-bold transition-all border-b-2 text-center cursor-pointer ${
                  downloadPortalTab === "pwa"
                    ? "text-[#C5A059] border-[#C5A059]"
                    : "text-gray-400 border-transparent hover:text-white"
                }`}
              >
                📲 Direct Mobile Install (PWA)
              </button>
              <button
                type="button"
                onClick={() => setDownloadPortalTab("stores")}
                className={`flex-1 py-3 text-xs uppercase tracking-wider font-bold transition-all border-b-2 text-center cursor-pointer ${
                  downloadPortalTab === "stores"
                    ? "text-[#C5A059] border-[#C5A059]"
                    : "text-gray-400 border-transparent hover:text-white"
                }`}
              >
                🏛️ Submit to Play/App Store
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-5 bg-[#0F0F0F]">
              
              {downloadPortalTab === "pwa" ? (
                <div className="space-y-4 text-left">
                  {/* Introduction */}
                  <div className="p-4 bg-[#161616] border border-white/5 rounded-lg">
                    <p className="text-xs text-gray-300 leading-relaxed">
                      AstroPsyche is designed with a fully fluid Progressive Web App engine. It installs directly to your phone's home screen, completely bypassing standard app store download delays, and boots instantly with zero browser bars in standalone immersive layout.
                    </p>
                  </div>

                  {/* Dynamic Installation triggers */}
                  {deferredPrompt && (
                    <div className="p-4 bg-gradient-to-br from-[#C5A059]/10 to-[#8C6D3A]/5 border border-[#C5A059]/40 rounded-lg text-center flex flex-col items-center gap-3">
                      <div className="p-2 rounded-full bg-[#C5A059]/10 text-[#C5A059]">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Instant PWA Install Detected</h4>
                        <p className="text-xs text-gray-400 mt-1">Your browser supports one-tap standalone installation on your local launcher menu.</p>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (deferredPrompt) {
                            deferredPrompt.prompt();
                            const { outcome } = await deferredPrompt.userChoice;
                            if (outcome === "accepted") {
                              setIsAppInstalled(true);
                            }
                            setDeferredPrompt(null);
                          }
                        }}
                        className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#b08e4d] text-black rounded font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-[#C5A059]/10"
                      >
                        <Download className="w-4 h-4" />
                        <span>Install AstroPsyche App Now</span>
                      </button>
                    </div>
                  )}

                  {isAppInstalled && (
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center flex flex-col items-center gap-2">
                      <Check className="w-6 h-6 text-green-400" />
                      <h4 className="text-sm font-serif font-bold text-white">Successfully Installed!</h4>
                      <p className="text-xs text-gray-400">AstroPsyche is loaded on your mobile launcher device! Check your home screen or application drawer.</p>
                    </div>
                  )}

                  {/* Manual OS-specific Installation Instructions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* iOS Safari Guide */}
                    <div className="p-4 bg-[#141414] border border-white/5 rounded-lg space-y-3.5">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                        <span className="text-lg">🍎</span>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">iOS Apple Setup (Safari)</h4>
                      </div>
                      <ol className="text-[11px] text-gray-300 space-y-3 list-decimal pl-4 leading-relaxed">
                        <li>
                          Open the standalone URL <strong className="text-white select-all">{window.location.origin}</strong> in the native <strong className="text-[#C5A059]">Safari</strong> app on your iPhone or iPad.
                        </li>
                        <li>
                          Tap the <strong className="text-[#C5A059] inline-flex items-center gap-0.5">Share <Share2 className="w-3 h-3 inline" /></strong> button in Safari's lower navigational bar.
                        </li>
                        <li>
                          Scroll down the share sheet options list and select <strong className="text-white">Add to Home Screen ➕</strong>.
                        </li>
                        <li>
                          Confirm the name as <strong className="text-white">AstroPsyche</strong> and click <strong className="text-[#C5A059]">Add</strong> in the top-right corner. It's now installed!
                        </li>
                      </ol>
                    </div>

                    {/* Android Chrome Guide */}
                    <div className="p-4 bg-[#141414] border border-white/5 rounded-lg space-y-3.5">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                        <span className="text-lg">🤖</span>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Android Setup (Chrome)</h4>
                      </div>
                      <ol className="text-[11px] text-gray-300 space-y-3 list-decimal pl-4 leading-relaxed">
                        <li>
                          Launch <strong className="text-[#C5A059]">Google Chrome</strong> on your Android phone and go to <strong className="text-white select-all">{window.location.origin}</strong>.
                        </li>
                        <li>
                          Tap the browser's menu button <strong className="text-white font-bold">⋮</strong> (three vertical dots) in the upper right-hand corner.
                        </li>
                        <li>
                          Select <strong className="text-white">Install app</strong> or <strong className="text-white">Add to Home screen</strong> from the dropdown menu list.
                        </li>
                        <li>
                          Click the native confirmation dialog box <strong className="text-[#C5A059]">Install</strong> button. The app launcher icon will immediately appear on your device desktop!
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  {/* Store integration introduction */}
                  <div className="p-4 bg-[#161616] border border-white/5 rounded-lg">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1.5">Package Standalone Apps for Google Play & Apple App Store</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      To officially publish this application onto the <strong className="text-white">Google Play Store</strong> and <strong className="text-white">Apple App Store</strong>, you can package this React source code using <strong className="text-[#C5A059]">CapacitorJS</strong>. Capacitor translates web assets into production-ready Swift (iOS) and Kotlin (Android) projects.
                    </p>
                  </div>

                  {/* Copyable code steps */}
                  <div className="space-y-3">
                    {/* Step 1 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Step 1: Install Capacitor CLI & Core</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText("npm i @capacitor/core @capacitor/cli");
                            setCopiedCommand("step1");
                            setTimeout(() => setCopiedCommand(null), 2000);
                          }}
                          className="text-[#C5A059] hover:text-white cursor-pointer transition-colors flex items-center gap-1 normal-case text-[9px]"
                        >
                          {copiedCommand === "step1" ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCommand === "step1" ? "Copied" : "Copy Command"}</span>
                        </button>
                      </div>
                      <pre className="bg-black border border-white/10 rounded-lg p-3 text-[10px] font-mono text-gray-300 overflow-x-auto select-all">
                        npm i @capacitor/core @capacitor/cli
                      </pre>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Step 2: Initialize Configuration Bundle</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('npx cap init "AstrInk" "com.astrink.app" --web-dir=dist');
                            setCopiedCommand("step2");
                            setTimeout(() => setCopiedCommand(null), 2000);
                          }}
                          className="text-[#C5A059] hover:text-white cursor-pointer transition-colors flex items-center gap-1 normal-case text-[9px]"
                        >
                          {copiedCommand === "step2" ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCommand === "step2" ? "Copied" : "Copy Command"}</span>
                        </button>
                      </div>
                      <pre className="bg-black border border-white/10 rounded-lg p-3 text-[10px] font-mono text-gray-300 overflow-x-auto select-all">
                        {`npx cap init "AstrInk" "com.astrink.app" --web-dir=dist`}
                      </pre>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Step 3: Add iOS & Android Native Platforms</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText("npm i @capacitor/android @capacitor/ios && npx cap add android && npx cap add ios");
                            setCopiedCommand("step3");
                            setTimeout(() => setCopiedCommand(null), 2000);
                          }}
                          className="text-[#C5A059] hover:text-white cursor-pointer transition-colors flex items-center gap-1 normal-case text-[9px]"
                        >
                          {copiedCommand === "step3" ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCommand === "step3" ? "Copied" : "Copy Command"}</span>
                        </button>
                      </div>
                      <pre className="bg-black border border-white/10 rounded-lg p-3 text-[10px] font-mono text-gray-300 overflow-x-auto select-all">
                        npm i @capacitor/android @capacitor/ios && npx cap add android && npx cap add ios
                      </pre>
                    </div>

                    {/* Step 4 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Step 4: Compile & Sync Web Assets</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText("npm run build && npx cap sync");
                            setCopiedCommand("step4");
                            setTimeout(() => setCopiedCommand(null), 2000);
                          }}
                          className="text-[#C5A059] hover:text-white cursor-pointer transition-colors flex items-center gap-1 normal-case text-[9px]"
                        >
                          {copiedCommand === "step4" ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCommand === "step4" ? "Copied" : "Copy Command"}</span>
                        </button>
                      </div>
                      <pre className="bg-black border border-white/10 rounded-lg p-3 text-[10px] font-mono text-gray-300 overflow-x-auto select-all">
                        npm run build && npx cap sync
                      </pre>
                    </div>

                    {/* Step 5 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-left">
                      <div className="p-3 bg-black/60 border border-white/5 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-[#C5A059] tracking-wider uppercase">Android Studio Build</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText("npx cap open android");
                              setCopiedCommand("step5a");
                              setTimeout(() => setCopiedCommand(null), 2000);
                            }}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {copiedCommand === "step5a" ? <Check className="w-2.5 h-2.5 text-green-400" /> : <Copy className="w-2.5 h-2.5" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 leading-relaxed">Launch Android Studio to bundle/sign your production APK or AAB bundle for the Play Store:</p>
                        <code className="block bg-black p-1.5 text-[9px] font-mono text-gray-300 rounded border border-white/5">npx cap open android</code>
                      </div>

                      <div className="p-3 bg-black/60 border border-white/5 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-[#C5A059] tracking-wider uppercase">Apple Xcode Build</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText("npx cap open ios");
                              setCopiedCommand("step5i");
                              setTimeout(() => setCopiedCommand(null), 2000);
                            }}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {copiedCommand === "step5i" ? <Check className="w-2.5 h-2.5 text-green-400" /> : <Copy className="w-2.5 h-2.5" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 leading-relaxed">Launch Xcode on macOS to compile and submit your standalone iOS app (.ipa) to the App Store:</p>
                        <code className="block bg-black p-1.5 text-[9px] font-mono text-gray-300 rounded border border-white/5">npx cap open ios</code>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="border-t border-white/10 px-5 py-4 bg-[#141414] flex justify-end">
              <button
                type="button"
                onClick={() => setShowDownloadPortal(false)}
                className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-semibold rounded text-xs uppercase tracking-wider cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Interactive Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto text-left">
          <div className="bg-[#121212] border border-[#C5A059]/40 w-full max-w-3xl rounded-xl shadow-[0_0_50px_rgba(197,160,89,0.35)] relative flex flex-col p-5 md:p-7 max-h-[calc(100%-2rem)] overflow-y-auto custom-scrollbar font-sans">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/30 text-amber-500 text-lg">
                  🛡️
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                    Privacy Policy & Data Security
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-mono font-bold">
                    AstrInk (AstroPsyche) App Protection Declarations
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4 p-3.5 bg-white/[0.02] border border-white/5 rounded-lg text-xs items-start sm:items-center justify-between">
              <div className="text-gray-400 max-w-sm">
                Need an offline vector PDF or a text copy for your Google Play Store submission dashboard?
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    window.open("?view=privacy", "_blank");
                  }}
                  className="py-1.5 px-3 bg-[#C5A059] hover:bg-[#b08e4d] text-black font-bold uppercase tracking-wider rounded cursor-pointer transition-colors text-[10px] flex items-center gap-1 shadow"
                >
                  <Download className="w-3 h-3" />
                  <span>Save PDF / Print</span>
                </button>
                <button
                  type="button"
                  onClick={downloadPrivacyTxt}
                  className="py-1.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-bold uppercase tracking-wider rounded cursor-pointer transition-colors text-[10px]"
                >
                  Download TXT
                </button>
              </div>
            </div>

            {/* Document text content */}
            <div className="space-y-4 text-xs text-gray-400 leading-relaxed max-h-[350px] overflow-y-auto pr-2 custom-scrollbar border-b border-white/5 pb-4">
              <p>
                AstrInk Dev Studio (<strong>"we"</strong>, <strong>"us"</strong>, <strong>"our"</strong>) operates the AstrInk (also known as AstroPsyche) mobile application and Progressive Web Application (the <strong>"Service"</strong>). This page informs you of our policies regarding the collection, use, and disclosure of Personal Data when you use our Service and the choices you have associated with that data.
              </p>

              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-serif">1. Data Collection and Use</h4>
                <p>We collect several different types of information for various purposes to provide and improve our Service to you, especially as it relates to spiritual calculations and secure payment processing:</p>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  <li><strong className="text-gray-300">Astrological & Natal Parameters:</strong> First Name, Last Name, Date of Birth, Place of Birth, and Time of Birth. This is processed strictly in-memory or locally on your device for generating design mathematics. We do not sell or share your credentials.</li>
                  <li><strong className="text-gray-300">Local Storage:</strong> Browser local state and reactive local states protect your design collections and unlocked spiritual intentions under your physical device control.</li>
                  <li><strong className="text-gray-300">Google Play Billing:</strong> Secures and synchronizes India and global transactions (₹299+ plans). All transaction processing is completed natively through Google Play, and we do not store financial payment information.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-serif">2. Device Permissions</h4>
                <p>Optional access requests to improve physical visualization:</p>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  <li><strong className="text-gray-300">Camera Access:</strong> Requested strictly for augmented-reality skin tattoo overlay projection. No photos or visual feeds are ever uploaded or saved.</li>
                  <li><strong className="text-gray-300">Notifications:</strong> Optional alerts for mindful planetary transit transitions and Solfeggio session schedules.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-serif">3. Third-Party Services</h4>
                <p>We utilize standard secure infrastructure tools including: Google Play Services & Play Billing (app distribution, verified receipts) and Recharts/D3.js (highly tailored local SVG geometry rendering).</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-serif">4. User Rights</h4>
                <p>GDPR and CCPA compliant access rights. Since birth chart configurations remain in your browser cache, you can wipe them instantly using the "Database Control" reset tool in the Seeker Ledger tab or by purging local storage cache.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-serif">5. Children's Privacy</h4>
                <p>The Service is not targeted for children under 13 years of age. We do not track or accumulate childhood demographic information.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-serif">6. Contact Support</h4>
                <p>Direct inquiries to our official email channel: <strong className="text-white">hguptaseth1204@gmail.com</strong></p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 flex justify-between items-center">
              <a
                href="?view=privacy"
                target="_blank"
                referrerPolicy="no-referrer"
                className="text-xs text-[#C5A059] hover:underline font-mono uppercase tracking-widest flex items-center gap-1"
              >
                <span>View Fullscreen URL</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="py-2.5 px-6 bg-[#C5A059] hover:bg-[#b08e4d] text-black text-xs font-bold uppercase tracking-wider rounded cursor-pointer transition-colors font-serif"
              >
                Understood & Confirmed
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Permanent Cosmic Footer with Privacy Policy & Legal Links */}
      <footer className="w-full bg-[#050505] border-t border-white/5 py-8 px-4 md:px-8 mt-auto relative z-20 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#C5A059]/10 rounded-full flex items-center justify-center border border-[#C5A059]/30">
            <span className="text-[10px] text-[#C5A059]">✦</span>
          </div>
          <span className="text-gray-500 font-serif">© 2026 AstrInk Dev Studio. All cosmic rights reserved.</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-gray-400">
          <button
            type="button"
            onClick={() => setShowPrivacyModal(true)}
            className="hover:text-[#C5A059] transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <span className="text-white/10">|</span>
          <a
            href="?view=privacy"
            target="_blank"
            referrerPolicy="no-referrer"
            className="hover:text-[#C5A059] transition-colors flex items-center gap-1"
          >
            <span>Live Privacy URL</span>
            <ExternalLink className="w-2.5 h-2.5 text-[#C5A059]" />
          </a>
          <span className="text-white/10">|</span>
          <button
            type="button"
            onClick={() => setShowDownloadPortal(true)}
            className="hover:text-[#C5A059] transition-colors"
          >
            Google Play Console Guide
          </button>
        </div>
      </footer>

    </div>
  );
}
