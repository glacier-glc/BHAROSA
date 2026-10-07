import React from 'react';
import AshokaChakra from './AshokaChakra';

/**
 * AshokEmblem Component
 * Renders the State Emblem of India (Lion Capital of Sarnath)
 * with the authentic 24-spoke Ashoka Chakra wheel rotating smoothly at the center of the abacus.
 */
export default function AshokEmblem({
  size = 180,
  wheelSpeed = 'normal',
  color = '#002875',
  accentColor = '#FF671F',
  goldColor = '#C59B27',
  showMotto = false,
  glow = true,
  className = '',
  variant = 'realistic' // 'realistic' | 'vector'
}) {
  // 1. Realistic 3D Sculpted Variant (Default)
  if (variant === 'realistic') {
    return (
      <div 
        className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
        style={{ width: size, minHeight: size * 1.34 }}
      >
        {/* Ambient Radial Aura / Halo */}
        {glow && (
          <div 
            className="absolute inset-0 pointer-events-none rounded-full"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(255, 103, 31, 0.16) 0%, rgba(255, 255, 255, 0.28) 40%, rgba(19, 136, 8, 0.14) 70%, transparent 80%)`,
              filter: 'blur(24px)',
              transform: 'scale(1.2)'
            }}
          />
        )}

        {/* Realistic 3D Sculpted State Emblem of India */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center">
          <div className="relative w-full overflow-hidden flex items-center justify-center">
            <img
              src="/ashok_emblem_realistic.jpg"
              alt="State Emblem of India - Lion Capital of Sarnath"
              className="w-full h-auto object-contain mix-blend-multiply drop-shadow-[0_12px_24px_rgba(104,71,11,0.22)]"
              style={{
                maxHeight: size * 1.34
              }}
            />

            {/* Authentic 24-Spoke Rotating Ashoka Chakra overlaid on the carved abacus wheel */}
            <div 
              className="absolute z-20 flex items-center justify-center pointer-events-none"
              style={{
                top: '63.3%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: size * 0.235,
                height: size * 0.235
              }}
            >
              <div className="relative p-0.5 rounded-full bg-[#E5C37A]/80 shadow-[0_0_12px_rgba(200,155,39,0.5)] border border-[#A67C24]">
                <AshokaChakra 
                  size={Math.max(26, Math.round(size * 0.21))}
                  speed={wheelSpeed}
                  color="#002875"
                  accentColor="#FF671F"
                  glow={true}
                />
              </div>
            </div>
          </div>

          {/* Optional Satyameva Jayate Motto */}
          {showMotto && (
            <div className="mt-2 px-4 py-1 rounded-full bg-white/95 border border-[#002875]/30 shadow-xs">
              <span className="font-extrabold text-[#002875] tracking-widest text-xs font-mono">
                सत्यमेव जयते
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Vector SVG Variant Fallback
  return (
    <div 
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: size, minHeight: size * 1.35 }}
    >
      {/* Ambient Radial Aura / Halo */}
      {glow && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 45%, rgba(255, 103, 31, 0.18) 0%, rgba(255, 255, 255, 0.25) 35%, rgba(19, 136, 8, 0.18) 65%, transparent 75%)`,
            filter: 'blur(20px)',
            transform: 'scale(1.4)'
          }}
        />
      )}

      {/* Main Vector Lion Capital SVG */}
      <svg
        viewBox="0 0 320 400"
        width={size}
        height={size * 1.25}
        className="relative z-10 drop-shadow-xl"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Sovereign Gold Gradient */}
          <linearGradient id="emblemGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFB15B" />
            <stop offset="35%" stopColor="#F5D061" />
            <stop offset="70%" stopColor="#C59B27" />
            <stop offset="100%" stopColor="#8A6417" />
          </linearGradient>

          {/* Deep Ashoka Navy Gradient */}
          <linearGradient id="emblemNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00359E" />
            <stop offset="60%" stopColor="#002875" />
            <stop offset="100%" stopColor="#001B52" />
          </linearGradient>

          {/* Tricolor Sheen for Motto */}
          <linearGradient id="mottoTricolor" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF671F" />
            <stop offset="50%" stopColor="#002875" />
            <stop offset="100%" stopColor="#138808" />
          </linearGradient>

          {/* Pedestal Shading */}
          <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF2D6" />
            <stop offset="50%" stopColor="#E8C374" />
            <stop offset="100%" stopColor="#9C731C" />
          </linearGradient>
        </defs>

        {/* ==================== 1. UPPER SECTION: FOUR LIONS ==================== */}
        
        {/* Crown / Top Apex Crest */}
        <g id="apex-crown">
          <ellipse cx="160" cy="38" rx="14" ry="6" fill="url(#emblemGoldGrad)" stroke="#68470B" strokeWidth="1.5" />
          <path d="M152 38 L160 22 L168 38 Z" fill="url(#emblemGoldGrad)" stroke="#68470B" strokeWidth="1" />
        </g>

        {/* --- LEFT LION (Facing West) --- */}
        <g id="left-lion" transform="translate(68, 55)">
          {/* Head & Mane outline */}
          <path 
            d="M50 25 C40 10, 15 15, 8 35 C0 55, 5 80, 18 100 C30 115, 50 120, 60 122 C55 105, 52 85, 50 65 Z" 
            fill="url(#emblemGoldGrad)" 
            stroke="#68470B" 
            strokeWidth="2"
          />
          {/* Left Lion Mane Waves */}
          <path d="M12 40 C22 45, 35 40, 45 42" stroke="#68470B" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M8 60 C20 65, 34 58, 48 62" stroke="#68470B" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M15 80 C26 84, 38 78, 52 82" stroke="#68470B" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M22 100 C32 104, 44 98, 56 102" stroke="#68470B" strokeWidth="2" fill="none" strokeLinecap="round" />
          
          {/* Left Lion Snout & Muzzle */}
          <path d="M8 35 C4 38, -2 46, 2 52 C6 56, 14 54, 18 50 Z" fill="#FFE8A3" stroke="#68470B" strokeWidth="1.5" />
          {/* Left Lion Open Roaring Jaw & Teeth */}
          <path d="M2 52 C5 60, 12 60, 16 54" fill="#8A2B15" stroke="#68470B" strokeWidth="1.5" />
          <path d="M5 52 L7 55 L9 52" fill="#FFFFFF" />
          {/* Left Lion Ear */}
          <path d="M38 18 C35 10, 45 8, 48 18 Z" fill="url(#emblemGoldGrad)" stroke="#68470B" strokeWidth="1.5" />
          {/* Left Lion Eye */}
          <ellipse cx="20" cy="38" rx="4" ry="2.5" fill="#002875" />
          <circle cx="21" cy="37" r="1" fill="#FFFFFF" />
          {/* Left Shoulder & Paw */}
          <path d="M25 110 C20 135, 25 160, 35 178 L55 178 C48 155, 45 130, 52 110 Z" fill="url(#emblemGoldGrad)" stroke="#68470B" strokeWidth="2" />
          <circle cx="35" cy="178" r="6" fill="#F5D061" stroke="#68470B" strokeWidth="1.5" />
          <circle cx="45" cy="178" r="6" fill="#F5D061" stroke="#68470B" strokeWidth="1.5" />
        </g>

        {/* --- RIGHT LION (Facing East) --- */}
        <g id="right-lion" transform="translate(162, 55)">
          {/* Head & Mane outline */}
          <path 
            d="M40 25 C50 10, 75 15, 82 35 C90 55, 85 80, 72 100 C60 115, 40 120, 30 122 C35 105, 38 85, 40 65 Z" 
            fill="url(#emblemGoldGrad)" 
            stroke="#68470B" 
            strokeWidth="2"
          />
          {/* Right Lion Mane Waves */}
          <path d="M78 40 C68 45, 55 40, 45 42" stroke="#68470B" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M82 60 C70 65, 56 58, 42 62" stroke="#68470B" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M75 80 C64 84, 52 78, 38 82" stroke="#68470B" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M68 100 C58 104, 46 98, 34 102" stroke="#68470B" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Right Lion Snout & Muzzle */}
          <path d="M82 35 C86 38, 92 46, 88 52 C84 56, 76 54, 72 50 Z" fill="#FFE8A3" stroke="#68470B" strokeWidth="1.5" />
          {/* Right Lion Open Roaring Jaw & Teeth */}
          <path d="M88 52 C85 60, 78 60, 74 54" fill="#8A2B15" stroke="#68470B" strokeWidth="1.5" />
          <path d="M85 52 L83 55 L81 52" fill="#FFFFFF" />
          {/* Right Lion Ear */}
          <path d="M52 18 C55 10, 45 8, 42 18 Z" fill="url(#emblemGoldGrad)" stroke="#68470B" strokeWidth="1.5" />
          {/* Right Lion Eye */}
          <ellipse cx="70" cy="38" rx="4" ry="2.5" fill="#002875" />
          <circle cx="69" cy="37" r="1" fill="#FFFFFF" />
          {/* Right Shoulder & Paw */}
          <path d="M65 110 C70 135, 65 160, 55 178 L35 178 C42 155, 45 130, 38 110 Z" fill="url(#emblemGoldGrad)" stroke="#68470B" strokeWidth="2" />
          <circle cx="55" cy="178" r="6" fill="#F5D061" stroke="#68470B" strokeWidth="1.5" />
          <circle cx="45" cy="178" r="6" fill="#F5D061" stroke="#68470B" strokeWidth="1.5" />
        </g>

        {/* --- CENTER LION (Facing Forward / Majestic Front) --- */}
        <g id="center-lion" transform="translate(100, 35)">
          {/* Majestic Mane Outer Crown & Fluff */}
          <path 
            d="M60 10 C35 10, 10 35, 10 70 C10 115, 30 145, 60 155 C90 145, 110 115, 110 70 C110 35, 85 10, 60 10 Z" 
            fill="url(#emblemGoldGrad)" 
            stroke="#68470B" 
            strokeWidth="2.5" 
          />
          {/* Detailed Mane Ring Waves */}
          <path d="M22 55 C35 62, 48 50, 60 52 C72 50, 85 62, 98 55" stroke="#68470B" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M18 78 C32 86, 46 72, 60 76 C74 72, 88 86, 102 78" stroke="#68470B" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M22 102 C36 112, 48 98, 60 102 C72 98, 84 112, 98 102" stroke="#68470B" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M28 126 C40 134, 50 124, 60 126 C70 124, 80 134, 92 126" stroke="#68470B" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Center Lion Forehead & Brow */}
          <path d="M42 38 C50 34, 70 34, 78 38 C82 50, 78 68, 60 72 C42 68, 38 50, 42 38 Z" fill="#FFEAA8" stroke="#68470B" strokeWidth="1.5" />
          {/* Ears */}
          <path d="M30 32 C26 20, 40 18, 42 30 Z" fill="url(#emblemGoldGrad)" stroke="#68470B" strokeWidth="1.5" />
          <path d="M90 32 C94 20, 80 18, 78 30 Z" fill="url(#emblemGoldGrad)" stroke="#68470B" strokeWidth="1.5" />

          {/* Eyes (Fierce & Noble) */}
          <ellipse cx="49" cy="46" rx="5" ry="3" fill="#002875" />
          <circle cx="50" cy="45" r="1.5" fill="#FFFFFF" />
          <ellipse cx="71" cy="46" rx="5" ry="3" fill="#002875" />
          <circle cx="70" cy="45" r="1.5" fill="#FFFFFF" />

          {/* Nose & Whiskers Muzzle */}
          <polygon points="60,54 55,60 65,60" fill="#002875" />
          <path d="M60 60 L60 67 C55 69, 48 68, 46 64 M60 67 C65 69, 72 68, 74 64" stroke="#68470B" strokeWidth="1.5" fill="none" />
          
          {/* Open Roaring Mouth & Sharp Canines */}
          <path d="M50 68 C50 78, 70 78, 70 68 Z" fill="#8A2B15" stroke="#68470B" strokeWidth="1.5" />
          <polygon points="52,68 54,72 56,68" fill="#FFFFFF" />
          <polygon points="64,68 66,72 68,68" fill="#FFFFFF" />
          {/* Tongue & Beard */}
          <path d="M56 73 C58 76, 62 76, 64 73 Z" fill="#E65100" />
          <path d="M50 82 C55 88, 65 88, 70 82" stroke="#68470B" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* Center Chest & Strong Forelegs */}
          <path d="M38 148 L42 198 L56 198 L52 148 Z" fill="url(#emblemGoldGrad)" stroke="#68470B" strokeWidth="2" />
          <path d="M82 148 L78 198 L64 198 L68 148 Z" fill="url(#emblemGoldGrad)" stroke="#68470B" strokeWidth="2" />
          {/* Front Paws Resting on Abacus */}
          <circle cx="48" cy="198" r="8" fill="#FFE8A3" stroke="#68470B" strokeWidth="1.8" />
          <circle cx="72" cy="198" r="8" fill="#FFE8A3" stroke="#68470B" strokeWidth="1.8" />
          {/* Claws */}
          <path d="M44 204 L44 206 M48 205 L48 207 M52 204 L52 206" stroke="#68470B" strokeWidth="1.5" />
          <path d="M68 204 L68 206 M72 205 L72 207 M76 204 L76 206" stroke="#68470B" strokeWidth="1.5" />
        </g>

        {/* ==================== 2. MIDDLE SECTION: CIRCULAR ABACUS (THE FRIEZE) ==================== */}
        
        {/* Abacus Top Molded Rim */}
        <rect x="30" y="235" width="260" height="8" rx="4" fill="url(#emblemGoldGrad)" stroke="#68470B" strokeWidth="2" />
        
        {/* Abacus Main Frieze Band */}
        <rect x="36" y="243" width="248" height="58" rx="6" fill="url(#pedestalGrad)" stroke="#68470B" strokeWidth="2" />

        {/* Left Animal: Galloping Horse (Speed & Energy) */}
        <g id="abacus-horse" transform="translate(56, 252) scale(0.65)">
          <path 
            d="M5 25 C12 10, 25 5, 38 12 C45 16, 52 10, 60 14 C65 18, 62 28, 55 30 C45 32, 40 40, 35 55 L28 58 L25 45 C18 48, 10 45, 5 35 Z" 
            fill="#002875" 
          />
          {/* Horse Galloping Legs */}
          <path d="M12 40 L-2 58 M20 42 L12 62 M35 50 L48 64 M40 48 L56 58" stroke="#002875" strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* Right Animal: Walking Bull (Steadfastness & Hard Work) */}
        <g id="abacus-bull" transform="translate(225, 252) scale(0.65)">
          <path 
            d="M55 25 C48 12, 35 8, 22 15 C15 18, 8 12, 2 18 C-2 22, 2 30, 8 32 C18 34, 24 42, 28 55 L35 58 L38 45 C45 48, 52 45, 55 35 Z" 
            fill="#002875" 
          />
          {/* Bull Horns & Sturdy Legs */}
          <path d="M2 18 C-4 12, -2 6, 4 8" stroke="#002875" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M15 42 L8 60 M22 44 L18 62 M38 48 L42 62 M45 46 L52 60" stroke="#002875" strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* Abacus Bottom Molded Rim */}
        <rect x="30" y="301" width="260" height="10" rx="4" fill="url(#emblemGoldGrad)" stroke="#68470B" strokeWidth="2" />

        {/* ==================== 3. LOWER SECTION: BELL-SHAPED LOTUS BASE ==================== */}
        <g id="lotus-pedestal" transform="translate(50, 311)">
          {/* Central Bell Shape */}
          <path 
            d="M10 0 C30 25, 80 32, 110 32 C140 32, 190 25, 210 0 Z" 
            fill="url(#pedestalGrad)" 
            stroke="#68470B" 
            strokeWidth="2" 
          />
          {/* Inverted Lotus Petals (High relief fluted petals) */}
          <path d="M30 0 C45 22, 60 26, 75 0" stroke="#68470B" strokeWidth="2" fill="none" />
          <path d="M75 0 C90 26, 105 28, 120 0" stroke="#68470B" strokeWidth="2" fill="none" />
          <path d="M120 0 C135 28, 150 26, 165 0" stroke="#68470B" strokeWidth="2" fill="none" />
          <path d="M165 0 C180 22, 195 18, 205 0" stroke="#68470B" strokeWidth="2" fill="none" />
          {/* Base Platform Ring */}
          <rect x="5" y="32" width="210" height="8" rx="4" fill="url(#emblemGoldGrad)" stroke="#68470B" strokeWidth="1.8" />
        </g>

        {/* ==================== 4. SATYAMEVA JAYATE (सत्यमेव जयते) ==================== */}
        {showMotto && (
          <g id="national-motto" transform="translate(160, 375)">
            {/* Background Ribbon Pill */}
            <rect 
              x="-95" 
              y="-18" 
              width="190" 
              height="28" 
              rx="14" 
              fill="#FFFFFF" 
              stroke="#002875" 
              strokeWidth="1.8" 
              className="drop-shadow-sm" 
            />
            {/* Devanagari Inscription */}
            <text
              x="0"
              y="2"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="'Noto Sans Devanagari', 'Yatra One', 'Arial', sans-serif"
              fontSize="16"
              fontWeight="900"
              letterSpacing="2"
              fill="url(#emblemNavyGrad)"
              style={{
                fontVariant: 'all-small-caps',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              सत्यमेव जयते
            </text>
          </g>
        )}
      </svg>

      {/* ==================== 5. ROTATING ASHOKA CHAKRA AT THE CENTER OF ABACUS ==================== */}
      {/* Positioned precisely at the center of the abacus (viewBox cx: 160, cy: 272) */}
      <div 
        className="absolute z-20 flex items-center justify-center pointer-events-none"
        style={{
          top: '64.5%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: size * 0.28,
          height: size * 0.28
        }}
      >
        <div className="relative p-1 rounded-full bg-white/95 shadow-[0_0_15px_rgba(0,40,117,0.35)] border border-[#C59B27]">
          <AshokaChakra 
            size={Math.max(34, Math.round(size * 0.25))}
            speed={wheelSpeed}
            color="#002875"
            accentColor="#FF671F"
            glow={true}
          />
        </div>
      </div>
    </div>
  );
}
