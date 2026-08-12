import React, { useState, useEffect } from 'react';
import {
  calculatePrayerTimes,
  getNextPrayerInfo,
  CityLocation,
} from '../utils/prayerTimes';
import {
  getHijriDate,
  getJavaneseDate,
  HijriDateInfo,
  JavaneseDateInfo,
} from '../utils/javaneseHijri';
import { Clock, MapPin, ExternalLink } from 'lucide-react';

interface TopJwsBannerProps {
  selectedCity: CityLocation;
  onOpenPrayerTimes: () => void;
}

export const TopJwsBanner: React.FC<TopJwsBannerProps> = ({
  selectedCity,
  onOpenPrayerTimes,
}) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const prayerTimes = calculatePrayerTimes(selectedCity, time);
  const nextPrayer = getNextPrayerInfo(prayerTimes, time);
  const hijri: HijriDateInfo = getHijriDate(time);
  const jawa: JavaneseDateInfo = getJavaneseDate(time);

  // Time format
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  // Countdown seconds
  const parseSeconds = (str: string) => {
    const [h, m] = str.split(':').map(Number);
    return h * 3600 + m * 60;
  };
  const nowSecs = time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds();
  let targetSecs = parseSeconds(nextPrayer.time);
  if (targetSecs <= nowSecs) targetSecs += 24 * 3600;
  const diffSecs = targetSecs - nowSecs;
  const cdH = String(Math.floor(diffSecs / 3600)).padStart(2, '0');
  const cdM = String(Math.floor((diffSecs % 3600) / 60)).padStart(2, '0');
  const cdS = String(diffSecs % 60).padStart(2, '0');

  const marqueeText = `JWS KEMENAG RI • Wilayah ${selectedCity.name} • Sholat ${nextPrayer.name.toUpperCase()} (${nextPrayer.time}) sisa -${cdH}:${cdM}:${cdS} • Hari ${jawa.fullDayPasaran}, ${hijri.formatted} • Klik di sini untuk Jadwal Lengkap & GPS`;

  return (
    <div
      onClick={onOpenPrayerTimes}
      className="w-full max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto mb-2 sm:mb-3 bg-emerald-950/95 border border-amber-500/60 hover:border-amber-400 rounded-2xl px-2.5 py-1.5 sm:px-3.5 sm:py-2 shadow-xl backdrop-blur-md cursor-pointer transition-all hover:bg-black/90 active:scale-[0.995] relative group overflow-hidden select-none ring-1 ring-emerald-900 flex items-center justify-between gap-2"
      title="JWS Digital LED Mini • Klik untuk membuka Display Masjid & Jadwal Sholat Lengkap"
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />

      {/* Left: Compact Real-time Digital Clock & JWS Badge */}
      <div className="flex items-center gap-2 shrink-0 bg-black/60 px-2.5 py-1 rounded-xl border border-amber-500/40">
        <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <div className="flex items-baseline gap-1 font-mono font-bold text-amber-300 text-xs sm:text-sm tracking-wider">
          <span>{hours}</span>
          <span className="animate-pulse text-amber-400 text-xs">:</span>
          <span>{minutes}</span>
          <span className="animate-pulse text-amber-400 text-xs">:</span>
          <span className="text-[11px] text-amber-200">{seconds}</span>
        </div>
        <span className="bg-amber-500/20 text-amber-300 text-[9px] font-black px-1.5 py-0.5 rounded border border-amber-400/30 uppercase tracking-widest hidden xs:inline">
          JWS
        </span>
      </div>

      {/* Center: Running Digital LED Marquee Bar */}
      <div className="flex-1 min-w-0 overflow-hidden whitespace-nowrap relative flex items-center bg-black/40 px-2 py-1 rounded-lg border border-emerald-800/80">
        <div className="animate-marquee inline-block text-[11px] sm:text-xs font-semibold text-amber-200 tracking-wide">
          <span>✨ {marqueeText} ✨ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>🕌 {selectedCity.name} • Subuh {prayerTimes.subuh} • Dzuhur {prayerTimes.dzuhur} • Ashar {prayerTimes.ashar} • Maghrib {prayerTimes.maghrib} • Isya {prayerTimes.isya} 🕌</span>
        </div>
      </div>

      {/* Right: City Badge & Click Detail Icon */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="hidden md:flex items-center gap-1 text-[10px] text-amber-300 bg-emerald-900/80 px-2 py-1 rounded-lg border border-emerald-700 font-medium">
          <MapPin className="w-3 h-3 text-amber-400" />
          <span className="truncate max-w-[100px] font-bold">{selectedCity.name}</span>
        </div>

        <div className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black px-2 py-1 rounded-lg text-[10px] sm:text-[11px] flex items-center gap-1 shadow transition-colors">
          <span>JWS</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};


