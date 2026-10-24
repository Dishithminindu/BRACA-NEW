import React from 'react';

interface BracaLogoProps {
  className?: string;
  variant?: 'full' | 'emblem' | 'compact';
  theme?: 'dark' | 'light' | 'adaptive';
}

export const BracaEmblem: React.FC<{ className?: string; size?: number; lightBg?: boolean }> = ({
  className = 'w-10 h-10',
  size,
  lightBg = false,
}) => {
  return (
    <svg
      viewBox="0 0 160 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: (size * 220) / 160 } : undefined}
      aria-label="BRACA Owl Emblem"
    >
      <defs>
        {/* Mask for the 7 vertical bars */}
        <clipPath id="braca-bars-clip">
          {/* Bar 1 (leftmost) */}
          <rect x="13" y="55" width="14" height="110" rx="7" />
          {/* Bar 2 */}
          <rect x="33" y="35" width="14" height="150" rx="7" />
          {/* Bar 3 */}
          <rect x="53" y="20" width="14" height="180" rx="7" />
          {/* Bar 4 (center) */}
          <rect x="73" y="10" width="14" height="200" rx="7" />
          {/* Bar 5 */}
          <rect x="93" y="20" width="14" height="180" rx="7" />
          {/* Bar 6 */}
          <rect x="113" y="35" width="14" height="150" rx="7" />
          {/* Bar 7 (rightmost) */}
          <rect x="133" y="55" width="14" height="110" rx="7" />
        </clipPath>
      </defs>

        {/* The 7 vertical green bars */}
      <g clipPath="url(#braca-bars-clip)">
        <rect width="160" height="220" fill="#1a3d1e" />

        {/* White Owl Cutout inside the bars */}
        {/* Forehead and ear tufts sweeping out */}
        <path
          d="M 80 88
             C 73 80, 58 68, 48 54
             C 44 48, 38 38, 34 32
             C 33 30, 31 32, 32 35
             L 34 45
             L 28 42
             L 30 54
             L 24 50
             C 23 58, 24 66, 25 74
             C 26 84, 27 94, 28 104
             C 22 108, 18 116, 22 124
             L 29 122
             L 23 132
             L 31 133
             L 26 144
             C 32 148, 38 152, 45 155
             C 54 158, 66 160, 80 160
             C 94 160, 106 158, 115 155
             C 122 152, 128 148, 134 144
             L 129 133
             L 137 132
             L 131 122
             C 135 116, 131 108, 125 104
             C 126 94, 127 84, 128 74
             C 129 66, 130 58, 129 50
             L 123 54
             L 125 42
             L 119 45
             L 121 35
             C 122 32, 120 30, 119 32
             C 115 38, 109 48, 105 54
             C 95 68, 87 80, 80 88
             Z"
          fill="#ffffff"
        />

        {/* Green Beak in negative space pointing down from center forehead */}
        <path
          d="M 73 85
             L 87 85
             L 82 122
             C 81 125, 79 125, 78 122
             Z"
          fill="#1a3d1e"
        />

        {/* Left Eye */}
        <circle cx="53" cy="103" r="15" fill="#ffffff" />
        <circle cx="53" cy="103" r="10.5" fill="#1a3d1e" />
        <circle cx="51.5" cy="101.5" r="4.5" fill="#e6f0cd" />

        {/* Right Eye */}
        <circle cx="107" cy="103" r="15" fill="#ffffff" />
        <circle cx="107" cy="103" r="10.5" fill="#1a3d1e" />
        <circle cx="105.5" cy="101.5" r="4.5" fill="#e6f0cd" />
      </g>
    </svg>
  );
};

export const BracaLogo: React.FC<BracaLogoProps> = ({
  className = '',
  variant = 'full',
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  if (variant === 'emblem') {
    return <BracaEmblem className="w-10 h-10" />;
  }

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* Owl Emblem with neat contrast container if on dark background */}
      <div className="relative flex-shrink-0 bg-white p-1 rounded-lg shadow-sm border border-stone-700/40 flex items-center justify-center">
        <BracaEmblem className="w-8 h-11 sm:w-9 sm:h-12" />
      </div>

      {/* Typography from the logo: BRACA + Subtitles */}
      <div className="flex flex-col justify-center text-left">
        <div className="flex items-center space-x-2">
          <span
            className={`font-serif text-2xl sm:text-3xl font-normal tracking-wide leading-none ${
              isDark ? 'text-white' : 'text-[#163319]'
            }`}
            style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif", letterSpacing: '0.04em' }}
          >
            BRACA
          </span>
          <span className="text-[9px] uppercase tracking-wider bg-[#163319] text-[#e6f0cd] border border-[#e6f0cd]/40 px-1.5 py-0.5 rounded font-mono hidden sm:inline-block">
            Verified
          </span>
        </div>

        <div className="flex flex-col mt-0.5 leading-tight">
          <span
            className={`text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.14em] font-sans ${
              isDark ? 'text-stone-300' : 'text-stone-800'
            }`}
          >
            Biodiversity Research and
          </span>
          <span
            className={`text-[7.5px] sm:text-[8.5px] font-semibold uppercase tracking-[0.11em] font-sans ${
              isDark ? 'text-[#e6f0cd]' : 'text-[#163319]'
            }`}
          >
            Conservation Alliance (Pvt) Ltd
          </span>
        </div>
      </div>
    </div>
  );
};
