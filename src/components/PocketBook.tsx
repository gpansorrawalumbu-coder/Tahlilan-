import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TAHLIL_PAGES } from '../data/tahlilData';
import { ReaderSettings, CustomBookImages } from '../types';
import { PageContent } from './PageContent';
import { FullscreenScanViewer } from './FullscreenScanViewer';
import { getHijriDate, getJavaneseDate } from '../utils/javaneseHijri';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Settings as SettingsIcon,
  Upload,
  Bookmark,
  Smartphone,
  Sparkles,
  Volume2,
  Clock,
  Compass,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface PocketBookProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  settings: ReaderSettings;
  customImages?: CustomBookImages;
  bookmarks: number[];
  onToggleBookmark: (page: number) => void;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
  onOpenDrawer: () => void;
  onOpenSettings: () => void;
  onOpenUpload?: () => void;
  onOpenPwaInfo: () => void;
  onOpenPrayerTimes: () => void;
  onOpenCompass: () => void;
  onOpenYasin?: () => void;
}

export const PocketBook: React.FC<PocketBookProps> = ({
  currentPage,
  onPageChange,
  settings,
  customImages,
  bookmarks,
  onToggleBookmark,
  isFocusMode,
  onToggleFocusMode,
  onOpenDrawer,
  onOpenSettings,
  onOpenUpload,
  onOpenPwaInfo,
  onOpenPrayerTimes,
  onOpenCompass,
  onOpenYasin,
}) => {
  const [direction, setDirection] = useState<number>(0);
  const [isFullscreenScanOpen, setIsFullscreenScanOpen] = useState<boolean>(false);
  const totalPages = TAHLIL_PAGES.length; // 15 pages + 1 cover (0)

  const maxPageForMode = settings.viewMode === 'image' ? 8 : totalPages;

  const goToPrev = () => {
    if (currentPage > 0) {
      playFlipSound();
      setDirection(-1);
      onPageChange(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < maxPageForMode) {
      playFlipSound();
      setDirection(1);
      onPageChange(currentPage + 1);
    }
  };

  // Swipe & Drag Gesture Handler using Framer Motion
  const handleDragEnd = (_: unknown, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
    const swipeThreshold = 50;
    const velocityThreshold = 250;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      goToNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      goToPrev();
    }
  };

  const playFlipSound = () => {
    if (!settings.soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // ignore
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, settings.soundEnabled, settings.viewMode]);

  const currentPageData = currentPage > 0 ? TAHLIL_PAGES[currentPage - 1] : undefined;
  const isBookmarked = bookmarks.includes(currentPage);

  // 3D Realistic Book Leaf Turn Animation
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.94,
      rotateY: dir > 0 ? 40 : -40,
      transformOrigin: dir > 0 ? 'right center' : 'left center',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transformOrigin: 'center center',
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.94,
      rotateY: dir < 0 ? -40 : 40,
      transformOrigin: dir < 0 ? 'left center' : 'right center',
    }),
  };

  const todayDate = new Date();
  const todayHijri = getHijriDate(todayDate);
  const todayJawa = getJavaneseDate(todayDate);

  return (
    <div className="w-full max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto flex flex-col items-center relative">
      {/* Top Header Live JWS & Kalender Jawa Banner */}
      <div
        onClick={onOpenPrayerTimes}
        className="w-full bg-emerald-950/80 border border-amber-500/30 backdrop-blur-md rounded-2xl px-3 py-1.5 mb-2 flex items-center justify-between text-amber-200 text-xs shadow-md cursor-pointer hover:bg-emerald-900/80 transition-all group"
        title="Klik untuk membuka JWS Kemenag, Kalender Hijriyah & Jawa lengkap"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-amber-300">JWS Kemenag:</span>
          <span className="font-medium text-amber-100">
            {todayJawa.fullDayPasaran}, {todayHijri.formatted}
          </span>
        </div>

        <div className="hidden xs:flex items-center gap-2 text-[11px] text-emerald-300">
          <span className="bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30 font-semibold text-amber-300">
            Neptu {todayJawa.totalNeptu}
          </span>
          <span className="hidden sm:inline text-amber-400/90 font-medium">
            (Klik Detail Display Masjid)
          </span>
        </div>
      </div>

      {/* Top Pocket Book Toolbar */}
      <div className="w-full bg-emerald-950/90 border border-emerald-700/60 backdrop-blur-md rounded-2xl p-2 mb-3 flex flex-wrap items-center justify-between text-emerald-100 shadow-lg gap-1.5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/80 text-amber-200 text-xs font-semibold transition-all"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden xs:inline">Daftar Isi</span>
          </button>

          {onOpenYasin && (
            <button
              onClick={onOpenYasin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/30 via-emerald-800 to-amber-500/30 hover:from-amber-500/40 border border-amber-400/80 text-amber-200 text-xs font-extrabold shadow-md transition-all active:scale-95"
              title="Baca Surat Yasin Lengkap (83 Ayat)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Surat Yasin</span>
            </button>
          )}

          <button
            onClick={onOpenPrayerTimes}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-200 text-xs font-semibold transition-all"
            title="Jadwal Waktu Sholat & Kalender Jawa Kemenag"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">JWS & Jawa</span>
          </button>

          <button
            onClick={onOpenCompass}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-200 text-xs font-semibold transition-all"
            title="Kompas Arah Kiblat"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Kiblat</span>
          </button>

          <button
            onClick={() => onToggleBookmark(currentPage)}
            className={`p-1.5 rounded-xl border transition-all ${
              isBookmarked
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-emerald-900/40 border-emerald-800 text-emerald-400 hover:text-white'
            }`}
            title={isBookmarked ? 'Halaman Ditandai' : 'Tandai Halaman Ini'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Page counter pill */}
        <div className="flex items-center gap-1 text-xs font-mono bg-emerald-900/90 border border-emerald-700/60 px-2.5 py-1 rounded-xl text-amber-300 font-bold">
          <span>{currentPage === 0 ? 'Cover' : `Hal ${currentPage}`}</span>
          <span className="text-emerald-500">/</span>
          <span className="text-emerald-300">{maxPageForMode}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {onToggleFocusMode && (
            <button
              onClick={onToggleFocusMode}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-extrabold transition-all shadow-sm active:scale-95 ${
                isFocusMode
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 ring-2 ring-amber-300/60'
                  : 'bg-emerald-900/80 hover:bg-emerald-800 border-amber-500/50 text-amber-200'
              }`}
              title={isFocusMode ? 'Keluar Mode Fokus (Sembunyikan/Tampilkan Header & Footer)' : 'Mode Fokus (Sembunyikan Header & Footer agar Layar Bersih)'}
            >
              {isFocusMode ? (
                <Minimize2 className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span className="hidden xs:inline">{isFocusMode ? 'Keluar Fokus' : 'Mode Fokus'}</span>
            </button>
          )}

          {onOpenUpload && (
            <button
              onClick={onOpenUpload}
              className="p-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/80 text-amber-300 transition-all"
              title="Upload Foto Buku Saku Asli"
            >
              <Upload className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onOpenPwaInfo}
            className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-300 transition-all"
            title="Install di HP Android"
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/80 text-emerald-200 transition-all"
            title="Pengaturan"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Swipe & Navigation Instruction Cue */}
      <div className="w-full text-center text-[10px] text-amber-300/80 mb-1 font-medium flex items-center justify-center gap-1.5">
        <span>👈 Geser / Klik Panah Kiri (Sebelum)</span>
        <span className="text-emerald-500">•</span>
        <span>Geser / Klik Panah Kanan (Lanjut) 👉</span>
      </div>

      {/* Book Container with Flip Motion & Interactive Physics Swipe */}
      <div className="w-full relative min-h-[540px] perspective-1000 my-1 touch-pan-y overflow-visible rounded-3xl">
        {/* Floating Side Navigation Arrows for Wide Screens / Desktop */}
        {currentPage > 0 && (
          <button
            onClick={goToPrev}
            className="hidden md:flex absolute -left-5 lg:-left-7 top-1/2 -translate-y-1/2 z-30 p-3 rounded-2xl bg-emerald-950/90 hover:bg-amber-500 hover:text-emerald-950 text-amber-300 border-2 border-amber-400/80 shadow-2xl transition-all transform hover:scale-110 active:scale-95 items-center justify-center group"
            title="Halaman Sebelumnya (Klik / Geser Kiri)"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        {currentPage < maxPageForMode && (
          <button
            onClick={goToNext}
            className="hidden md:flex absolute -right-5 lg:-right-7 top-1/2 -translate-y-1/2 z-30 p-3 rounded-2xl bg-emerald-950/90 hover:bg-amber-500 hover:text-emerald-950 text-amber-300 border-2 border-amber-400/80 shadow-2xl transition-all transform hover:scale-110 active:scale-95 items-center justify-center group"
            title="Halaman Lanjut (Klik / Geser Kanan)"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={handleDragEnd}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 28,
              mass: 0.8,
            }}
            className="w-full cursor-grab active:cursor-grabbing overflow-hidden rounded-3xl"
          >
            <PageContent
              pageIndex={currentPage}
              pageData={currentPageData}
              settings={settings}
              customImages={customImages}
              onOpenUpload={onOpenUpload}
              onPageChange={onPageChange}
              onOpenFullscreen={() => setIsFullscreenScanOpen(true)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls & Pagination */}
      <div className="w-full bg-emerald-950/90 border border-emerald-700/60 backdrop-blur-md rounded-2xl p-3 mt-3 flex items-center justify-between text-emerald-100 shadow-xl">
        <button
          onClick={goToPrev}
          disabled={currentPage === 0}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
            currentPage === 0
              ? 'opacity-40 border-emerald-900 text-emerald-600 cursor-not-allowed'
              : 'bg-emerald-900/90 hover:bg-emerald-800 border-amber-500/40 text-amber-200 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        {/* Dots Pagination */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-[180px] px-2 py-1">
          {Array.from({ length: maxPageForMode + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentPage ? 1 : -1);
                onPageChange(idx);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentPage
                  ? 'w-6 bg-amber-400'
                  : 'w-2 bg-emerald-800 hover:bg-emerald-600'
              }`}
              title={idx === 0 ? 'Cover' : `Halaman ${idx}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          disabled={currentPage === maxPageForMode}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
            currentPage === maxPageForMode
              ? 'opacity-40 border-emerald-900 text-emerald-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 border-amber-400 shadow-md active:scale-95'
          }`}
        >
          <span>Lanjut</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Fullscreen Expanded Scan Viewer */}
      <FullscreenScanViewer
        isOpen={isFullscreenScanOpen}
        onClose={() => setIsFullscreenScanOpen(false)}
        currentPage={currentPage}
        maxPages={maxPageForMode}
        customImages={customImages || {}}
        pageData={currentPageData}
        onPageChange={onPageChange}
        onOpenUpload={onOpenUpload}
      />
    </div>
  );
};
