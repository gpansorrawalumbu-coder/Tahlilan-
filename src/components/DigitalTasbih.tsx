import React, { useState } from 'react';
import { RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface DigitalTasbihProps {
  onCountChange?: (count: number) => void;
  target?: number;
}

export const DigitalTasbih: React.FC<DigitalTasbihProps> = ({ target = 33 }) => {
  const [count, setCount] = useState(0);
  const [sound, setSound] = useState(true);

  const increment = () => {
    const next = count + 1;
    setCount(next);

    // Haptic vibration feedback for mobile devices
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (next % target === 0) {
          navigator.vibrate([100, 50, 100]);
        } else {
          navigator.vibrate(35);
        }
      } catch (e) {
        // ignore vibration error
      }
    }

    // Gentle audio click sound
    if (sound) {
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(next % target === 0 ? 880 : 520, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } catch (e) {
        // ignore audio synth error
      }
    }
  };

  const reset = () => {
    setCount(0);
  };

  const currentRound = Math.floor(count / target) + 1;
  const progressInRound = count % target;
  const percentage = (progressInRound / target) * 100;

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900/90 to-emerald-950 text-emerald-100 rounded-3xl p-4 sm:p-5 border border-amber-500/30 shadow-2xl my-5 max-w-sm mx-auto group">
      {/* Background Islamic Geometric Pattern Accent */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-3 text-xs text-amber-200/90 border-b border-emerald-800/80 pb-2.5">
        <div className="flex items-center gap-1.5 font-bold tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="gold-text-gradient font-display text-sm">Tasbih Digital</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSound(!sound)}
            className="p-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 transition-colors border border-emerald-700/50"
            title={sound ? 'Matikan Suara' : 'Aktifkan Suara'}
          >
            {sound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-emerald-500" />}
          </button>
          <button
            onClick={reset}
            className="p-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-amber-400 transition-colors border border-emerald-700/50"
            title="Reset Hitungan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Counter Area */}
      <div className="relative z-10 text-center py-1">
        <p className="text-amber-300 font-arabic text-lg tracking-wider mb-2 drop-shadow">
          « لَا إِلٰهَ إِلَّا اللهُ »
        </p>

        {/* Circular Ring Button */}
        <div className="relative inline-flex items-center justify-center my-2">
          <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
            {/* Outer Track Ring */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="text-emerald-950/80 stroke-current"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress Animated Ring */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="text-amber-400 stroke-current transition-all duration-300 ease-out"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Core Interactive Touch Button */}
          <button
            onClick={increment}
            className="absolute inset-3 rounded-full bg-gradient-to-br from-emerald-600 via-emerald-800 to-emerald-950 hover:from-emerald-500 hover:to-emerald-800 active:scale-95 shadow-inner border-2 border-amber-400/40 flex flex-col items-center justify-center transition-all cursor-pointer group/btn select-none"
          >
            <span className="text-4xl font-extrabold text-amber-100 font-mono tracking-tight drop-shadow-md">
              {count}
            </span>
            <span className="text-[10px] uppercase font-extrabold text-amber-300 tracking-widest mt-0.5 group-active/btn:scale-90 bg-emerald-900/80 px-2 py-0.5 rounded-full border border-amber-500/30">
              TEKAN
            </span>
          </button>
        </div>

        {/* Info stats bar */}
        <div className="flex justify-between items-center text-xs text-emerald-200 mt-2 px-3 py-1.5 rounded-xl bg-emerald-900/60 border border-emerald-800/80">
          <span className="flex items-center gap-1">
            Putaran: <strong className="text-amber-300 font-bold">{currentRound}</strong>
          </span>
          <span className="flex items-center gap-1">
            Target: <strong className="text-amber-200 font-bold">{progressInRound} / {target}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

