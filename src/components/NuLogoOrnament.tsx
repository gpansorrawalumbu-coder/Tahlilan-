import React from 'react';

interface NuLogoOrnamentProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export const NuLogoOrnament: React.FC<NuLogoOrnamentProps> = ({
  className = '',
  size = 'md',
  showLabel = true,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizeClasses} flex items-center justify-center group`}>
        {/* Glow backdrop */}
        <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md group-hover:bg-amber-400/40 transition-all" />

        {/* SVG NU Emblem Vector: Bintang 9, Tali Jagad & Bumi */}
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-md relative z-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Gold Ring with Tali Jagad weave pattern */}
          <circle cx="60" cy="60" r="56" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6 3" />
          <circle cx="60" cy="60" r="52" stroke="#d97706" strokeWidth="1.5" />
          <circle cx="60" cy="60" r="48" fill="#034e38" stroke="#fef08a" strokeWidth="1" />

          {/* Earth / Globe Grid Lines */}
          <ellipse cx="60" cy="60" rx="36" ry="18" stroke="#10b981" strokeWidth="1" opacity="0.6" />
          <ellipse cx="60" cy="60" rx="18" ry="36" stroke="#10b981" strokeWidth="1" opacity="0.6" />
          <line x1="24" y1="60" x2="96" y2="60" stroke="#10b981" strokeWidth="1" opacity="0.8" />
          <line x1="60" y1="24" x2="60" y2="96" stroke="#10b981" strokeWidth="1" opacity="0.8" />

          {/* Tali Jagad Loop (Knot surrounding the globe) */}
          <path
            d="M 30 60 C 30 40 40 30 60 30 C 80 30 90 40 90 60 C 90 80 80 90 60 90 C 40 90 30 80 30 60 Z"
            stroke="#f59e0b"
            strokeWidth="2"
            fill="none"
          />

          {/* Top Center Star (Rasulullah SAW - Largest) */}
          <polygon
            points="60,14 62.5,21 69.5,21 64,25 66,32 60,28 54,32 56,25 50.5,21 57.5,21"
            fill="#fef08a"
            stroke="#b45309"
            strokeWidth="0.5"
          />

          {/* Top 4 Sahabat Stars (2 Left, 2 Right) */}
          {/* Star 2 Left */}
          <polygon
            points="42,20 44,25 49,25 45,28 46.5,33 42,30 37.5,33 39,28 35,25 40,25"
            fill="#f59e0b"
            transform="scale(0.85) translate(8, 5)"
          />
          {/* Star 3 Left */}
          <polygon
            points="26,30 28,35 33,35 29,38 30.5,43 26,40 21.5,43 23,38 19,35 24,35"
            fill="#f59e0b"
            transform="scale(0.8) translate(14, 10)"
          />
          {/* Star 4 Right */}
          <polygon
            points="78,20 80,25 85,25 81,28 82.5,33 78,30 73.5,33 75,28 71,25 76,25"
            fill="#f59e0b"
            transform="scale(0.85) translate(12, 5)"
          />
          {/* Star 5 Right */}
          <polygon
            points="94,30 96,35 101,35 97,38 98.5,43 94,40 89.5,43 91,38 87,35 92,35"
            fill="#f59e0b"
            transform="scale(0.8) translate(10, 10)"
          />

          {/* Bottom 4 Imam Mazhab Stars (2 Left, 2 Right) */}
          {/* Star 6 Bottom Left */}
          <polygon
            points="30,80 32,85 37,85 33,88 34.5,93 30,90 25.5,93 27,88 23,85 28,85"
            fill="#f59e0b"
            transform="scale(0.8) translate(12, -2)"
          />
          {/* Star 7 Bottom Left */}
          <polygon
            points="44,92 46,97 51,97 47,100 48.5,105 44,102 39.5,105 41,100 37,97 42,97"
            fill="#f59e0b"
            transform="scale(0.8) translate(8, -8)"
          />
          {/* Star 8 Bottom Right */}
          <polygon
            points="90,80 92,85 97,85 93,88 94.5,93 90,90 85.5,93 87,88 83,85 88,85"
            fill="#f59e0b"
            transform="scale(0.8) translate(10, -2)"
          />
          {/* Star 9 Bottom Right */}
          <polygon
            points="76,92 78,97 83,97 79,100 80.5,105 76,102 71.5,105 73,100 69,97 74,97"
            fill="#f59e0b"
            transform="scale(0.8) translate(12, -8)"
          />

          {/* Arabic Calligraphy Style Emblem Text in center */}
          <text
            x="60"
            y="65"
            textAnchor="middle"
            fill="#fef08a"
            fontSize="14"
            fontWeight="bold"
            fontFamily="serif"
          >
            نُ
          </text>
        </svg>
      </div>

      {showLabel && (
        <div className="mt-1 text-center">
          <span className="text-[10px] font-extrabold tracking-widest text-amber-300 font-display uppercase block">
            NAHDLATUL ULAMA
          </span>
          <span className="text-[9px] text-emerald-300 font-medium block">
            Lirboyo Kediri
          </span>
        </div>
      )}
    </div>
  );
};
