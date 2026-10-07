import React from 'react';

/**
 * Precision 24-spoke Ashoka Chakra (Dharma Chakra) component
 * Renders an authentic geometric wheel of law with 24 equidistant spokes (15° separation).
 */
export default function AshokaChakra({ 
  size = 40, 
  className = '', 
  speed = 'normal', 
  color = '#002875', 
  accentColor = '#e5a93c',
  glow = true 
}) {
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);
  const spinClass = speed === 'fast' ? 'spin-chakra-fast' : 'spin-chakra';

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={spinClass}
        style={{
          filter: glow ? `drop-shadow(0 0 8px ${accentColor}80)` : 'none',
          display: 'block'
        }}
      >
        {/* Outer Concentric Rim */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke={accentColor}
          strokeWidth="2.5"
        />
        <circle
          cx="50"
          cy="50"
          r="43"
          fill="none"
          stroke={color}
          strokeWidth="3.5"
        />

        {/* 24 Spoke Pinheads (Beads between spokes on inner rim) */}
        {spokes.map((angle, idx) => {
          const rad = ((angle + 7.5) * Math.PI) / 180;
          const cx = 50 + 44.5 * Math.sin(rad);
          const cy = 50 - 44.5 * Math.cos(rad);
          return (
            <circle
              key={`pin-${idx}`}
              cx={cx}
              cy={cy}
              r="1.2"
              fill={accentColor}
            />
          );
        })}

        {/* 24 Radial Spokes */}
        {spokes.map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x2 = 50 + 41 * Math.sin(rad);
          const y2 = 50 - 41 * Math.cos(rad);
          return (
            <line
              key={`spoke-${angle}`}
              x1="50"
              y1="50"
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          );
        })}

        {/* Secondary Hub Ring */}
        <circle
          cx="50"
          cy="50"
          r="12"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.8"
        />

        {/* Central Circular Hub */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill={color}
        />

        {/* Inner Golden Bindu (Core) */}
        <circle
          cx="50"
          cy="50"
          r="3.5"
          fill={accentColor}
        />
      </svg>
    </div>
  );
}
