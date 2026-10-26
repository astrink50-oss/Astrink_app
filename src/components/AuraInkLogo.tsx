import React from "react";

interface AuraInkLogoProps {
  variant?: "full" | "emblem" | "header";
  className?: string;
  showSubtitle?: boolean;
}

export const AuraInkLogo: React.FC<AuraInkLogoProps> = ({
  variant = "full",
  className = "",
  showSubtitle = true,
}) => {
  if (variant === "header") {
    return (
      <div className={`flex items-center gap-2 xs:gap-2.5 group cursor-pointer select-none shrink-0 ${className}`}>
        <div className="relative w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
          {/* Subtle Outer Glowing Mandala Ring */}
          <div className="absolute inset-0 rounded-full bg-[#C5A059]/20 blur-sm group-hover:bg-[#C5A059]/40 transition-all duration-300"></div>
          
          <svg viewBox="0 0 100 100" className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 relative z-10 drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]">
            <defs>
              <linearGradient id="headerGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE8A3" />
                <stop offset="50%" stopColor="#C5A059" />
                <stop offset="100%" stopColor="#8A6420" />
              </linearGradient>
              <linearGradient id="headerDrop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
            {/* Outer Mandala Petals */}
            <circle cx="50" cy="50" r="46" fill="none" stroke="url(#headerGold)" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="50" cy="50" r="41" fill="none" stroke="url(#headerGold)" strokeWidth="1" opacity="0.6" />
            
            {/* Ink Drop Base */}
            <path
              d="M50 16 C50 16, 26 48, 26 62 C26 75.2, 36.7 84, 50 84 C63.3 84, 74 75.2, 74 62 C74 48, 50 16, 50 16 Z"
              fill="url(#headerDrop)"
              opacity="0.95"
            />
            {/* Inner Swirl & Crescent */}
            <path
              d="M50 28 C50 28, 34 52, 34 62 C34 71, 41 77, 50 77 C59 77, 66 71, 66 62 C66 52, 50 28, 50 28 Z"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1"
              opacity="0.6"
            />
            <path
              d="M48 54 A 8 8 0 1 0 54 66 A 7 7 0 1 1 48 54 Z"
              fill="#FFFFFF"
              opacity="0.9"
            />
            <polygon
              points="55,57 56.5,60 60,60.5 57.5,62.5 58,66 55,64 52,66 52.5,62.5 50,60.5 53.5,60"
              fill="#FFE8A3"
            />
          </svg>
        </div>

        <div className="flex flex-col text-left leading-none justify-center">
          <span className="font-serif text-sm xs:text-base sm:text-lg tracking-[0.14em] sm:tracking-[0.18em] uppercase font-extrabold bg-gradient-to-r from-[#FFE8A3] via-[#C5A059] to-[#E5C178] bg-clip-text text-transparent drop-shadow-sm whitespace-nowrap">
            ASTRINK
          </span>
          {showSubtitle && (
            <span className="text-[7px] xs:text-[8px] uppercase tracking-[0.18em] sm:tracking-[0.25em] text-[#C5A059]/80 font-mono font-medium mt-0.5 whitespace-nowrap">
              Sacred Astrological Tattoos
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === "emblem") {
    return (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <svg viewBox="0 0 400 400" className="w-full max-w-[320px] sm:max-w-[380px] drop-shadow-[0_0_25px_rgba(197,160,89,0.35)]">
          <defs>
            <linearGradient id="emblemGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2C2" />
              <stop offset="30%" stopColor="#E5C178" />
              <stop offset="70%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#7A5617" />
            </linearGradient>
            <linearGradient id="emblemCyanPurple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="40%" stopColor="#6366F1" />
              <stop offset="80%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <radialGradient id="glowRadial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#A855F7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Ambient Glow */}
          <circle cx="200" cy="200" r="180" fill="url(#glowRadial)" />

          {/* Outer Decorative Mandala Rings */}
          <circle cx="200" cy="200" r="175" fill="none" stroke="url(#emblemGold)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7" />
          <circle cx="200" cy="200" r="162" fill="none" stroke="url(#emblemGold)" strokeWidth="1" opacity="0.5" />
          <circle cx="200" cy="200" r="148" fill="none" stroke="url(#emblemGold)" strokeWidth="2" opacity="0.8" />

          {/* 16-point Mandala Star Burst */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            const rad = (angle * Math.PI) / 180;
            const x1 = 200 + 148 * Math.cos(rad);
            const y1 = 200 + 148 * Math.sin(rad);
            const x2 = 200 + 162 * Math.cos(rad);
            const y2 = 200 + 162 * Math.sin(rad);
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#emblemGold)" strokeWidth="1.5" />
                <circle cx={x2} cy={y2} r="2.5" fill="url(#emblemGold)" />
              </g>
            );
          })}

          {/* Inscribed Zodiac & Om Ring */}
          <circle cx="200" cy="200" r="128" fill="none" stroke="url(#emblemGold)" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
          
          {/* Sacred Yantra Square overlay */}
          <rect x="110" y="110" width="180" height="180" fill="none" stroke="url(#emblemGold)" strokeWidth="1" opacity="0.4" transform="rotate(0 200 200)" />
          <rect x="110" y="110" width="180" height="180" fill="none" stroke="url(#emblemGold)" strokeWidth="1" opacity="0.4" transform="rotate(45 200 200)" />

          {/* Om Symbols & Astrological Glyphs around ring */}
          <text x="200" y="82" fill="url(#emblemGold)" fontSize="15" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">🕉️</text>
          <text x="200" y="325" fill="url(#emblemGold)" fontSize="15" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">🕉️</text>
          <text x="78" y="205" fill="url(#emblemGold)" fontSize="15" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">🕉️</text>
          <text x="322" y="205" fill="url(#emblemGold)" fontSize="15" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">🕉️</text>

          <text x="258" y="96" fill="url(#emblemGold)" fontSize="11" textAnchor="middle" opacity="0.9">♈</text>
          <text x="304" y="142" fill="url(#emblemGold)" fontSize="11" textAnchor="middle" opacity="0.9">♉</text>
          <text x="304" y="262" fill="url(#emblemGold)" fontSize="11" textAnchor="middle" opacity="0.9">♌</text>
          <text x="258" y="308" fill="url(#emblemGold)" fontSize="11" textAnchor="middle" opacity="0.9">♎</text>
          <text x="142" y="308" fill="url(#emblemGold)" fontSize="11" textAnchor="middle" opacity="0.9">♐</text>
          <text x="96" y="262" fill="url(#emblemGold)" fontSize="11" textAnchor="middle" opacity="0.9">♒</text>
          <text x="96" y="142" fill="url(#emblemGold)" fontSize="11" textAnchor="middle" opacity="0.9">♓</text>
          <text x="142" y="96" fill="url(#emblemGold)" fontSize="11" textAnchor="middle" opacity="0.9">♋</text>

          {/* Inner Petal Ring */}
          <circle cx="200" cy="200" r="92" fill="none" stroke="url(#emblemGold)" strokeWidth="1.5" opacity="0.8" />

          {/* Central Iridescent Ink Teardrop */}
          <g transform="translate(0, -5)">
            {/* Outer Drop Glow shadow */}
            <path
              d="M200 110 C200 110, 130 200, 130 238 C130 276.6, 161.3 308, 200 308 C238.7 308, 270 276.6, 270 238 C270 200, 200 110, 200 110 Z"
              fill="url(#emblemCyanPurple)"
              className="animate-pulse"
              style={{ animationDuration: '4s' }}
            />
            {/* Inner Highlight Layer */}
            <path
              d="M200 130 C200 130, 145 208, 145 240 C145 270, 169.6 294, 200 294 C230.4 294, 255 270, 255 240 C255 208, 200 130, 200 130 Z"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              opacity="0.5"
            />
            {/* Internal Sacred Mandala Lotus in Drop */}
            <circle cx="200" cy="240" r="32" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
            <circle cx="200" cy="240" r="22" fill="none" stroke="#FFE8A3" strokeWidth="1" opacity="0.8" />
            
            {/* Crescent Moon inside Drop */}
            <path
              d="M192 226 A 14 14 0 1 0 206 250 A 12 12 0 1 1 192 226 Z"
              fill="#FFFFFF"
              opacity="0.95"
            />
            {/* 8-pointed star inside moon */}
            <g transform="translate(210, 230) scale(0.6)">
              <polygon
                points="12,0 15,8 24,12 15,16 12,24 9,16 0,12 9,8"
                fill="#FFE8A3"
              />
            </g>
          </g>
        </svg>
      </div>
    );
  }

  // DEFAULT: Full Logo Lockup with Ornate Scroll Banner
  return (
    <div className={`relative flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
      
      {/* Background Subtle Cosmic Shimmer */}
      <div className="absolute inset-0 bg-radial from-[#C5A059]/10 via-transparent to-transparent blur-2xl pointer-events-none"></div>

      {/* Main Sacred Emblem Mandala */}
      <div className="relative w-full max-w-[280px] xs:max-w-[340px] sm:max-w-[420px] aspect-square flex items-center justify-center">
        <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-[0_0_35px_rgba(197,160,89,0.45)]">
          <defs>
            <linearGradient id="fullGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF4D0" />
              <stop offset="25%" stopColor="#E5C178" />
              <stop offset="60%" stopColor="#C5A059" />
              <stop offset="85%" stopColor="#9C772C" />
              <stop offset="100%" stopColor="#5E4311" />
            </linearGradient>

            <linearGradient id="fullTeardropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="35%" stopColor="#6366F1" />
              <stop offset="70%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>

            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Filigree Rays & Star Burst */}
          <circle cx="250" cy="220" r="210" fill="none" stroke="url(#fullGoldGrad)" strokeWidth="1" strokeDasharray="3 4" opacity="0.4" />
          <circle cx="250" cy="220" r="198" fill="none" stroke="url(#fullGoldGrad)" strokeWidth="1.5" opacity="0.7" />
          <circle cx="250" cy="220" r="185" fill="none" stroke="url(#fullGoldGrad)" strokeWidth="2" opacity="0.8" />

          {/* 24-petaled outer mandala frame */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const x = 250 + 198 * Math.cos(rad);
            const y = 220 + 198 * Math.sin(rad);
            return (
              <circle key={i} cx={x} cy={y} r="2.5" fill="url(#fullGoldGrad)" />
            );
          })}

          {/* Intersecting Yantra Triangles / Geometry */}
          <polygon points="250,50 397,305 103,305" fill="none" stroke="url(#fullGoldGrad)" strokeWidth="1" opacity="0.3" />
          <polygon points="250,390 397,135 103,135" fill="none" stroke="url(#fullGoldGrad)" strokeWidth="1" opacity="0.3" />

          {/* Ring of Sanskrit OM & Zodiac Symbols */}
          <circle cx="250" cy="220" r="158" fill="none" stroke="url(#fullGoldGrad)" strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />
          
          <text x="250" y="78" fill="url(#fullGoldGrad)" fontSize="18" textAnchor="middle" fontWeight="bold">🕉️</text>
          <text x="250" y="375" fill="url(#fullGoldGrad)" fontSize="18" textAnchor="middle" fontWeight="bold">🕉️</text>
          <text x="100" y="226" fill="url(#fullGoldGrad)" fontSize="18" textAnchor="middle" fontWeight="bold">🕉️</text>
          <text x="400" y="226" fill="url(#fullGoldGrad)" fontSize="18" textAnchor="middle" fontWeight="bold">🕉️</text>

          <text x="320" y="95" fill="url(#fullGoldGrad)" fontSize="13" textAnchor="middle" opacity="0.85">♈</text>
          <text x="375" y="150" fill="url(#fullGoldGrad)" fontSize="13" textAnchor="middle" opacity="0.85">♊</text>
          <text x="375" y="298" fill="url(#fullGoldGrad)" fontSize="13" textAnchor="middle" opacity="0.85">♌</text>
          <text x="320" y="352" fill="url(#fullGoldGrad)" fontSize="13" textAnchor="middle" opacity="0.85">♎</text>
          <text x="180" y="352" fill="url(#fullGoldGrad)" fontSize="13" textAnchor="middle" opacity="0.85">♐</text>
          <text x="125" y="298" fill="url(#fullGoldGrad)" fontSize="13" textAnchor="middle" opacity="0.85">♒</text>
          <text x="125" y="150" fill="url(#fullGoldGrad)" fontSize="13" textAnchor="middle" opacity="0.85">♓</text>
          <text x="180" y="95" fill="url(#fullGoldGrad)" fontSize="13" textAnchor="middle" opacity="0.85">♉</text>

          {/* Central Water Drop / Teardrop Emblem */}
          <g transform="translate(0, -5)">
            {/* Outer Drop Body */}
            <path
              d="M250 100 C250 100, 160 215, 160 262 C160 311.7, 200.3 352, 250 352 C299.7 352, 340 311.7, 340 262 C340 215, 250 100, 250 100 Z"
              fill="url(#fullTeardropGrad)"
              filter="url(#goldGlow)"
            />
            {/* Swirling Waves Line Art inside teardrop */}
            <path
              d="M250 130 C250 130, 180 225, 180 265 C180 303, 211 334, 250 334 C289 334, 320 303, 320 265 C320 225, 250 130, 250 130 Z"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              opacity="0.45"
            />

            {/* Inner Sacred Rosette / Crescent Moon & Star */}
            <circle cx="250" cy="265" r="42" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
            <circle cx="250" cy="265" r="30" fill="none" stroke="#FFF4D0" strokeWidth="1" opacity="0.8" />

            {/* Crescent Moon */}
            <path
              d="M240 248 A 18 18 0 1 0 258 280 A 15 15 0 1 1 240 248 Z"
              fill="#FFFFFF"
              opacity="0.95"
            />
            
            {/* 8-Pointed Star */}
            <g transform="translate(262, 252) scale(0.75)">
              <polygon
                points="12,0 15,8 24,12 15,16 12,24 9,16 0,12 9,8"
                fill="#FFF4D0"
              />
            </g>
          </g>

          {/* Ornate Gold Bottom Scroll Banner Box */}
          <g transform="translate(0, 370)">
            {/* Filigree Flourishes on Left and Right */}
            <path
              d="M70 30 Q110 5, 160 25 T220 20"
              fill="none"
              stroke="url(#fullGoldGrad)"
              strokeWidth="2.5"
            />
            <path
              d="M430 30 Q390 5, 340 25 T280 20"
              fill="none"
              stroke="url(#fullGoldGrad)"
              strokeWidth="2.5"
            />

            {/* Main Gold Border Frame */}
            <rect
              x="110"
              y="10"
              width="280"
              height="68"
              rx="12"
              fill="#080808"
              stroke="url(#fullGoldGrad)"
              strokeWidth="2.5"
            />
            <rect
              x="114"
              y="14"
              width="272"
              height="60"
              rx="9"
              fill="none"
              stroke="url(#fullGoldGrad)"
              strokeWidth="1"
              opacity="0.6"
            />

            {/* Corner Accent Knots */}
            <circle cx="110" cy="10" r="4" fill="url(#fullGoldGrad)" />
            <circle cx="390" cy="10" r="4" fill="url(#fullGoldGrad)" />
            <circle cx="110" cy="78" r="4" fill="url(#fullGoldGrad)" />
            <circle cx="390" cy="78" r="4" fill="url(#fullGoldGrad)" />
          </g>
        </svg>

        {/* Text Overlay for ASTRINK typography (crisp vector rendering) */}
        <div className="absolute bottom-[3px] sm:bottom-[8px] inset-x-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none">
          <h1 className="font-serif text-2xl sm:text-3xl tracking-[0.22em] uppercase font-black bg-gradient-to-r from-[#FFF4D0] via-[#E5C178] to-[#C5A059] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            ASTRINK
          </h1>
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.32em] text-[#E5C178] font-mono font-bold mt-0.5 opacity-90 drop-shadow">
            SACRED • ASTROLOGICAL • TATTOOS
          </p>
        </div>
      </div>
    </div>
  );
};
export default AuraInkLogo;
