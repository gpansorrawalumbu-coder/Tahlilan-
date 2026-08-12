import React, { useState, useEffect } from 'react';
import {
  INDONESIA_CITIES,
  CityLocation,
  calculateQiblaAngle,
} from '../utils/prayerTimes';
import { Compass, X, MapPin, Navigation, AlertCircle, RefreshCw } from 'lucide-react';
import { NuLogoOrnament } from './NuLogoOrnament';

interface QiblaCompassModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
}

export const QiblaCompassModal: React.FC<QiblaCompassModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
}) => {
  const [heading, setHeading] = useState<number | null>(null);
  const [hasSensor, setHasSensor] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  const qiblaDegree = Math.round(calculateQiblaAngle(selectedCity.lat, selectedCity.lng));

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let compassHeading: number | null = null;

      if ((e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading !== undefined) {
        // iOS Safari
        compassHeading = (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Android / Standard W3C
        compassHeading = 360 - e.alpha;
      }

      if (compassHeading !== null) {
        setHeading(Math.round(compassHeading));
        setHasSensor(true);
      }
    };

    if (window.DeviceOrientationEvent && isOpen) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isOpen]);

  const requestCompassPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (response === 'granted') {
          setPermissionState('granted');
        } else {
          setPermissionState('denied');
        }
      } catch (err) {
        console.error('Compass permission error:', err);
      }
    } else {
      setPermissionState('granted');
    }
  };

  if (!isOpen) return null;

  // Real or simulated compass rotation angle
  const compassRotation = heading !== null ? heading : 0;
  const needleRotation = qiblaDegree - compassRotation;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-gradient-to-b from-emerald-950 via-[#033b2a] to-emerald-950 text-emerald-50 rounded-3xl border border-amber-500/40 shadow-2xl w-full max-w-md overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b border-emerald-800/80 bg-emerald-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-amber-400 animate-spin-slow" />
            <div>
              <h3 className="font-extrabold gold-text-gradient font-display text-base">
                Kompas Penunjuk Kiblat
              </h3>
              <p className="text-[10px] text-emerald-300 font-medium">
                Versi Depag Indonesia • Lirboyo Kediri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white rounded-xl hover:bg-emerald-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col items-center space-y-4">
          {/* City Selector Dropdown */}
          <div className="w-full bg-emerald-900/40 p-2.5 rounded-2xl border border-emerald-700/60 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <select
              value={selectedCity.id}
              onChange={(e) => {
                const found = INDONESIA_CITIES.find((c) => c.id === e.target.value);
                if (found) onSelectCity(found);
              }}
              className="bg-transparent text-xs font-bold text-amber-200 focus:outline-none w-full cursor-pointer"
            >
              {INDONESIA_CITIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-emerald-950 text-emerald-100">
                  {c.name} ({c.province})
                </option>
              ))}
            </select>
          </div>

          {/* Compass Dial Visual */}
          <div className="relative w-64 h-64 my-2 flex items-center justify-center">
            {/* Outer Decorative Gold Frame */}
            <div className="absolute inset-0 rounded-full border-4 border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.2)] bg-emerald-950/80" />

            {/* Rotating Dial Scale */}
            <div
              className="absolute inset-2 rounded-full border-2 border-emerald-700/60 transition-transform duration-300 ease-out flex items-center justify-center"
              style={{ transform: `rotate(-${compassRotation}deg)` }}
            >
              {/* Cardinal directions */}
              <span className="absolute top-3 font-extrabold text-amber-400 text-xs font-mono">U</span>
              <span className="absolute bottom-3 font-extrabold text-emerald-400 text-xs font-mono">S</span>
              <span className="absolute right-3 font-extrabold text-emerald-400 text-xs font-mono">T</span>
              <span className="absolute left-3 font-extrabold text-emerald-400 text-xs font-mono">B</span>

              {/* Ticks around the ring */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-2 bg-emerald-600/60 top-1"
                  style={{
                    transformOrigin: '50% 120px',
                    transform: `rotate(${i * 30}deg)`,
                  }}
                />
              ))}
            </div>

            {/* Pointer / Needle pointing directly to Qibla Angle */}
            <div
              className="absolute w-full h-full flex items-center justify-center transition-transform duration-300 ease-out pointer-events-none"
              style={{ transform: `rotate(${needleRotation}deg)` }}
            >
              {/* Qibla Needle Arrow */}
              <div className="flex flex-col items-center -mt-24">
                <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-amber-200 flex items-center justify-center shadow-lg text-emerald-950 font-extrabold text-xs">
                  🕋
                </div>
                <div className="w-1.5 h-16 bg-gradient-to-t from-amber-600 to-amber-300 rounded-full shadow-md" />
              </div>
            </div>

            {/* Center Emblem */}
            <div className="relative z-10 bg-emerald-950 border-2 border-amber-400/80 rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-xl">
              <NuLogoOrnament size="sm" showLabel={false} />
            </div>
          </div>

          {/* Compass Angle Info Badge */}
          <div className="w-full bg-emerald-900/60 border border-amber-500/30 rounded-2xl p-3 text-center space-y-1">
            <div className="flex items-center justify-center gap-2 text-amber-300 font-extrabold text-sm">
              <Navigation className="w-4 h-4 text-amber-400" />
              <span>Arah Kiblat: {qiblaDegree}° dari Utara</span>
            </div>
            <p className="text-[11px] text-emerald-300">
              {selectedCity.name} • Barat Laut (~295° untuk Indonesia)
            </p>
          </div>

          {/* Sensor Info or Request Permission */}
          {!hasSensor && permissionState === 'prompt' && (
            <button
              onClick={requestCompassPermission}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Aktifkan Sensor Magnetik HP</span>
            </button>
          )}

          {!hasSensor && (
            <p className="text-[10px] text-amber-300/80 text-center flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Jika sensor magnetik tidak tersedia, sudut arah Kiblat tetap dihitung presisi berdasarkan koordinat lokasi kota.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-emerald-800/80 bg-emerald-900/40 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-extrabold text-xs rounded-xl shadow-md transition-all"
          >
            Tutup Kompas
          </button>
        </div>
      </div>
    </div>
  );
};
