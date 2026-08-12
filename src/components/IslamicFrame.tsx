import React from 'react';

interface IslamicFrameProps {
  theme?: 'cream' | 'white' | 'dark' | 'sepia';
  children: React.ReactNode;
}

export const IslamicFrame: React.FC<IslamicFrameProps> = ({ theme = 'cream', children }) => {
  const isDark = theme === 'dark';

  const strokeColor = isDark ? '#f59e0b' : '#b45309';
  const fillAccent = isDark ? '#d97706' : '#854d0e';

  return (
    <div className="relative w-full h-full p-3 sm:p-5">
      {/* Outer Golden Border Box */}
      <div
        className={`relative w-full h-full rounded-2xl p-4 sm:p-6 transition-all ${
          isDark
            ? 'border-2 border-amber-500/40 shadow-[inset_0_0_20px_rgba(245,158,11,0.08)]'
            : 'border-2 border-amber-700/30 shadow-[inset_0_0_20px_rgba(180,83,9,0.05)]'
        }`}
      >
        {/* Top-Left Corner Ornament */}
        <svg
          className="absolute top-1.5 left-1.5 w-6 h-6 sm:w-8 sm:h-8 opacity-80 pointer-events-none"
          viewBox="0 0 40 40"
          fill="none"
        >
          <path d="M 0 12 C 0 4 4 0 12 0 L 25 0 C 25 8 18 15 10 15 L 10 25 C 10 17 3 12 0 12 Z" fill={fillAccent} opacity="0.15" />
          <path d="M 2 2 L 18 2 C 18 10 10 18 2 18 Z" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          <circle cx="6" cy="6" r="2" fill={strokeColor} />
        </svg>

        {/* Top-Right Corner Ornament */}
        <svg
          className="absolute top-1.5 right-1.5 w-6 h-6 sm:w-8 sm:h-8 opacity-80 pointer-events-none"
          viewBox="0 0 40 40"
          fill="none"
        >
          <path d="M 40 12 C 40 4 36 0 28 0 L 15 0 C 15 8 22 15 30 15 L 30 25 C 30 17 37 12 40 12 Z" fill={fillAccent} opacity="0.15" />
          <path d="M 38 2 L 22 2 C 22 10 30 18 38 18 Z" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          <circle cx="34" cy="6" r="2" fill={strokeColor} />
        </svg>

        {/* Bottom-Left Corner Ornament */}
        <svg
          className="absolute bottom-1.5 left-1.5 w-6 h-6 sm:w-8 sm:h-8 opacity-80 pointer-events-none"
          viewBox="0 0 40 40"
          fill="none"
        >
          <path d="M 0 28 C 0 36 4 40 12 40 L 25 40 C 25 32 18 25 10 25 L 10 15 C 10 23 3 28 0 28 Z" fill={fillAccent} opacity="0.15" />
          <path d="M 2 38 L 18 38 C 18 30 10 22 2 22 Z" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          <circle cx="6" cy="34" r="2" fill={strokeColor} />
        </svg>

        {/* Bottom-Right Corner Ornament */}
        <svg
          className="absolute bottom-1.5 right-1.5 w-6 h-6 sm:w-8 sm:h-8 opacity-80 pointer-events-none"
          viewBox="0 0 40 40"
          fill="none"
        >
          <path d="M 40 28 C 40 36 36 40 28 40 L 15 40 C 15 32 22 25 30 25 L 30 15 C 30 23 37 28 40 28 Z" fill={fillAccent} opacity="0.15" />
          <path d="M 38 38 L 22 38 C 22 30 30 22 38 22 Z" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          <circle cx="34" cy="34" r="2" fill={strokeColor} />
        </svg>

        {/* Inner Content */}
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </div>
  );
};
