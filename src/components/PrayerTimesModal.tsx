import React, { useState, useEffect } from 'react';
import {
  INDONESIA_CITIES,
  CityLocation,
  calculatePrayerTimes,
  getNextPrayerInfo,
  calculateQiblaAngle,
  PrayerTimesData,
  detectUserGPSLocation,
} from '../utils/prayerTimes';
import {
  getHijriDate,
  getJavaneseDate,
  HijriDateInfo,
  JavaneseDateInfo,
} from '../utils/javaneseHijri';
import {
  Clock,
  MapPin,
  X,
  Compass,
  Volume2,
  Calendar,
  Sparkles,
  Tv,
  ListFilter,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Bell,
  Sun,
  Moon,
  Info,
  Navigation,
  Loader2,
} from 'lucide-react';

interface PrayerTimesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  onOpenCompass: () => void;
}

export const PrayerTimesModal: React.FC<PrayerTimesModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
  onOpenCompass,
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'jws_display' | 'monthly'>('jws_display');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [hijriOffset, setHijriOffset] = useState<number>(0); // -2, -1, 0, 1, 2
  const [searchCityQuery, setSearchCityQuery] = useState<string>('');
  const [monthOffset, setMonthOffset] = useState<number>(0); // 0 = current month
  const [marqueeText, setMarqueeText] = useState<string>(
    "Selamat Datang di JWS Kemenag RI • Luruskan dan rapatkan shaf saat sholat berjamaah • Matikan HP saat ibadah • Pondok Pesantren Lirboyo Kediri"
  );
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationMethod, setLocationMethod] = useState<string>('');
  const [showCustomCoordInput, setShowCustomCoordInput] = useState<boolean>(false);
  const [customLat, setCustomLat] = useState<string>('');
  const [customLng, setCustomLng] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');

  const handleGetGpsLocation = async () => {
    setIsLocating(true);
    try {
      const result = await detectUserGPSLocation();
      onSelectCity(result.city);
      setLocationMethod(result.source);
    } catch (err) {
      console.warn('Location detection failed:', err);
      alert('Gagal mendeteksi lokasi secara otomatis. Silakan pilih kota Anda dari daftar pilihan.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleApplyCustomCoords = (e: React.FormEvent) => {
    e.preventDefault();
    const latNum = parseFloat(customLat);
    const lngNum = parseFloat(customLng);
    if (isNaN(latNum) || isNaN(lngNum)) {
      alert('Masukkan angka Latitude dan Longitude yang valid!');
      return;
    }
    let tz = 7;
    if (lngNum >= 125) tz = 9;
    else if (lngNum >= 115) tz = 8;

    const newCity: CityLocation = {
      id: `custom-${latNum.toFixed(4)}-${lngNum.toFixed(4)}`,
      name: customName.trim() ? customName.trim() : `Kustom (${latNum.toFixed(3)}°, ${lngNum.toFixed(3)}°)`,
      province: 'Koordinat Manual Presisi',
      lat: latNum,
      lng: lngNum,
      tz,
    };

    onSelectCity(newCity);
    setLocationMethod('Input Manual Presisi');
    setShowCustomCoordInput(false);
  };

  // Real-time tick every second
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const times = calculatePrayerTimes(selectedCity, currentTime);
  const nextInfo = getNextPrayerInfo(times, currentTime);
  const qiblaDeg = Math.round(calculateQiblaAngle(selectedCity.lat, selectedCity.lng));

  const hijriInfo: HijriDateInfo = getHijriDate(currentTime, hijriOffset);
  const javaneseInfo: JavaneseDateInfo = getJavaneseDate(currentTime, hijriOffset);

  // Countdown math with seconds
  const parseMinsSeconds = (str: string) => {
    const [h, m] = str.split(':').map(Number);
    return h * 3600 + m * 60;
  };
  const nowSeconds = currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds();
  let targetSeconds = parseMinsSeconds(nextInfo.time);
  if (targetSeconds <= nowSeconds) {
    targetSeconds += 24 * 3600; // Tomorrow Subuh
  }
  const diffSeconds = Math.max(0, targetSeconds - nowSeconds);
  const hoursLeft = Math.floor(diffSeconds / 3600);
  const minsLeft = Math.floor((diffSeconds % 3600) / 60);
  const secsLeft = diffSeconds % 60;

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const dateFormatted = currentTime.toLocaleDateString('id-ID', dateOptions);

  const prayerItems = [
    { key: 'imsak', name: 'Imsak', time: times.imsak, icon: '🌃', desc: 'Batas sahur' },
    { key: 'subuh', name: 'Subuh', time: times.subuh, icon: '🌅', desc: 'Fajar shadiq' },
    { key: 'terbit', name: 'Syuruq', time: times.terbit, icon: '☀️', desc: 'Matahari terbit' },
    { key: 'dhuha', name: 'Dhuha', time: times.dhuha, icon: '🌤️', desc: 'Awal dhuha' },
    { key: 'dzuhur', name: 'Dzuhur', time: times.dzuhur, icon: '☀️', desc: 'Matahari tergelincir' },
    { key: 'ashar', name: 'Ashar', time: times.ashar, icon: '⛅', desc: 'Bayangan 1:1' },
    { key: 'maghrib', name: 'Maghrib', time: times.maghrib, icon: '🌆', desc: 'Terbenam matahari' },
    { key: 'isya', name: 'Isya', time: times.isya, icon: '🌙', desc: 'Hilang syafaq merah' },
  ];

  const playAdhanBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.4); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      // ignore audio context errors
    }
  };

  const filteredCities = INDONESIA_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchCityQuery.toLowerCase()) ||
      c.province.toLowerCase().includes(searchCityQuery.toLowerCase())
  );

  // Generate monthly schedule table for selected city & month
  const targetMonthDate = new Date(currentTime.getFullYear(), currentTime.getMonth() + monthOffset, 1);
  const daysInMonth = new Date(targetMonthDate.getFullYear(), targetMonthDate.getMonth() + 1, 0).getDate();
  const monthNameYear = targetMonthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  const monthlyList = Array.from({ length: daysInMonth }, (_, i) => {
    const dayDate = new Date(targetMonthDate.getFullYear(), targetMonthDate.getMonth(), i + 1);
    const dayPrayerTimes = calculatePrayerTimes(selectedCity, dayDate);
    const dayHijri = getHijriDate(dayDate, hijriOffset);
    const dayJawa = getJavaneseDate(dayDate, hijriOffset);
    return {
      dayNum: i + 1,
      dayName: dayJawa.dayName,
      pasaran: dayJawa.pasaranName,
      hijriStr: `${dayHijri.day} ${dayHijri.monthNameIndo}`,
      times: dayPrayerTimes,
      isToday:
        dayDate.getDate() === new Date().getDate() &&
        dayDate.getMonth() === new Date().getMonth() &&
        dayDate.getFullYear() === new Date().getFullYear(),
    };
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn select-none">
      <div className="bg-gradient-to-b from-emerald-950 via-[#022c1f] to-emerald-950 text-emerald-50 rounded-3xl border-2 border-amber-500/50 shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col max-h-[92vh]">
        {/* Modal Top Bar Header */}
        <div className="p-3 sm:p-4 border-b border-emerald-800/80 bg-emerald-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 rounded-2xl border border-amber-400/40 text-amber-300">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold gold-text-gradient font-display text-base sm:text-lg">
                  JWS Kemenag RI
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                  Kalender Hijriyah & Jawa
                </span>
              </div>
              <p className="text-[11px] text-emerald-300 font-medium">
                Standard Hisab Depag RI • Hisab Ihtiyath +2 Menit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-emerald-300 hover:text-white rounded-2xl hover:bg-emerald-800/60 transition-colors"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Tabs Bar */}
        <div className="bg-emerald-950/90 border-b border-emerald-800/60 px-3 py-2 flex items-center justify-between gap-1 sm:gap-2 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5 bg-emerald-900/50 p-1 rounded-2xl border border-emerald-800/60 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('jws_display')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'jws_display'
                  ? 'bg-amber-500 text-emerald-950 shadow-md scale-105'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Display Masjid</span>
            </button>

            <button
              onClick={() => setActiveTab('card')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'card'
                  ? 'bg-amber-500 text-emerald-950 shadow-md scale-105'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Jadwal Harian</span>
            </button>

            <button
              onClick={() => setActiveTab('monthly')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'monthly'
                  ? 'bg-amber-500 text-emerald-950 shadow-md scale-105'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Tabel Bulanan</span>
            </button>
          </div>

          {/* Quick Hijri Offset Button */}
          <div className="hidden md:flex items-center gap-1 text-[11px] text-amber-300/90 font-medium bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
            <Sliders className="w-3 h-3 text-amber-400" />
            <span>Koreksi Hilal:</span>
            <button
              onClick={() => setHijriOffset((prev) => (prev > -2 ? prev - 1 : prev))}
              className="w-5 h-5 bg-emerald-900 rounded hover:bg-amber-500 hover:text-emerald-950 font-bold flex items-center justify-center"
              title="Kurangi 1 hari"
            >
              -
            </button>
            <span className="font-mono font-bold text-amber-200 px-1">
              {hijriOffset > 0 ? `+${hijriOffset}` : hijriOffset} d
            </span>
            <button
              onClick={() => setHijriOffset((prev) => (prev < 2 ? prev + 1 : prev))}
              className="w-5 h-5 bg-emerald-900 rounded hover:bg-amber-500 hover:text-emerald-950 font-bold flex items-center justify-center"
              title="Tambah 1 hari"
            >
              +
            </button>
          </div>
        </div>

        {/* Modal Main Scrollable Content */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* Location Selector Bar */}
          <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/60 shadow-inner space-y-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-emerald-300 font-medium block">
                    Wilayah / Kota Aktif:
                  </span>
                  <select
                    value={selectedCity.id}
                    onChange={(e) => {
                      const found = INDONESIA_CITIES.find((c) => c.id === e.target.value);
                      if (found) {
                        onSelectCity(found);
                        setLocationMethod('Pilihan Daftar Kota');
                      }
                    }}
                    className="bg-transparent text-xs sm:text-sm font-extrabold text-amber-200 focus:outline-none w-full cursor-pointer"
                  >
                    {!INDONESIA_CITIES.some((c) => c.id === selectedCity.id) && (
                      <option value={selectedCity.id} className="bg-emerald-950 text-amber-300 font-bold">
                        📍 {selectedCity.name} ({selectedCity.lat.toFixed(4)}°, {selectedCity.lng.toFixed(4)}°)
                      </option>
                    )}
                    {INDONESIA_CITIES.map((c) => (
                      <option key={c.id} value={c.id} className="bg-emerald-950 text-emerald-100">
                        {c.name} ({c.province}) • UTC+{c.tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleGetGpsLocation}
                  disabled={isLocating}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
                  title="Deteksi posisi GPS otomatis lokasi Anda"
                >
                  {isLocating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Navigation className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>{isLocating ? 'Deteksi...' : 'GPS Otomatis'}</span>
                </button>

                <button
                  onClick={() => {
                    setCustomLat(selectedCity.lat.toString());
                    setCustomLng(selectedCity.lng.toString());
                    setCustomName(selectedCity.name.replace(/^Lokasi Saya \((.*)\)$/, '$1'));
                    setShowCustomCoordInput(!showCustomCoordInput);
                  }}
                  className="px-2.5 py-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-amber-200 border border-emerald-600/60 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                  title="Input koordinat Latitude & Longitude manual"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Input Lat/Lng</span>
                </button>

                <button
                  onClick={onOpenCompass}
                  className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kiblat ({qiblaDeg}°)</span>
                </button>
              </div>
            </div>

            {/* Active GPS Info Badge */}
            <div className="flex flex-wrap items-center justify-between text-[11px] bg-black/40 px-3 py-1.5 rounded-xl border border-emerald-800/60 text-emerald-300 gap-1">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-amber-400 font-bold">📍 Koordinat:</span>
                <span className="text-amber-200 font-bold">
                  {selectedCity.lat.toFixed(5)}°, {selectedCity.lng.toFixed(5)}°
                </span>
                <span className="text-emerald-400 font-bold ml-1">(UTC+{selectedCity.tz})</span>
              </div>
              {locationMethod && (
                <div className="text-[10px] text-amber-300/90 font-medium">
                  Metode: <span className="text-amber-200 font-bold">{locationMethod}</span>
                </div>
              )}
            </div>

            {/* Manual Lat/Lng Form Drawer */}
            {showCustomCoordInput && (
              <form onSubmit={handleApplyCustomCoords} className="mt-2 p-3 bg-emerald-950/90 border border-amber-500/50 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-amber-300 font-bold border-b border-emerald-800 pb-1">
                  <span>Input Koordinat Manual (Presisi Tinggi)</span>
                  <button type="button" onClick={() => setShowCustomCoordInput(false)} className="text-emerald-400 hover:text-white">✕</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-emerald-300 font-medium mb-0.5">Nama Lokasi / Masjid:</label>
                    <input
                      type="text"
                      placeholder="Misal: Ponpes / Masjid Al-Barkah"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-emerald-900 border border-emerald-700 rounded px-2 py-1 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-emerald-300 font-medium mb-0.5">Latitude (Lintang):</label>
                    <input
                      type="text"
                      placeholder="-7.8167"
                      value={customLat}
                      onChange={(e) => setCustomLat(e.target.value)}
                      className="w-full bg-emerald-900 border border-emerald-700 rounded px-2 py-1 text-amber-100 font-mono text-xs focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-emerald-300 font-medium mb-0.5">Longitude (Bujur):</label>
                    <input
                      type="text"
                      placeholder="112.0167"
                      value={customLng}
                      onChange={(e) => setCustomLng(e.target.value)}
                      className="w-full bg-emerald-900 border border-emerald-700 rounded px-2 py-1 text-amber-100 font-mono text-xs focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCustomCoordInput(false)}
                    className="px-3 py-1 bg-emerald-900 text-emerald-300 rounded hover:bg-emerald-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded shadow"
                  >
                    Terapkan Koordinat
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* TAB 1: DISPLAY MASJID MODE (Digital LED Mosque Board Format) */}
          {activeTab === 'jws_display' && (
            <div className="space-y-3">
              {/* LED Digital Display Header Frame */}
              <div className="bg-black/90 border-2 border-amber-500/70 rounded-3xl p-4 sm:p-5 text-center shadow-2xl relative overflow-hidden ring-4 ring-black/50">
                {/* Real-time Clock & Date Display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center border-b border-amber-500/30 pb-3 mb-3">
                  {/* Left: Hijri & Arabic Date */}
                  <div className="text-center md:text-left space-y-0.5">
                    <p className="text-xs text-amber-400 font-bold font-arabic">
                      {hijriInfo.formattedArabic}
                    </p>
                    <p className="text-xs text-amber-200 font-bold">
                      {hijriInfo.formatted}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-medium">
                      {javaneseInfo.javaneseMonthName} {javaneseInfo.javaneseYear} ({javaneseInfo.yearName})
                    </p>
                  </div>

                  {/* Middle: Big Digital Running Clock */}
                  <div className="text-center bg-emerald-950/80 p-2 rounded-2xl border border-amber-500/40 shadow-inner">
                    <span className="text-[10px] text-emerald-300 font-extrabold tracking-widest uppercase block">
                      JAM DIGITAL MASJID
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-amber-300 gold-text-gradient">
                      {currentTime.toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Right: Gregorian & Javanese Pasaran */}
                  <div className="text-center md:text-right space-y-0.5">
                    <p className="text-xs text-amber-200 font-bold">
                      {dateFormatted}
                    </p>
                    <p className="text-xs text-amber-300 font-extrabold">
                      Pasaran: <span className="bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/40">{javaneseInfo.fullDayPasaran}</span>
                    </p>
                    <p className="text-[10px] text-emerald-300">
                      Neptu: {javaneseInfo.totalNeptu} ({javaneseInfo.neptuDay} + {javaneseInfo.neptuPasaran})
                    </p>
                  </div>
                </div>

                {/* Banner: Countdown to Next Prayer */}
                <div className="bg-gradient-to-r from-amber-600/30 via-amber-500/20 to-amber-600/30 border border-amber-400/50 rounded-2xl p-3 text-center shadow-lg my-3">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="text-left">
                      <span className="text-[10px] uppercase font-bold text-amber-300/80 tracking-wider">
                        MENUNJU WAKTU SHOLAT:
                      </span>
                      <h4 className="text-lg font-black text-amber-200">
                        Sholat {nextInfo.name} ({nextInfo.time} WIB)
                      </h4>
                    </div>

                    <div className="bg-black/60 px-4 py-1.5 rounded-xl border border-amber-400/40 font-mono text-center">
                      <span className="text-[10px] text-emerald-300 block">SISA WAKTU:</span>
                      <span className="text-lg font-extrabold text-amber-300">
                        {String(hoursLeft).padStart(2, '0')}:{String(minsLeft).padStart(2, '0')}:{String(secsLeft).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid 8 Waktu Sholat Boxes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                  {prayerItems.map((item) => {
                    const isNext = nextInfo.name.includes(item.name);
                    return (
                      <div
                        key={item.key}
                        className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center text-center ${
                          isNext
                            ? 'bg-amber-500/30 border-amber-300 text-amber-100 shadow-xl ring-2 ring-amber-400 scale-105'
                            : 'bg-emerald-950/70 border-emerald-800/70 hover:bg-emerald-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-base">{item.icon}</span>
                          <span className="text-xs font-bold text-amber-200">{item.name}</span>
                        </div>
                        <span className="text-lg font-black font-mono text-amber-300 tracking-wider">
                          {item.time}
                        </span>
                        <span className="text-[9px] text-emerald-300/80 mt-0.5 font-medium">
                          {item.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Running Marquee Text Bar (Masjid LED Marquee) */}
                <div className="mt-4 bg-emerald-950/90 border border-amber-500/40 rounded-xl p-1.5 overflow-hidden shadow-inner">
                  <div className="whitespace-nowrap animate-marquee flex items-center gap-4 text-xs font-semibold text-amber-300">
                    <span>✨ {marqueeText} ✨</span>
                    <span>🕌 Kemenag RI • Waktu Kiblat Kediri & Indonesia 🕌</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={playAdhanBeep}
                  className="px-3 py-2 bg-emerald-900 hover:bg-emerald-800 text-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-amber-500/30 transition-all"
                >
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>Tes Bel / Adhan</span>
                </button>

                <div className="flex items-center gap-1 text-xs text-emerald-300">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>Otomatis disesuaikan koordinat kota</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: JADWAL HARIAN & DETAIL KALENDER HIJRIYAH - JAWA */}
          {activeTab === 'card' && (
            <div className="space-y-4">
              {/* Hijri & Javanese Calendar Card Details */}
              <div className="bg-gradient-to-r from-amber-950/40 via-emerald-900/50 to-amber-950/40 border border-amber-500/40 rounded-2xl p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <h4 className="font-bold text-amber-200 text-sm">
                      Detail Kalender Hijriyah & Jawa
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 text-xs bg-emerald-950 px-2.5 py-1 rounded-xl border border-amber-500/30 text-amber-300">
                    <span>Koreksi Hilal:</span>
                    <button
                      onClick={() => setHijriOffset((p) => Math.max(-2, p - 1))}
                      className="w-5 h-5 bg-emerald-800 rounded font-bold hover:bg-amber-500 hover:text-emerald-950 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-amber-200 px-1">{hijriOffset} d</span>
                    <button
                      onClick={() => setHijriOffset((p) => Math.min(2, p + 1))}
                      className="w-5 h-5 bg-emerald-800 rounded font-bold hover:bg-amber-500 hover:text-emerald-950 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Hijri Info Box */}
                  <div className="bg-emerald-950/80 p-3 rounded-xl border border-amber-500/30 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400">
                      🌙 KALENDER HIJRIYAH (KEMENAG)
                    </span>
                    <p className="text-sm font-extrabold text-amber-100">
                      {hijriInfo.formatted}
                    </p>
                    <p className="text-base font-bold font-arabic text-amber-300">
                      {hijriInfo.formattedArabic}
                    </p>
                    <p className="text-[11px] text-emerald-300">
                      Bulan: {hijriInfo.monthNameIndo} ({hijriInfo.monthNameArabic})
                    </p>
                  </div>

                  {/* Javanese Info Box */}
                  <div className="bg-emerald-950/80 p-3 rounded-xl border border-amber-500/30 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400">
                      🌾 KALENDER JAWA & PASARAN
                    </span>
                    <p className="text-sm font-extrabold text-amber-100">
                      {javaneseInfo.fullDayPasaran}
                    </p>
                    <p className="text-xs font-bold text-amber-300">
                      Sasi {javaneseInfo.javaneseMonthName} Tahun {javaneseInfo.javaneseYear} ({javaneseInfo.yearName})
                    </p>
                    <p className="text-[11px] text-emerald-300">
                      Hitungan Neptu: <span className="font-bold text-amber-200">{javaneseInfo.totalNeptu}</span> ({javaneseInfo.dayName}: {javaneseInfo.neptuDay} + {javaneseInfo.pasaranName}: {javaneseInfo.neptuPasaran})
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid 8 Prayer Times Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {prayerItems.map((item) => {
                  const isNext = nextInfo.name.includes(item.name);
                  return (
                    <div
                      key={item.key}
                      className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center text-center ${
                        isNext
                          ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-lg scale-105'
                          : 'bg-emerald-900/30 border-emerald-800/60 hover:bg-emerald-800/40'
                      }`}
                    >
                      <span className="text-xl mb-0.5">{item.icon}</span>
                      <span className="text-xs font-bold text-emerald-200">{item.name}</span>
                      <span className="text-base font-extrabold font-mono text-amber-300 mt-0.5">
                        {item.time}
                      </span>
                      <span className="text-[10px] text-emerald-300/80 font-medium">
                        {item.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: TABEL JADWAL SHOLAT BULANAN */}
          {activeTab === 'monthly' && (
            <div className="space-y-3">
              {/* Month Navigation Control */}
              <div className="flex items-center justify-between bg-emerald-900/60 p-2.5 rounded-2xl border border-emerald-700/60 text-xs">
                <button
                  onClick={() => setMonthOffset((p) => p - 1)}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-amber-500 hover:text-emerald-950 text-amber-200 rounded-xl font-bold flex items-center gap-1 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Bulan Lalu</span>
                </button>

                <div className="text-center">
                  <h4 className="font-extrabold text-amber-200 text-sm">
                    {monthNameYear}
                  </h4>
                  <p className="text-[10px] text-emerald-300">
                    Jadwal Sholat {selectedCity.name}
                  </p>
                </div>

                <button
                  onClick={() => setMonthOffset((p) => p + 1)}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-amber-500 hover:text-emerald-950 text-amber-200 rounded-xl font-bold flex items-center gap-1 transition-all"
                >
                  <span>Bulan Depan</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Monthly Schedule Table */}
              <div className="overflow-x-auto rounded-2xl border border-emerald-800/80 bg-emerald-950/80 max-h-[50vh]">
                <table className="w-full text-left text-xs text-emerald-100 border-collapse min-w-[620px]">
                  <thead className="bg-emerald-900/90 text-amber-300 font-bold sticky top-0 border-b border-emerald-700">
                    <tr>
                      <th className="p-2 sm:p-2.5 text-center">Tgl</th>
                      <th className="p-2 sm:p-2.5">Hari & Pasaran</th>
                      <th className="p-2 sm:p-2.5">Hijriyah</th>
                      <th className="p-2 sm:p-2.5 text-center">Imsak</th>
                      <th className="p-2 sm:p-2.5 text-center">Subuh</th>
                      <th className="p-2 sm:p-2.5 text-center">Terbit</th>
                      <th className="p-2 sm:p-2.5 text-center">Dzuhur</th>
                      <th className="p-2 sm:p-2.5 text-center">Ashar</th>
                      <th className="p-2 sm:p-2.5 text-center">Maghrib</th>
                      <th className="p-2 sm:p-2.5 text-center">Isya</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/60 font-mono text-[11px]">
                    {monthlyList.map((row) => (
                      <tr
                        key={row.dayNum}
                        className={
                          row.isToday
                            ? 'bg-amber-500/25 text-amber-200 font-bold'
                            : 'hover:bg-emerald-900/40'
                        }
                      >
                        <td className="p-2 text-center font-bold">{row.dayNum}</td>
                        <td className="p-2 font-sans font-medium text-emerald-200">
                          {row.dayName} {row.pasaran}
                        </td>
                        <td className="p-2 font-sans text-emerald-300 text-[10px]">
                          {row.hijriStr}
                        </td>
                        <td className="p-2 text-center text-emerald-300">{row.times.imsak}</td>
                        <td className="p-2 text-center text-amber-300 font-bold">{row.times.subuh}</td>
                        <td className="p-2 text-center text-emerald-300">{row.times.terbit}</td>
                        <td className="p-2 text-center text-amber-200">{row.times.dzuhur}</td>
                        <td className="p-2 text-center text-amber-200">{row.times.ashar}</td>
                        <td className="p-2 text-center text-amber-300 font-bold">{row.times.maghrib}</td>
                        <td className="p-2 text-center text-emerald-200">{row.times.isya}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Bar */}
        <div className="p-3 border-t border-emerald-800/80 bg-emerald-900/60 text-center flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-emerald-300 shrink-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Kemenag RI • Hisab Ihtiyath +2 Menit Depag</span>
          </div>

          <div className="text-amber-300/80 font-medium text-[10px]">
            {javaneseInfo.fullDayPasaran} • {hijriInfo.formatted}
          </div>
        </div>
      </div>
    </div>
  );
};
