import React, { useState, useEffect } from 'react';
import { ReaderSettings, CustomBookImages } from './types';
import {
  loadStoredImages,
  loadStoredImagesAsync,
  saveStoredImagesAsync,
  loadStoredSettings,
  saveStoredSettings,
  loadLastPage,
  saveLastPage,
  loadBookmarks,
  saveBookmarks,
} from './utils/storage';
import { PocketBook } from './components/PocketBook';
import { DaftarIsiDrawer } from './components/DaftarIsiDrawer';
import { SettingsModal } from './components/SettingsModal';
import { ImageUploader } from './components/ImageUploader';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { PrayerTimesModal } from './components/PrayerTimesModal';
import { QiblaCompassModal } from './components/QiblaCompassModal';
import { SurahYasinModal } from './components/SurahYasinModal';
import { TopJwsBanner } from './components/TopJwsBanner';
import { INDONESIA_CITIES, CityLocation } from './utils/prayerTimes';
import { Sliders, Smartphone, Clock, Compass, Sparkles, CheckCircle2, Maximize2, Minimize2 } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [settings, setSettings] = useState<ReaderSettings>(loadStoredSettings);
  const [customImages, setCustomImages] = useState<CustomBookImages>(loadStoredImages);
  const [bookmarks, setBookmarks] = useState<number[]>(loadBookmarks);
  const [selectedCity, setSelectedCity] = useState<CityLocation>(INDONESIA_CITIES[0]); // Default Kediri (Lirboyo)
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  // Modals & Drawers state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPwaInfoOpen, setIsPwaInfoOpen] = useState(false);
  const [isPrayerTimesOpen, setIsPrayerTimesOpen] = useState(false);
  const [isCompassOpen, setIsCompassOpen] = useState(false);
  const [isYasinOpen, setIsYasinOpen] = useState(false);

  // ESC / F keyboard listener to exit or toggle Focus Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  // Load last page and stored IndexedDB custom images on mount
  useEffect(() => {
    const lastP = loadLastPage();
    setCurrentPage(lastP);

    loadStoredImagesAsync().then((imgs) => {
      if (imgs && Object.keys(imgs).length > 0) {
        setCustomImages(imgs);
      }
    });
  }, []);

  // Sync state changes with local storage / IndexedDB
  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    saveLastPage(p);
  };

  const handleUpdateSettings = (newSettings: ReaderSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  const handleUpdateImages = async (newImages: CustomBookImages) => {
    setCustomImages(newImages);
    await saveStoredImagesAsync(newImages);
  };

  const handleToggleBookmark = (p: number) => {
    let updated: number[];
    if (bookmarks.includes(p)) {
      updated = bookmarks.filter((item) => item !== p);
    } else {
      updated = [...bookmarks, p];
    }
    setBookmarks(updated);
    saveBookmarks(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-[#06241a] to-emerald-950 text-emerald-50 flex flex-col font-sans antialiased selection:bg-amber-400 selection:text-emerald-950 relative overflow-x-hidden">
      {/* Background Ambient Radial Glow Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-80 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Floating Focus Mode Banner Indicator */}
      {isFocusMode && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 bg-emerald-950/95 border border-amber-400/80 backdrop-blur-md rounded-full px-4 py-1.5 shadow-2xl flex items-center gap-3 text-xs text-amber-200 animate-in fade-in slide-in-from-top duration-300">
          <span className="flex items-center gap-1.5 font-bold text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            🎯 Mode Fokus (Layar Bersih & Tenang)
          </span>
          <button
            onClick={() => setIsFocusMode(false)}
            className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold px-2.5 py-0.5 rounded-full text-[11px] transition-colors flex items-center gap-1 shadow"
            title="Keluar dari Mode Fokus"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Keluar (ESC)</span>
          </button>
        </div>
      )}

      {/* Top Main Navigation Header (Hidden in Focus Mode) */}
      {!isFocusMode && (
        <header className="sticky top-0 z-40 bg-emerald-950/90 backdrop-blur-xl border-b border-amber-500/20 px-4 py-3 shadow-2xl transition-all">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handlePageChange(0)}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-200 flex items-center justify-center text-emerald-950 font-bold shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-xl">📖</span>
              </div>
              <div>
                <h1 className="font-extrabold text-sm sm:text-base gold-text-gradient font-display tracking-tight leading-none flex items-center gap-1.5">
                  TAHLIL LIRBOYO RINGKAS
                </h1>
                <p className="text-[11px] text-emerald-300 font-medium leading-tight mt-0.5 flex items-center gap-1">
                  <span>Ringkasan Ustadz Muhammad Qosyim</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Focus Mode Button in Header */}
              <button
                onClick={() => setIsFocusMode(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/80 text-amber-200 text-xs font-extrabold hover:bg-amber-500/30 transition-all shadow-md active:scale-95"
                title="Aktifkan Mode Fokus (Sembunyikan Header & Footer)"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Mode Fokus</span>
              </button>

              {/* Surat Yasin Button */}
              <button
                onClick={() => setIsYasinOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/30 via-emerald-800 to-amber-500/30 border border-amber-400/80 text-amber-200 text-xs font-extrabold hover:bg-amber-500/40 shadow-lg transition-all active:scale-95"
                title="Baca Surat Yasin Lengkap (83 Ayat)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Surat Yasin</span>
              </button>

              {/* Prayer Times Button */}
              <button
                onClick={() => setIsPrayerTimesOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-200 text-xs font-semibold hover:bg-amber-500/30 transition-all"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Jadwal Sholat</span>
              </button>

              {/* Qibla Compass Button */}
              <button
                onClick={() => setIsCompassOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-200 text-xs font-semibold hover:bg-amber-500/30 transition-all"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Kompas Kiblat</span>
              </button>

              {/* View mode toggle pill */}
              <button
                onClick={() =>
                  handleUpdateSettings({
                    ...settings,
                    viewMode: settings.viewMode === 'digital' ? 'image' : 'digital',
                  })
                }
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  settings.viewMode === 'image'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm'
                    : 'bg-emerald-900/60 border-emerald-700 text-emerald-200 hover:bg-emerald-800/60'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>{settings.viewMode === 'image' ? 'Scan Foto' : 'Teks Digital'}</span>
              </button>

              {/* Install APK/PWA button */}
              <button
                onClick={() => setIsPwaInfoOpen(true)}
                className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-emerald-950 font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all active:scale-95 border border-amber-300"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Install HP</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Pocket Book Container */}
      <main className={`flex-1 max-w-3xl md:max-w-4xl lg:max-w-5xl w-full mx-auto px-3 sm:px-4 ${isFocusMode ? 'py-1 sm:py-2 pt-10' : 'py-3 sm:py-5'} flex flex-col justify-start relative z-10 transition-all`}>
        {/* TOP JWS DIGITAL CLOCK & RUNNING TEXT MARQUEE BANNER (Hidden in Focus Mode) */}
        {!isFocusMode && (
          <TopJwsBanner
            selectedCity={selectedCity}
            onOpenPrayerTimes={() => setIsPrayerTimesOpen(true)}
          />
        )}

        {/* Offline & Custom Upload Notification Bar */}
        {Object.keys(customImages).length > 0 && !isFocusMode && (
          <div className="mb-3 bg-amber-500/15 backdrop-blur-md border border-amber-500/40 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs text-amber-200 shadow-lg">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              Menggunakan foto buku saku kustom yang Anda unggah ({Object.keys(customImages).length} foto terpasang)
            </span>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="font-bold underline hover:text-amber-100 shrink-0 ml-2 px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400/40"
            >
              Atur
            </button>
          </div>
        )}

        <PocketBook
          currentPage={currentPage}
          onPageChange={handlePageChange}
          settings={settings}
          customImages={customImages}
          bookmarks={bookmarks}
          onToggleBookmark={handleToggleBookmark}
          isFocusMode={isFocusMode}
          onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenPwaInfo={() => setIsPwaInfoOpen(true)}
          onOpenPrayerTimes={() => setIsPrayerTimesOpen(true)}
          onOpenCompass={() => setIsCompassOpen(true)}
          onOpenYasin={() => setIsYasinOpen(true)}
        />
      </main>

      {/* Footer (Hidden in Focus Mode) */}
      {!isFocusMode && (
        <footer className="border-t border-emerald-800/60 bg-emerald-950/90 backdrop-blur-lg py-4 px-4 text-center text-xs text-emerald-400/80 relative z-10 transition-all">
          <div className="max-w-xl mx-auto space-y-1">
            <p className="font-semibold text-amber-200/90 font-display">
              Aplikasi TAHLIL LIRBOYO RINGKAS • Versi Ringkasan Ustadz Muhammad Qosyim
            </p>
            <p className="text-[11px] text-emerald-400/80">
              Dapat diinstall langsung di Android • Tanpa Iklan • Ringan & Bebas Internet
            </p>
          </div>
        </footer>
      )}

      {/* Overlays */}
      <DaftarIsiDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentPage={currentPage}
        onSelectPage={handlePageChange}
        bookmarks={bookmarks}
        onToggleBookmark={handleToggleBookmark}
        onOpenYasin={() => setIsYasinOpen(true)}
      />

      <SurahYasinModal
        isOpen={isYasinOpen}
        onClose={() => setIsYasinOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenPwaInfo={() => setIsPwaInfoOpen(true)}
      />

      <PrayerTimesModal
        isOpen={isPrayerTimesOpen}
        onClose={() => setIsPrayerTimesOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        onOpenCompass={() => setIsCompassOpen(true)}
      />

      <QiblaCompassModal
        isOpen={isCompassOpen}
        onClose={() => setIsCompassOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
      />

      {isUploadOpen && (
        <ImageUploader
          images={customImages}
          onUpdateImages={handleUpdateImages}
          onClose={() => setIsUploadOpen(false)}
        />
      )}

      <PwaInstallPrompt
        isOpen={isPwaInfoOpen}
        onClose={() => setIsPwaInfoOpen(false)}
      />
    </div>
  );
}

