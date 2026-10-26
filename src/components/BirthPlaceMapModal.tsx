import React, { useState, useMemo, useRef } from "react";
import { Search, MapPin, X, Compass, Check, Sparkles } from "lucide-react";
import { INDIA_CITIES } from "../indiaLocations";

export interface WorldCity {
  id: string;
  name: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
}

// Major Global Cities representing diverse regions with precise Latitude and Longitude
export const GLOBAL_PRESET_CITIES: WorldCity[] = [
  // NORTH AMERICA
  { id: "nyc", name: "New York City", state: "New York", country: "United States", lat: 40.7128, lng: -74.0060 },
  { id: "lax", name: "Los Angeles", state: "California", country: "United States", lat: 34.0522, lng: -118.2437 },
  { id: "sfo", name: "San Francisco", state: "California", country: "United States", lat: 37.7749, lng: -122.4194 },
  { id: "ord", name: "Chicago", state: "Illinois", country: "United States", lat: 41.8781, lng: -87.6298 },
  { id: "mia", name: "Miami", state: "Florida", country: "United States", lat: 25.7617, lng: -80.1918 },
  { id: "den", name: "Denver", state: "Colorado", country: "United States", lat: 39.7392, lng: -104.9903 },
  { id: "sea", name: "Seattle", state: "Washington", country: "United States", lat: 47.6062, lng: -122.3321 },
  { id: "dfw", name: "Dallas", state: "Texas", country: "United States", lat: 32.7767, lng: -96.7970 },
  { id: "yvr", name: "Vancouver", state: "British Columbia", country: "Canada", lat: 49.2827, lng: -123.1207 },
  { id: "yyz", name: "Toronto", state: "Ontario", country: "Canada", lat: 43.6532, lng: -79.3832 },
  { id: "mex", name: "Mexico City", state: "Ciudad de México", country: "Mexico", lat: 19.4326, lng: -99.1332 },
  { id: "hnl", name: "Honolulu", state: "Hawaii", country: "United States", lat: 21.3069, lng: -157.8583 },
  { id: "anc", name: "Anchorage", state: "Alaska", country: "United States", lat: 61.2181, lng: -149.9003 },

  // SOUTH AMERICA
  { id: "sao", name: "São Paulo", state: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333 },
  { id: "rio", name: "Rio de Janeiro", state: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729 },
  { id: "bue", name: "Buenos Aires", state: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816 },
  { id: "bog", name: "Bogotá", state: "Bogotá D.C.", country: "Colombia", lat: 4.7110, lng: -74.0721 },
  { id: "lim", name: "Lima", state: "Lima Province", country: "Peru", lat: -12.0464, lng: -77.0428 },
  { id: "scl", name: "Santiago", state: "Santiago Metropolitan", country: "Chile", lat: -33.4489, lng: -70.6693 },
  { id: "ccs", name: "Caracas", state: "Capital District", country: "Venezuela", lat: 10.4806, lng: -66.9036 },

  // EUROPE
  { id: "lon", name: "London", state: "England", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  { id: "par", name: "Paris", state: "Île-de-France", country: "France", lat: 48.8566, lng: 2.3522 },
  { id: "ber", name: "Berlin", state: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050 },
  { id: "rom", name: "Rome", state: "Lazio", country: "Italy", lat: 41.9028, lng: 12.4964 },
  { id: "mad", name: "Madrid", state: "Community of Madrid", country: "Spain", lat: 40.4168, lng: -3.7038 },
  { id: "ams", name: "Amsterdam", state: "North Holland", country: "Netherlands", lat: 52.3676, lng: 4.9041 },
  { id: "dub", name: "Dublin", state: "Leinster", country: "Ireland", lat: 53.3498, lng: -6.2603 },
  { id: "lis", name: "Lisbon", state: "Lisbon District", country: "Portugal", lat: 38.7223, lng: -9.1393 },
  { id: "ath", name: "Athens", state: "Attica", country: "Greece", lat: 37.9838, lng: 23.7275 },
  { id: "osl", name: "Oslo", state: "Oslo County", country: "Norway", lat: 59.9139, lng: 10.7522 },
  { id: "arn", name: "Stockholm", state: "Stockholm County", country: "Sweden", lat: 59.3293, lng: 18.0686 },
  { id: "hel", name: "Helsinki", state: "Uusimaa", country: "Finland", lat: 60.1699, lng: 24.9384 },
  { id: "rek", name: "Reykjavík", state: "Capital Region", country: "Iceland", lat: 64.1466, lng: -21.9426 },
  { id: "vce", name: "Venice", state: "Veneto", country: "Italy", lat: 45.4408, lng: 12.3155 },
  { id: "vie", name: "Vienna", state: "Vienna State", country: "Austria", lat: 48.2082, lng: 16.3738 },
  { id: "prg", name: "Prague", state: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378 },

  // AFRICA
  { id: "cai", name: "Cairo", state: "Cairo Governorate", country: "Egypt", lat: 30.0444, lng: 31.2357 },
  { id: "cpt", name: "Cape Town", state: "Western Cape", country: "South Africa", lat: -33.9249, lng: 18.4241 },
  { id: "jnb", name: "Johannesburg", state: "Gauteng", country: "South Africa", lat: -26.2041, lng: 28.0473 },
  { id: "nbo", name: "Nairobi", state: "Nairobi County", country: "Kenya", lat: -1.2921, lng: 36.8219 },
  { id: "los", name: "Lagos", state: "Lagos State", country: "Nigeria", lat: 6.5244, lng: 3.3792 },
  { id: "cmn", name: "Casablanca", state: "Casablanca-Settat", country: "Morocco", lat: 33.5731, lng: -7.5898 },
  { id: "acc", name: "Accra", state: "Greater Accra Region", country: "Ghana", lat: 5.6037, lng: -0.1870 },
  { id: "tnr", name: "Antananarivo", state: "Analamanga", country: "Madagascar", lat: -18.8792, lng: 47.5079 },
  { id: "dkr", name: "Dakar", state: "Dakar Region", country: "Senegal", lat: 14.7167, lng: -17.4677 },

  // ASIA & MIDDLE EAST
  { id: "tok", name: "Tokyo", state: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { id: "pek", name: "Beijing", state: "Beijing Municipality", country: "China", lat: 39.9042, lng: 116.4074 },
  { id: "pvg", name: "Shanghai", state: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737 },
  { id: "icn", name: "Seoul", state: "Seoul Capital Area", country: "South Korea", lat: 37.5665, lng: 126.9780 },
  { id: "bom", name: "Mumbai", state: "Maharashtra", country: "India", lat: 19.0760, lng: 72.8777 },
  { id: "del", name: "Delhi", state: "National Capital Territory", country: "India", lat: 28.6139, lng: 77.2090 },
  { id: "blr", name: "Bengaluru", state: "Karnataka", country: "India", lat: 12.9716, lng: 77.5946 },
  { id: "dxb", name: "Dubai", state: "Dubai", country: "United Arab Emirates", lat: 25.2048, lng: 55.2708 },
  { id: "sin", name: "Singapore", state: "Central Region", country: "Singapore", lat: 1.3521, lng: 103.8198 },
  { id: "bkk", name: "Bangkok", state: "Bangkok Metropolitan", country: "Thailand", lat: 13.7563, lng: 100.5018 },
  { id: "cgk", name: "Jakarta", state: "Jakarta Capital Region", country: "Indonesia", lat: -6.2088, lng: 106.8456 },
  { id: "mnl", name: "Manila", state: "Metro Manila", country: "Philippines", lat: 14.5995, lng: 120.9842 },
  { id: "sgn", name: "Ho Chi Minh City", state: "Southeast Region", country: "Vietnam", lat: 10.8231, lng: 106.6297 },
  { id: "kul", name: "Kuala Lumpur", state: "Federal Territory", country: "Malaysia", lat: 3.1390, lng: 101.6869 },
  { id: "tpe", name: "Taipei", state: "Taipei City", country: "Taiwan", lat: 25.0330, lng: 121.5654 },
  { id: "hkg", name: "Hong Kong", state: "Hong Kong", country: "China", lat: 22.3193, lng: 114.1694 },
  { id: "thr", name: "Tehran", state: "Tehran Province", country: "Iran", lat: 35.6892, lng: 51.3890 },
  { id: "ruh", name: "Riyadh", state: "Riyadh Province", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753 },
  { id: "khi", name: "Karachi", state: "Sindh", country: "Pakistan", lat: 24.8607, lng: 67.0011 },
  { id: "ktm", name: "Kathmandu", state: "Bagmati Province", country: "Nepal", lat: 27.7172, lng: 85.3240 },
  { id: "dac", name: "Dhaka", state: "Dhaka Division", country: "Bangladesh", lat: 23.8103, lng: 90.4125 },
  { id: "mow", name: "Moscow", state: "Moscow Oblast", country: "Russia", lat: 55.7558, lng: 37.6173 },
  { id: "ist", name: "Istanbul", state: "Marmara Region", country: "Turkey", lat: 41.0082, lng: 28.9784 },

  // OCEANIA
  { id: "syd", name: "Sydney", state: "New South Wales", country: "Australia", lat: -33.8688, lng: 151.2093 },
  { id: "mel", name: "Melbourne", state: "Victoria", country: "Australia", lat: -37.8136, lng: 144.9631 },
  { id: "bne", name: "Brisbane", state: "Queensland", country: "Australia", lat: -27.4698, lng: 153.0251 },
  { id: "per", name: "Perth", state: "Western Australia", country: "Australia", lat: -31.9505, lng: 115.8605 },
  { id: "akl", name: "Auckland", state: "Auckland Region", country: "New Zealand", lat: -36.8485, lng: 174.7633 },
  { id: "wlg", name: "Wellington", state: "Wellington Region", country: "New Zealand", lat: -41.2865, lng: 174.7762 },
  { id: "suv", name: "Suva", state: "Rewa", country: "Fiji", lat: -18.1248, lng: 178.4501 },
];

export const WORLD_CITIES: WorldCity[] = [...GLOBAL_PRESET_CITIES, ...INDIA_CITIES];

interface BirthPlaceMapModalProps {
  onClose: () => void;
  onSelect: (city: WorldCity) => void;
  currentValue?: string;
}

export default function BirthPlaceMapModal({ onClose, onSelect, currentValue }: BirthPlaceMapModalProps) {
  const [search, setSearch] = useState("");
  const [hoveredCity, setHoveredCity] = useState<WorldCity | null>(null);
  const [selectedCity, setSelectedCity] = useState<WorldCity | null>(() => {
    if (!currentValue) return null;
    const parts = currentValue.split(",").map(p => p.trim().toLowerCase());
    return WORLD_CITIES.find(c => 
      c.name.toLowerCase() === parts[0] || 
      c.country.toLowerCase() === parts[parts.length - 1]
    ) || null;
  });

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Filter cities by search term
  const filteredCities = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return WORLD_CITIES;
    return WORLD_CITIES.filter(
      c =>
        c.name.toLowerCase().includes(term) ||
        c.state.toLowerCase().includes(term) ||
        c.country.toLowerCase().includes(term)
    );
  }, [search]);

  // Convert geo coordinates (lat, lng) to SVG space (viewBox 360x180)
  const getXY = (lat: number, lng: number) => {
    const x = lng + 180; // maps [-180, 180] to [0, 360]
    const y = 90 - lat;  // maps [90, -90] to [0, 180]
    return { x, y };
  };

  // Handle map click - snaps to closest city in our database!
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert screen coordinates to SVG viewBox (360 x 180)
    const svgX = (clickX / rect.width) * 360;
    const svgY = (clickY / rect.height) * 180;

    // Find the closest city
    let closest: WorldCity | null = null;
    let minDistance = Infinity;

    GLOBAL_PRESET_CITIES.forEach(city => {
      const cityCoords = getXY(city.lat, city.lng);
      const dist = Math.sqrt(
        Math.pow(svgX - cityCoords.x, 2) + Math.pow(svgY - cityCoords.y, 2)
      );
      if (dist < minDistance) {
        minDistance = dist;
        closest = city;
      }
    });

    // If within reasonable proximity, select it!
    if (closest) {
      setSelectedCity(closest);
      setSearch(`${(closest as WorldCity).name}, ${(closest as WorldCity).state}, ${(closest as WorldCity).country}`);
    }
  };

  const handleConfirm = () => {
    if (selectedCity) {
      onSelect(selectedCity);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-5xl bg-[#0d0d0d] border border-white/10 rounded-lg overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[650px] shadow-[0_0_50px_rgba(197,160,89,0.15)]">
        
        {/* Left Side: Map view and visual placement */}
        <div className="flex-1 bg-[#090909] p-4 md:p-6 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-white/5">
          
          <div className="flex justify-between items-center mb-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#C5A059] uppercase tracking-wider font-semibold">
                <Compass className="w-4 h-4 animate-spin-slow" />
                <span>Celestial Somatic Coordinates</span>
              </div>
              <h3 className="font-serif text-xl text-white mt-1">Astral Birth Locator</h3>
            </div>
            
            <button
              onClick={onClose}
              className="md:hidden p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-[11px] text-gray-400 mb-4 max-w-md">
            Click anywhere on the cosmic world map grid to automatically locate and anchor your birth energy focal point, or hover over the glowing coordinate gates.
          </p>

          {/* Interactive Map Canvas Wrapper */}
          <div className="flex-1 relative flex items-center justify-center bg-black/40 border border-white/5 rounded overflow-hidden p-2 min-h-[220px]">
            
            {/* Elegant Background Grid Pattern for Astrological aesthetics */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:15px_15px]"></div>
            
            <svg
              ref={svgRef}
              viewBox="0 0 360 180"
              className="w-full h-auto cursor-crosshair select-none relative z-10"
              onClick={handleMapClick}
            >
              {/* Latitude / Longitude lines (every 30 degrees) */}
              {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(x => (
                <line
                  key={`lon-${x}`}
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={180}
                  stroke="rgba(197, 160, 89, 0.05)"
                  strokeWidth="0.5"
                  strokeDasharray="1 3"
                />
              ))}
              {[30, 60, 90, 120, 150].map(y => (
                <line
                  key={`lat-${y}`}
                  x1={0}
                  y1={y}
                  x2={360}
                  y2={y}
                  stroke="rgba(197, 160, 89, 0.05)"
                  strokeWidth="0.5"
                  strokeDasharray="1 3"
                />
              ))}

              {/* Equator & Prime Meridian highlight */}
              <line x1={180} y1={0} x2={180} y2={180} stroke="rgba(197,160,89,0.12)" strokeWidth="0.8" strokeDasharray="3 3" />
              <line x1={0} y1={90} x2={360} y2={90} stroke="rgba(197,160,89,0.12)" strokeWidth="0.8" strokeDasharray="3 3" />

              {/* Stylized, high-end minimal abstract continent contours */}
              {/* North America */}
              <path
                d="M 20,25 C 25,20 40,15 75,18 C 90,20 100,28 115,35 C 105,45 80,55 70,68 C 65,72 58,74 52,65 C 45,55 35,42 20,40 C 15,39 12,32 20,25 Z"
                fill="rgba(255,255,255,0.015)"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
              />
              {/* South America */}
              <path
                d="M 100,85 C 110,80 125,90 135,100 C 145,110 135,130 125,145 C 120,152 115,155 110,140 C 105,125 95,105 100,85 Z"
                fill="rgba(255,255,255,0.015)"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
              />
              {/* Eurasia */}
              <path
                d="M 160,25 C 190,15 250,12 320,18 C 345,20 350,35 345,50 C 335,65 315,70 290,75 C 260,80 220,70 200,60 C 175,55 160,45 160,25 Z"
                fill="rgba(255,255,255,0.015)"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
              />
              {/* Africa */}
              <path
                d="M 165,65 C 185,55 205,60 215,70 C 225,80 230,95 220,115 C 215,125 200,128 190,118 C 180,105 165,85 165,65 Z"
                fill="rgba(255,255,255,0.015)"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
              />
              {/* Australia */}
              <path
                d="M 305,110 C 320,105 340,110 345,120 C 342,135 325,140 310,135 C 300,130 298,115 305,110 Z"
                fill="rgba(255,255,255,0.015)"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
              />
              {/* Greenland */}
              <path
                d="M 115,12 C 125,8 145,10 150,15 C 145,22 130,25 120,22 C 115,18 112,14 115,12 Z"
                fill="rgba(255,255,255,0.015)"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
              />

              {/* Map Major Cities Dots */}
              {GLOBAL_PRESET_CITIES.map(city => {
                const { x, y } = getXY(city.lat, city.lng);
                const isHovered = hoveredCity?.id === city.id;
                const isSelected = selectedCity?.id === city.id;

                return (
                  <g
                    key={city.id}
                    className="group cursor-pointer"
                    onMouseEnter={() => setHoveredCity(city)}
                    onMouseLeave={() => setHoveredCity(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCity(city);
                      setSearch(`${city.name}, ${city.state}, ${city.country}`);
                    }}
                  >
                    {/* Pulsing selection aura */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill="none"
                        stroke="#C5A059"
                        strokeWidth="0.5"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer glowing interactive bounds */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered || isSelected ? 4.5 : 2}
                      fill={isSelected ? "#C5A059" : isHovered ? "#fff" : "rgba(197, 160, 89, 0.45)"}
                      stroke={isSelected ? "#000" : isHovered ? "#C5A059" : "none"}
                      strokeWidth="0.4"
                      className="transition-all duration-200"
                    />

                    {/* Small inner absolute coordinates core */}
                    <circle
                      cx={x}
                      cy={y}
                      r="0.5"
                      fill="#fff"
                    />
                  </g>
                );
              })}

              {/* Selected City Crosshair lines */}
              {selectedCity && (() => {
                const { x, y } = getXY(selectedCity.lat, selectedCity.lng);
                return (
                  <g className="pointer-events-none">
                    <line x1={x - 10} y1={y} x2={x + 10} y2={y} stroke="#C5A059" strokeWidth="0.4" opacity="0.8" />
                    <line x1={x} y1={y - 10} x2={x} y2={y + 10} stroke="#C5A059" strokeWidth="0.4" opacity="0.8" />
                    <circle cx={x} cy={y} r="8" stroke="#C5A059" strokeWidth="0.2" fill="none" strokeDasharray="1 1" />
                  </g>
                );
              })()}
            </svg>

            {/* On-Map Tooltip Portal */}
            {hoveredCity && (() => {
              const { x, y } = getXY(hoveredCity.lat, hoveredCity.lng);
              return (
                <div
                  className="absolute z-20 bg-black/95 border border-[#C5A059]/40 p-2.5 rounded shadow-xl text-left pointer-events-none flex flex-col gap-0.5"
                  style={{
                    left: `${(x / 360) * 100}%`,
                    top: `${(y / 180) * 100 - 15}%`,
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <p className="font-serif text-xs text-[#C5A059] leading-tight font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {hoveredCity.name}
                  </p>
                  <p className="text-[9px] text-gray-400 whitespace-nowrap">
                    {hoveredCity.state}, {hoveredCity.country}
                  </p>
                  <p className="text-[8px] text-gray-500 font-mono tracking-tighter mt-0.5">
                    Lat: {hoveredCity.lat.toFixed(4)}° / Lng: {hoveredCity.lng.toFixed(4)}°
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Quick Stats of the snaps */}
          <div className="mt-4 p-3 bg-white/5 border border-white/5 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${selectedCity ? "bg-[#C5A059] animate-pulse" : "bg-gray-600"}`}></span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400">Locked Astral Node:</span>
              <span className="text-xs text-white font-medium">
                {selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : "Click map or search below"}
              </span>
            </div>
            {selectedCity && (
              <p className="text-[9px] font-mono text-[#C5A059] opacity-80">
                L: {selectedCity.lat.toFixed(2)}N / Lng: {selectedCity.lng.toFixed(2)}E
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Search and List selection */}
        <div className="w-full md:w-80 bg-[#121212] p-4 md:p-6 flex flex-col justify-between h-[45%] md:h-full">
          
          <div className="flex flex-col gap-3 flex-1 overflow-hidden">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold">City Registry</h4>
              <button
                onClick={onClose}
                className="hidden md:flex p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search world registry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded px-3 py-2 pl-9 text-xs text-white focus:outline-none focus:border-[#C5A059] placeholder-gray-600"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Results list */}
            <div className="flex-1 overflow-y-auto min-h-[120px] pr-1 mt-2 border border-white/5 bg-black/20 rounded divide-y divide-white/5">
              {filteredCities.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-500 italic">
                  No aligned focal gates found.
                </div>
              ) : (
                filteredCities.map((city) => {
                  const isSelected = selectedCity?.id === city.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city);
                        setSearch(`${city.name}, ${city.state}, ${city.country}`);
                      }}
                      className={`w-full text-left p-2.5 transition-colors text-xs flex justify-between items-center ${
                        isSelected
                          ? "bg-[#C5A059]/10 text-white"
                          : "hover:bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-gray-200">{city.name}</span>
                        <span className="text-[10px] text-gray-500 leading-none">
                          {city.state}, {city.country}
                        </span>
                      </div>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-[#C5A059]" />
                      ) : (
                        <span className="text-[9px] font-mono text-gray-600">
                          {city.lat > 0 ? `${Math.round(city.lat)}°N` : `${Math.round(Math.abs(city.lat))}°S`}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2">
            <button
              onClick={handleConfirm}
              disabled={!selectedCity}
              className={`w-full py-2.5 rounded font-semibold text-xs uppercase tracking-widest text-center transition-all ${
                selectedCity
                  ? "bg-[#C5A059] text-black hover:bg-[#B38E46] active:scale-[0.98] cursor-pointer"
                  : "bg-white/5 text-gray-500 cursor-not-allowed"
              }`}
            >
              Confirm Coordinates
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 bg-transparent hover:bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded text-xs uppercase tracking-widest transition-all"
            >
              Cancel
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
