import React, { useState, useRef, useEffect } from "react";
import { Move, Maximize2, RotateCw, Sparkles, Shield, Compass } from "lucide-react";
import { PLACEMENT_PRESETS } from "../data";

interface TattooMockupCanvasProps {
  svgMarkup: string;
  targetPlacement: string; // recommended placement
  chakraColor: string;
  chakraName: string;
  placementExplanation: string;
}

export default function TattooMockupCanvas({
  svgMarkup,
  targetPlacement,
  chakraColor,
  chakraName,
  placementExplanation
}: TattooMockupCanvasProps) {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>(() => {
    // default to target placement or forearms
    const key = targetPlacement.toLowerCase();
    if (key.includes("arm")) return "forearms";
    if (key.includes("throat") || key.includes("collar")) return "throat";
    if (key.includes("chest") || key.includes("heart")) return "chest";
    if (key.includes("wrist")) return "wrists";
    if (key.includes("spine") || key.includes("neck") || key.includes("back")) return "spine";
    if (key.includes("ankle") || key.includes("leg")) return "ankle";
    if (key.includes("ear")) return "behind_ear";
    return "forearms";
  });

  const [scale, setScale] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // When targetPlacement changes, update the body part selection automatically
  useEffect(() => {
    const key = targetPlacement.toLowerCase();
    let detectedPart = "forearms";
    if (key.includes("arm")) detectedPart = "forearms";
    else if (key.includes("throat") || key.includes("collar")) detectedPart = "throat";
    else if (key.includes("chest") || key.includes("heart")) detectedPart = "chest";
    else if (key.includes("wrist")) detectedPart = "wrists";
    else if (key.includes("spine") || key.includes("neck") || key.includes("back")) detectedPart = "spine";
    else if (key.includes("ankle") || key.includes("leg")) detectedPart = "ankle";
    else if (key.includes("ear")) detectedPart = "behind_ear";

    setSelectedBodyPart(detectedPart);
    
    // Reset positions to make sure it is centered in the recommended area
    setPosition({ x: 50, y: 45 });
  }, [targetPlacement]);

  // Handle Dragging inside relative container
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let newX = e.clientX - dragStart.current.x;
    let newY = e.clientY - dragStart.current.y;

    // Convert to percentage
    const xPct = Math.max(10, Math.min(90, (newX / rect.width) * 100));
    const yPct = Math.max(10, Math.min(90, (newY / rect.height) * 100));

    setPosition({ x: xPct, y: yPct });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let newX = e.touches[0].clientX - dragStart.current.x;
    let newY = e.touches[0].clientY - dragStart.current.y;

    const xPct = Math.max(10, Math.min(90, (newX / rect.width) * 100));
    const yPct = Math.max(10, Math.min(90, (newY / rect.height) * 100));

    setPosition({ x: xPct, y: yPct });
  };

  // Preset location triggers
  const activePreset = PLACEMENT_PRESETS[selectedBodyPart] || PLACEMENT_PRESETS.forearms;

  // Render correct body template graphic based on selected preset
  const renderBodyTemplate = () => {
    switch (selectedBodyPart) {
      case "forearms":
        return (
          <svg className="w-full h-full text-slate-700/60" viewBox="0 0 200 300" fill="none">
            {/* Outline of forearm */}
            <path d="M70,30 C90,30 110,30 130,30 L140,240 C130,260 110,270 100,270 C90,270 70,260 60,240 Z" fill="rgba(30, 41, 59, 0.4)" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            {/* Subtle wrist bones and muscle lines */}
            <path d="M 60 210 Q 100 215, 140 210" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <path d="M 90 40 L 90 180" stroke="currentColor" strokeWidth="1" opacity="0.15" />
            <path d="M 110 40 L 110 180" stroke="currentColor" strokeWidth="1" opacity="0.15" />
          </svg>
        );
      case "throat":
        return (
          <svg className="w-full h-full text-slate-700/60" viewBox="0 0 200 300" fill="none">
            {/* Collarbone and neck template */}
            <path d="M40,30 L40,80 Q40,180 100,180 Q160,180 160,80 L160,30" fill="rgba(30, 41, 59, 0.4)" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            {/* Collarbones */}
            <path d="M30,190 Q100,210 200,190" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            <path d="M170,190 Q100,210 0,190" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            {/* Throat lines */}
            <path d="M 90 90 Q 100 105, 110 90" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          </svg>
        );
      case "chest":
        return (
          <svg className="w-full h-full text-slate-700/60" viewBox="0 0 200 300" fill="none">
            {/* Upper Chest / Torso Outline */}
            <path d="M 20,30 C 50,30 70,40 100,40 C 130,40 150,30 180,30 L 190,220 C 140,240 60,240 10,220 Z" fill="rgba(30, 41, 59, 0.4)" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            {/* Sternum / Collarbones lines */}
            <path d="M 100 40 L 100 180" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <path d="M 50 60 Q 100 80, 150 60" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          </svg>
        );
      case "wrists":
        return (
          <svg className="w-full h-full text-slate-700/60" viewBox="0 0 200 300" fill="none">
            {/* Inner Wrist Close Up */}
            <path d="M 50,20 L 150,20 L 160,250 C 160,270 140,280 100,280 C 60,280 40,270 40,250 Z" fill="rgba(30, 41, 59, 0.4)" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            {/* Pulse Line */}
            <path d="M 100 20 L 100 240" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            <path d="M 60 180 Q 100 185, 140 180" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            <path d="M 65 190 Q 100 193, 135 190" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
          </svg>
        );
      case "spine":
        return (
          <svg className="w-full h-full text-slate-700/60" viewBox="0 0 200 300" fill="none">
            {/* Spine / Back of Neck Template */}
            <path d="M 60,10 C 80,10 120,10 140,10 L 150,270 C 130,290 70,290 50,270 Z" fill="rgba(30, 41, 59, 0.4)" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            {/* Spine nodes */}
            <line x1="100" y1="10" x2="100" y2="280" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.4" />
            <circle cx="100" cy="50" r="3" fill="currentColor" opacity="0.5" />
            <circle cx="100" cy="100" r="3" fill="currentColor" opacity="0.5" />
            <circle cx="100" cy="150" r="3" fill="currentColor" opacity="0.5" />
            <circle cx="100" cy="200" r="3" fill="currentColor" opacity="0.5" />
            <circle cx="100" cy="250" r="3" fill="currentColor" opacity="0.5" />
          </svg>
        );
      case "ankle":
        return (
          <svg className="w-full h-full text-slate-700/60" viewBox="0 0 200 300" fill="none">
            {/* Lower Leg / Ankle Template */}
            <path d="M 70,10 L 130,10 L 140,180 L 170,250 C 170,270 120,280 100,280 C 80,280 30,270 30,250 L 60,180 Z" fill="rgba(30, 41, 59, 0.4)" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            {/* Ankle bone indicator */}
            <circle cx="130" cy="190" r="12" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.3" />
            <circle cx="70" cy="190" r="12" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.3" />
          </svg>
        );
      case "behind_ear":
        return (
          <svg className="w-full h-full text-slate-700/60" viewBox="0 0 200 300" fill="none">
            {/* Behind the Ear / Head Silhouette */}
            <path d="M 40,30 Q 140,30 140,110 Q 140,150 110,180 L 110,240 Q 60,250 40,180 Z" fill="rgba(30, 41, 59, 0.4)" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            {/* Ear outline */}
            <path d="M 110,100 C 130,90 145,110 140,130 C 135,145 115,145 110,140" stroke="currentColor" strokeWidth="2" fill="rgba(15, 23, 42, 0.6)" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Convert SVG string to secure data URL or render directly
  // A clean way to render custom inline SVG is to dangerouslySetInnerHTML inside a div
  const renderTattooTalisman = () => {
    if (!svgMarkup) return null;

    // Standardize/Ensure style settings
    let processedSvg = svgMarkup.trim();
    
    // Fallback if the markup doesn't contain <svg
    if (!processedSvg.includes("<svg")) {
      processedSvg = `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5">${processedSvg}</svg>`;
    }

    return (
      <div 
        className="w-24 h-24 text-gold-400 cursor-grab active:cursor-grabbing selection:bg-transparent pointer-events-auto"
        style={{
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          transition: isDragging ? "none" : "transform 0.1s ease-out"
        }}
        dangerouslySetInnerHTML={{ __html: processedSvg }}
      />
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Mockup Canvas Area */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full max-w-sm aspect-[3/4] glass-panel rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-800 shadow-2xl" ref={containerRef}>
          {/* Subtle cosmic background glow */}
          <div className="absolute inset-0 bg-radial from-mystic-900 via-mystic-950 to-transparent opacity-80" />
          
          {/* Active Chakra placement node highlight */}
          <div 
            className="absolute w-12 h-12 rounded-full blur-xl animate-pulse"
            style={{
              backgroundColor: chakraColor || "rgba(212, 175, 55, 0.4)",
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: "translate(-50%, -50%)"
            }}
          />

          {/* Render chosen body part layout */}
          <div className="absolute inset-4 flex items-center justify-center opacity-80 pointer-events-none">
            {renderBodyTemplate()}
          </div>

          {/* Target energy indicator ring */}
          <div className="absolute border border-dashed rounded-full pointer-events-none"
               style={{
                 borderColor: chakraColor || "rgba(212, 175, 55, 0.5)",
                 width: "80px",
                 height: "80px",
                 left: `50%`,
                 top: `45%`,
                 transform: "translate(-50%, -50%)",
                 opacity: 0.35
               }}
          />

          {/* Draggable Tattoo Talisman */}
          <div
            className="absolute z-10 select-none cursor-move"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: "translate(-50%, -50%)",
              touchAction: "none"
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {renderTattooTalisman()}
          </div>

          {/* Drag Overlay Helper Text */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center text-center">
            <span className="text-[10px] font-mono tracking-wider text-slate-400 bg-mystic-950/80 px-2 py-1 rounded-md border border-slate-800 flex items-center gap-1.5 backdrop-blur-sm shadow-sm">
              <Move size={10} className="text-gold-400" />
              DRAG TALISMAN TO ADJUST SOUL PLACEMENT
            </span>
          </div>

          {/* recommended spot label */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-gold-400 bg-mystic-950/90 border border-gold-500/20 px-2 py-1 rounded-md shadow-md backdrop-blur-sm uppercase">
              📍 Suggested Spot: {targetPlacement}
            </span>
          </div>
        </div>

        {/* Adjusting Slider Panel */}
        <div className="w-full max-w-sm mt-4 bg-mystic-900/40 border border-slate-800 rounded-xl p-4 space-y-3 shadow-md">
          {/* Scale slider */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Maximize2 size={12} className="text-gold-400" />
              <span>SCALE ({Math.round(scale * 100)}%)</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="2.5" 
              step="0.1" 
              value={scale} 
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-1/2 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold-400"
            />
          </div>

          {/* Rotation slider */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <RotateCw size={12} className="text-gold-400" />
              <span>ROTATION ({rotation}°)</span>
            </div>
            <input 
              type="range" 
              min="-180" 
              max="180" 
              step="5" 
              value={rotation} 
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="w-1/2 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold-400"
            />
          </div>
        </div>
      </div>

      {/* AR Soul Placement Explanation Details */}
      <div className="lg:col-span-5 space-y-5">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Compass size={120} className="text-gold-400" />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: chakraColor }} />
            <h3 className="text-lg font-serif tracking-wide text-gold-400">
              AR Soul Placement Science
            </h3>
          </div>

          {/* Dropdown to change body parts manual preview */}
          <div className="mb-5">
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5 tracking-wider">PREVIEW ON OTHER MERIDIAN REGIONS</label>
            <select 
              value={selectedBodyPart}
              onChange={(e) => setSelectedBodyPart(e.target.value)}
              className="w-full bg-mystic-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-gold-500 transition font-mono"
            >
              {Object.entries(PLACEMENT_PRESETS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label} {key === selectedBodyPart ? "★" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div className="bg-mystic-950/60 rounded-xl p-4 border border-slate-800/60">
              <span className="text-[10px] font-mono text-gold-500 block mb-1 tracking-widest">MERIDIAN SEED DESCRIPTION</span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activePreset.description}
              </p>
            </div>

            {selectedBodyPart === targetPlacement.toLowerCase() || targetPlacement.toLowerCase().includes(selectedBodyPart.replace("_", "")) ? (
              <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <Shield size={14} />
                  <span>PERFECT MERIDIAN ALIGNMENT (ACTIVE)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {placementExplanation || `This alignment perfectly acts as a spiritual lens, bridging the ${chakraName} energy flow with your subconscious intent.`}
                </p>
              </div>
            ) : (
              <div className="bg-gold-500/5 rounded-xl p-4 border border-gold-500/10 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-gold-400 font-mono">
                  <Sparkles size={14} />
                  <span>SECONDARY MERIDIAN FREQUENCY</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Moving this talisman to the <strong>{activePreset.label}</strong> channels the intention into a different energetic receptor. Try dragging it back to <strong>{targetPlacement}</strong> to restore the primary healing remedy pathway recommended for your specific goal.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Holistic Disclaimer / Compassion Callout */}
        <div className="bg-mystic-900/30 border border-slate-900 rounded-xl p-4 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 block tracking-widest uppercase">Ethical Alignment Warning</span>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            In energy therapy, placing a sacred talisman triggers permanent resonance in the subtle energy body. Ensure your intention is pure, and that you respect the ancient origins of these geometrical remedies.
          </p>
        </div>
      </div>
    </div>
  );
}
