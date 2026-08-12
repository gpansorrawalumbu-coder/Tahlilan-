import React, { useState, useEffect } from 'react';
import { CustomBookImages, TahlilPage } from '../types';
import { TAHLIL_PAGES } from '../data/tahlilData';
import { ChevronLeft, ChevronRight, X, Upload, Camera } from 'lucide-react';

interface FullscreenScanViewerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  maxPages: number;
  customImages: CustomBookImages;
  pageData?: TahlilPage;
  onPageChange: (page: number) => void;
  onOpenUpload?: () => void;
}

export const FullscreenScanViewer: React.FC<FullscreenScanViewerProps> = ({
  isOpen,
  onClose,
  currentPage,
  maxPages,
  customImages,
  pageData,
  onPageChange,
  onOpenUpload,
}) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [mouseDownX, setMouseDownX] = useState<number | null>(null);

  // Keyboard navigation support (Left/Right arrow keys & Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        if (currentPage < maxPages) {
          onPageChange(currentPage + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentPage > 0) {
          onPageChange(currentPage - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPage, maxPages, onPageChange, onClose]);

  if (!isOpen) return null;

  const pageImageKey = (currentPage === 0 ? 'cover' : `page${currentPage}`) as keyof CustomBookImages;
  const currentImg = customImages[pageImageKey];
  const pageTitle = currentPage === 0 ? 'Cover Depan Kitab' : `Hal. ${currentPage}: ${pageData?.title || 'Isi Kitab'}`;

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 40 && currentPage < maxPages) {
      // Swiped left -> Next page
      onPageChange(currentPage + 1);
    } else if (diff < -40 && currentPage > 0) {
      // Swiped right -> Prev page
      onPageChange(currentPage - 1);
    }
    setTouchStartX(null);
  };

  // Mouse Drag Handlers for Desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseDownX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseDownX === null) return;
    const diff = mouseDownX - e.clientX;

    if (diff > 50 && currentPage < maxPages) {
      onPageChange(currentPage + 1);
    } else if (diff < -50 && currentPage > 0) {
      onPageChange(currentPage - 1);
    }
    setMouseDownX(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#070503]/96 backdrop-blur-2xl flex flex-col items-center justify-between p-2 sm:p-4 select-none overflow-hidden animate-fadeIn"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Sleek Minimalist Top Header Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between text-amber-100 z-30 pt-1 pb-2 border-b border-amber-500/20 px-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-extrabold rounded-full border border-amber-500/40 text-xs shadow-sm">
            {currentPage === 0 ? 'Cover Depan' : `Hal. ${currentPage} / ${maxPages}`}
          </span>
          <h2 className="text-xs sm:text-sm font-bold text-amber-200 line-clamp-1">
            {pageTitle}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {onOpenUpload && (
            <button
              onClick={onOpenUpload}
              className="px-2.5 py-1 bg-amber-900/60 hover:bg-amber-800 text-amber-200 rounded-xl border border-amber-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
              title="Upload Foto Halaman Ini"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Upload Foto</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 rounded-full border border-amber-400/40 transition-colors shadow-lg"
            title="Tutup Layar Penuh (Esc)"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Floating Side Arrow Navigation Buttons */}
      {currentPage > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPageChange(currentPage - 1);
          }}
          className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-amber-500 text-amber-200 hover:text-amber-950 border border-amber-500/40 hover:border-amber-300 backdrop-blur-md shadow-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
          title="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 font-extrabold" />
        </button>
      )}

      {currentPage < maxPages && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPageChange(currentPage + 1);
          }}
          className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-amber-500 text-amber-200 hover:text-amber-950 border border-amber-500/40 hover:border-amber-300 backdrop-blur-md shadow-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
          title="Halaman Selanjutnya"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 font-extrabold" />
        </button>
      )}

      {/* Main Image Viewport Area — Maximized Height & Width */}
      <div className="flex-1 w-full max-w-6xl flex items-center justify-center p-1 sm:p-2 my-1 overflow-hidden relative cursor-grab active:cursor-grabbing">
        {currentImg ? (
          <div className="flex flex-col items-center justify-center h-full max-h-[85vh] w-full">
            <img
              src={currentImg}
              alt={`Scan Fullscreen ${pageTitle}`}
              className="max-h-[84vh] w-auto h-full object-contain rounded-2xl shadow-2xl border border-amber-500/30 transition-transform duration-200 select-none"
            />
          </div>
        ) : (
          /* Manuscript Display for pages without uploaded custom scan photos */
          <div className="max-w-2xl w-full bg-[#f6edda] text-[#241203] rounded-3xl p-5 sm:p-8 border-2 border-amber-600/60 shadow-2xl overflow-y-auto max-h-[82vh] space-y-4">
            <div className="text-center border-b border-amber-800/40 pb-3">
              <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">
                MANUSKRIP SCAN KLASIK
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-display text-amber-950 mt-0.5">
                {currentPage === 0 ? 'Cover Depan Tahlil Lirboyo' : pageTitle}
              </h3>
            </div>

            <div className="text-right font-arabic dir-rtl p-4 sm:p-6 rounded-2xl bg-[#eee2c6] border border-amber-900/30 shadow-inner">
              <p className="text-2xl sm:text-3xl leading-[2.6] font-bold text-[#1a0c02] whitespace-pre-line">
                {currentPage === 0
                  ? 'تَهْلِيْل لِرْبَوْيُ - مُخْتَصَر \n رَنْغْكَاسَنْ الأُسْتَاذُ مُحَمَّدُ قَسِيْمْ'
                  : pageData?.arabicText}
              </p>
            </div>

            {onOpenUpload && (
              <div className="text-center pt-2">
                <button
                  onClick={onOpenUpload}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-amber-100 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-md transition-all"
                >
                  <Camera className="w-4 h-4 text-amber-300" /> Upload Foto Scan Asli Halaman Ini
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Minimalist Bottom Gesture Cue Bar */}
      <div className="z-30 pt-1 pb-1">
        <div className="bg-black/60 backdrop-blur-md border border-amber-500/30 px-4 py-1 rounded-full text-[11px] text-amber-300/90 font-medium flex items-center gap-2 shadow-lg">
          <span>👈 Geser Layar / Klik Panah untuk Berpindah Halaman 👉</span>
        </div>
      </div>
    </div>
  );
};
