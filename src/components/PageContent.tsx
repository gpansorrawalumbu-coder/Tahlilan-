import React, { useState } from 'react';
import { TahlilPage, ReaderSettings, CustomBookImages, PaperTheme } from '../types';
import { TAHLIL_PAGES } from '../data/tahlilData';
import { DigitalTasbih } from './DigitalTasbih';
import { IslamicFrame } from './IslamicFrame';
import { NuLogoOrnament } from './NuLogoOrnament';
import { FullscreenScanViewer } from './FullscreenScanViewer';
import { ZoomIn, ZoomOut, RotateCcw, Image as ImageIcon, Sparkles, ChevronLeft, ChevronRight, Maximize2, X, Upload } from 'lucide-react';

interface PageContentProps {
  pageIndex: number; // 0 = Cover, 1-15 = Pages
  pageData?: TahlilPage;
  settings: ReaderSettings;
  customImages?: CustomBookImages;
  onOpenUpload?: () => void;
  onPageChange?: (page: number) => void;
  onOpenFullscreen?: () => void;
}

export const PageContent: React.FC<PageContentProps> = ({
  pageIndex,
  pageData,
  settings,
  customImages,
  onOpenUpload,
  onPageChange,
  onOpenFullscreen,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleModalTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const handleModalTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    const maxPages = isScanModeActive ? 8 : 15;

    if (diff > 50 && pageIndex < maxPages && onPageChange) {
      // Swiped left -> Next page
      onPageChange(pageIndex + 1);
    } else if (diff < -50 && pageIndex > 0 && onPageChange) {
      // Swiped right -> Previous page
      onPageChange(pageIndex - 1);
    }
    setTouchStartX(null);
  };

  const getThemeClasses = (theme: PaperTheme) => {
    switch (theme) {
      case 'cream':
        return {
          bg: 'bg-paper-cream',
          border: 'border-amber-800/30',
          arabicText: 'text-[#2b1803]',
          latinText: 'text-amber-950/80',
          translationText: 'text-amber-900/70',
          cardBg: 'bg-[#f4e8c1]/90 shadow-sm border-amber-800/20',
          headerBg: 'bg-[#ebd4a0]/80 border-amber-900/30 text-[#2b1803]',
          accent: 'text-amber-900',
        };
      case 'white':
        return {
          bg: 'bg-paper-white',
          border: 'border-slate-300',
          arabicText: 'text-slate-900',
          latinText: 'text-slate-700',
          translationText: 'text-slate-600',
          cardBg: 'bg-slate-50 border-slate-200 shadow-sm',
          headerBg: 'bg-slate-100 border-slate-300 text-slate-900',
          accent: 'text-emerald-800',
        };
      case 'emerald':
        return {
          bg: 'bg-paper-emerald',
          border: 'border-emerald-600/40',
          arabicText: 'text-amber-200',
          latinText: 'text-emerald-100/90',
          translationText: 'text-emerald-200/80',
          cardBg: 'bg-emerald-950/80 border-emerald-700/50 shadow-inner',
          headerBg: 'bg-emerald-900/90 border-emerald-600/60 text-amber-200',
          accent: 'text-amber-400',
        };
      case 'dark':
      default:
        return {
          bg: 'bg-slate-950',
          border: 'border-amber-500/20',
          arabicText: 'text-amber-100',
          latinText: 'text-slate-300',
          translationText: 'text-slate-400',
          cardBg: 'bg-slate-900/90 border-slate-800 shadow-inner',
          headerBg: 'bg-slate-900 border-slate-800 text-amber-300',
          accent: 'text-amber-400',
        };
    }
  };

  const themeStyles = getThemeClasses(settings.paperTheme);

  const getFontSizeClass = (size: ReaderSettings['fontSize']) => {
    switch (size) {
      case 'sm':
        return 'text-xl leading-[2.2]';
      case 'md':
        return 'text-2xl leading-[2.4]';
      case 'lg':
        return 'text-3xl leading-[2.6]';
      case 'xl':
        return 'text-4xl leading-[2.8]';
      default:
        return 'text-2xl leading-[2.4]';
    }
  };

  // SCAN MODE CHECK:
  // Mode Scan Foto Asli is active and applies to Cover (0) and Pages 1 through 8.
  const isScanModeActive = settings.viewMode === 'image';
  const isScanPageEligible = pageIndex >= 0 && pageIndex <= 8;

  const pageImageKey = (pageIndex === 0 ? 'cover' : `page${pageIndex}`) as keyof CustomBookImages;
  const customPageImage = customImages?.[pageImageKey];

  // Eastern Arabic numerals for classic page numbers
  const easternArabicNumerals: { [key: number]: string } = {
    1: '١',
    2: '٢',
    3: '٣',
    4: '٤',
    5: '٥',
    6: '٦',
    7: '٧',
    8: '٨',
  };

  // Marginal annotations (Hasyiyah / Makna Gandul notes in classic red/sepia ink)
  const marginalAnnotations: { [key: number]: string } = {
    1: 'فَضِيْلَةُ الفَاتِحَةِ وَحَضْرَةِ النَّبِيِّ وَالصَّالِحِينَ',
    2: 'سُورَةُ الإِخْلَاصِ مَعَ التَّهْلِيلِ وَالتَّكْبِيرِ',
    3: 'المُعَوِّذَتَيْنِ - الأَعُوذُ بِاللهِ مِنَ الشُّرُورِ',
    4: 'فَاتِحَةُ الكِتَابِ وَأَوَائِلُ سُورَةِ البَقَرَةِ',
    5: 'آيَةُ الكُرْسِيِّ وَخَوَاتِيمُ سُورَةِ البَقَرَةِ',
    6: 'الاسْتِغْفَارُ وَالصَّلَوَاتُ الشَّرِيفَةُ المُنْجِيَةُ',
    7: 'كَلِمَةُ التَّوْحِيدِ وَالأَذْكارُ الْمُبَارَكَةُ',
    8: 'الدُّعَاءُ الْمَأْثُورُ لِلأَمْوَاتِ وَالأَقَارِبِ',
  };

  // =========================================================================
  // RENDER: SCAN MODE UI (Cover & Pages 1 - 8)
  // =========================================================================
  if (isScanModeActive && isScanPageEligible) {
    const pageTitle = pageIndex === 0 ? 'Cover Depan Kitab' : `Halaman ${pageIndex}: ${pageData?.title || 'Isi Kitab'}`;
    const pageSub = pageIndex === 0 ? 'Sampul Tahlil Lirboyo Ringkasan' : pageData?.category || 'Bacaan Tahlil';

    return (
      <div className="w-full min-h-[580px] rounded-3xl flex flex-col justify-between border-4 border-amber-900/70 shadow-2xl relative overflow-hidden transition-all bg-gradient-to-b from-[#fdf8ec] via-[#f7ebd0] to-[#eaddbc] text-[#241203] select-none">
        {/* Vintage Antique Corner Filigree Ornaments */}
        <div className="absolute top-2 left-2 text-amber-900/50 font-arabic text-2xl select-none z-10 pointer-events-none">
          ꧁
        </div>
        <div className="absolute top-2 right-2 text-amber-900/50 font-arabic text-2xl select-none z-10 pointer-events-none">
          ꧂
        </div>
        <div className="absolute bottom-2 left-2 text-amber-900/50 font-arabic text-2xl select-none z-10 pointer-events-none">
          ꧁
        </div>
        <div className="absolute bottom-2 right-2 text-amber-900/50 font-arabic text-2xl select-none z-10 pointer-events-none">
          ꧂
        </div>

        {/* Outer Vintage Paper Frame */}
        <div className="p-3 sm:p-5 flex flex-col justify-between h-full min-h-[580px] relative z-0">
          
          {/* Header Banner Badge */}
          <div className="bg-[#e9d6a7] border-2 border-amber-900/50 rounded-2xl px-3.5 py-2 flex items-center justify-between shadow-md mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-700 animate-pulse"></span>
              <div>
                <span className="font-display font-extrabold text-xs uppercase tracking-wider text-amber-950 block">
                  📜 KLASIK SCAN KITAB — {pageIndex === 0 ? 'COVER' : `HALAMAN ${pageIndex} / 8 (${easternArabicNumerals[pageIndex]})`}
                </span>
                <span className="text-[10px] text-amber-900 font-bold block">
                  {pageSub}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold bg-amber-900/20 text-amber-950 px-2 py-0.5 rounded-lg border border-amber-800/30">
                Hal. {pageIndex} / 8
              </span>
            </div>
          </div>

          {/* MAIN PHOTO FRAME OR MANUSCRIPT DISPLAY */}
          {customPageImage ? (
            <div className="flex-1 flex flex-col items-center justify-center relative my-2 min-h-[420px] bg-[#eadebf]/50 rounded-2xl p-2 border border-amber-900/30 shadow-inner overflow-hidden">
              <div className="relative group max-h-[540px] flex items-center justify-center cursor-pointer" onClick={() => (onOpenFullscreen ? onOpenFullscreen() : setIsFullscreenModalOpen(true))}>
                <img
                  src={customPageImage}
                  alt={`Foto Scan Kitab ${pageTitle}`}
                  className="max-h-[520px] w-auto object-contain rounded-xl shadow-2xl border-2 border-amber-800/60 transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel})` }}
                />

                {/* Lightbox Trigger Overlay Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenFullscreen) onOpenFullscreen();
                    else setIsFullscreenModalOpen(true);
                  }}
                  className="absolute top-3 right-3 bg-amber-950/80 hover:bg-amber-900 text-amber-200 p-2 rounded-xl backdrop-blur-md border border-amber-400/50 shadow-lg flex items-center gap-1 text-xs font-bold transition-all opacity-90 group-hover:opacity-100"
                  title="Tampilkan Layar Penuh"
                >
                  <Maximize2 className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Layar Penuh</span>
                </button>
              </div>

              {/* Floating Toolbar Controls */}
              <div className="mt-3 bg-amber-950/90 text-amber-100 backdrop-blur-md rounded-2xl p-1.5 flex items-center gap-2 border border-amber-500/50 shadow-xl text-xs z-10">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                  className="p-1.5 hover:bg-amber-800 rounded-xl transition-colors flex items-center gap-1 font-bold text-[11px]"
                  title="Perbesar"
                >
                  <ZoomIn className="w-4 h-4 text-amber-400" /> +
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
                  className="p-1.5 hover:bg-amber-800 rounded-xl transition-colors flex items-center gap-1 font-bold text-[11px]"
                  title="Perkecil"
                >
                  <ZoomOut className="w-4 h-4 text-amber-400" /> -
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 hover:bg-amber-800 rounded-xl transition-colors text-amber-300"
                  title="Reset Ukuran"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-amber-700/60 my-auto mx-0.5" />
                <button
                  onClick={onOpenUpload}
                  className="p-1.5 hover:bg-amber-800 rounded-xl transition-colors text-amber-300 font-bold flex items-center gap-1 text-[11px]"
                  title="Ganti Foto Scan Halaman Ini"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" /> Ganti
                </button>
              </div>
            </div>
          ) : (
            /* MANUSCRIPT / PARCHMENT PLACEHOLDER FOR UNUPLOADED PAGES */
            <div className="flex-1 flex flex-col justify-between my-1 bg-[#f4e6c2] rounded-2xl p-3 sm:p-5 border-2 border-amber-900/40 shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <NuLogoOrnament size="lg" showLabel={false} />
              </div>

              <div
                className="flex-1 flex flex-col justify-between transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
              >
                {pageIndex === 0 ? (
                  <div className="flex flex-col items-center justify-between text-center py-4 my-auto space-y-4">
                    <div className="w-full max-w-md mx-auto py-2 px-4 rounded-xl bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-amber-200 border border-amber-400/50 shadow-md">
                      <p className="font-arabic text-2xl font-bold text-amber-100">
                        بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ
                      </p>
                    </div>

                    <div className="my-2">
                      <NuLogoOrnament size="md" showLabel={false} className="animate-subtle-float" />
                    </div>

                    <div className="space-y-2 max-w-lg">
                      <span className="inline-block px-3 py-0.5 rounded-full bg-amber-900/20 text-amber-950 font-bold text-[10px] uppercase tracking-widest border border-amber-800/30">
                        📜 MANUSKRIP KITAB SAKU
                      </span>

                      <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-amber-950 tracking-tight leading-tight">
                        TAHLIL LIRBOYO RINGKAS
                      </h1>

                      <p className="text-xl sm:text-2xl font-arabic font-bold text-amber-900 dir-rtl">
                        رَنْغْكَاسَنْ الأُسْتَاذُ مُحَمَّدُ قَسِيْمْ
                      </p>

                      <p className="text-xs font-semibold text-amber-900/80 italic">
                        Versi Ringkasan Ustadz Muhammad Qosyim • Lirboyo Kediri
                      </p>
                    </div>

                    <button
                      onClick={onOpenUpload}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-100 font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-xl border border-amber-400/50 transition-all transform active:scale-95"
                    >
                      <ImageIcon className="w-4 h-4 text-amber-300" /> Upload Foto Scan Cover Depan
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between h-full space-y-3">
                    <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-900 via-[#5c2b07] to-amber-900 text-amber-100 border border-amber-400/60 shadow-md flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-[10px] font-extrabold uppercase text-amber-300 block">
                          {pageData?.category}
                        </span>
                        <span className="text-xs font-bold text-amber-100 block">
                          {pageData?.title}
                        </span>
                      </div>

                      <div className="text-right flex items-center gap-2">
                        <span className="text-2xl font-arabic font-extrabold text-amber-300">
                          {easternArabicNumerals[pageIndex]}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#ebd9b0] border-l-4 border-amber-800 rounded-r-xl px-3 py-1.5 text-xs text-amber-950 flex items-center justify-between font-arabic dir-rtl shadow-sm">
                      <span className="text-amber-900 text-[11px] font-bold font-sans">
                        📌 Hasyiyah Catatan Kitab:
                      </span>
                      <span className="font-bold text-amber-950 text-xs sm:text-sm">
                        {marginalAnnotations[pageIndex] || ''}
                      </span>
                    </div>

                    <div className="flex-1 p-3 sm:p-4 rounded-xl bg-[#f7eed2] border border-amber-900/30 shadow-inner flex flex-col justify-center space-y-3">
                      {(pageIndex === 1 || pageIndex === 2 || pageIndex === 3 || pageIndex === 4) && (
                        <div className="text-center my-1 py-1 px-3 rounded-lg bg-amber-900/10 border border-amber-800/20">
                          <p className="font-arabic text-xl font-bold text-amber-950">
                            بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ
                          </p>
                        </div>
                      )}

                      <div className="text-right font-arabic dir-rtl">
                        <p className="text-2xl sm:text-3xl leading-[2.5] text-[#241203] font-bold tracking-wide select-text whitespace-pre-line">
                          {pageData?.arabicText}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-amber-900/30 flex items-center justify-between text-[11px] text-amber-900 font-bold">
                      <button
                        onClick={onOpenUpload}
                        className="px-3 py-1.5 bg-amber-900 hover:bg-amber-800 text-amber-200 rounded-xl flex items-center gap-1.5 font-bold text-[11px] border border-amber-500/40 shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-400" /> Upload Foto Scan Hal. {pageIndex}
                      </button>
                      <span className="text-[10px] text-amber-800 font-medium">
                        Geser 👈 👉 untuk membalik lembaran
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Bar */}
          <div className="pt-2 border-t border-amber-900/30 flex items-center justify-between text-[11px] font-bold text-amber-950">
            <span className="flex items-center gap-1">
              <span>📜 Mode Scan Foto (Halaman {pageIndex} / 8)</span>
            </span>
            <button
              onClick={onOpenUpload}
              className="text-amber-900 hover:text-amber-950 underline flex items-center gap-1 text-[10px]"
            >
              <Upload className="w-3 h-3 text-amber-700" /> Upload Foto Scan
            </button>
          </div>
        </div>

        {/* FULLSCREEN LIGHTBOX VIEWER */}
        <FullscreenScanViewer
          isOpen={isFullscreenModalOpen}
          onClose={() => setIsFullscreenModalOpen(false)}
          currentPage={pageIndex}
          maxPages={isScanModeActive ? 8 : 15}
          customImages={customImages || {}}
          pageData={pageData}
          onPageChange={(p) => onPageChange && onPageChange(p)}
          onOpenUpload={onOpenUpload}
        />
      </div>
    );
  }

  // =========================================================================
  // RENDER: SCAN MODE ACTIVE BUT PAGE > 8 NOTICE
  // =========================================================================
  if (isScanModeActive && pageIndex > 8) {
    return (
      <div className={`w-full min-h-[540px] rounded-3xl flex flex-col justify-between border-2 shadow-2xl relative transition-all overflow-hidden ${themeStyles.bg} ${themeStyles.border}`}>
        <IslamicFrame theme={settings.paperTheme === 'emerald' || settings.paperTheme === 'dark' ? 'dark' : 'cream'}>
          <div className="flex flex-col items-center justify-center text-center p-6 my-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/40 shadow-xl">
              <ImageIcon className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="font-display font-extrabold text-amber-900 dark:text-amber-200 text-lg">
                Mode Scan Foto Asli (Cover & Hal. 1 - 8)
              </h3>
              <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                Mode Tampilan Scan Foto Asli dirancang khusus untuk <strong>Cover Depan dan Halaman 1 sampai 8</strong>. Halaman {pageIndex} saat ini ditampilkan secara otomatis dalam <strong>Mode Teks Digital</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left w-full max-w-sm space-y-1 text-xs">
              <p className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Halaman {pageIndex}: {pageData?.title}
              </p>
              <p className="text-amber-800 dark:text-amber-300">
                {pageData?.subtitle || 'Bacaan Tahlil / Doa'}
              </p>
            </div>
          </div>
        </IslamicFrame>
      </div>
    );
  }

  // =========================================================================
  // RENDER: DIGITAL TEXT MODE FOR COVER (Page Index 0)
  // =========================================================================
  if (pageIndex === 0) {
    return (
      <div className={`w-full min-h-[540px] rounded-3xl flex flex-col justify-between border-2 shadow-2xl relative overflow-hidden transition-all ${themeStyles.bg} ${themeStyles.border}`}>
        <IslamicFrame theme={settings.paperTheme === 'emerald' || settings.paperTheme === 'dark' ? 'dark' : 'cream'}>
          <div className="w-full h-full min-h-[460px] flex flex-col items-center justify-between text-center py-4 px-2">
            {/* Top Tagline */}
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-900 dark:text-amber-200 rounded-full text-[11px] font-bold tracking-widest uppercase border border-amber-500/40 shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-500" /> BUKU SAKU DIGITAL
              </span>
            </div>

            {/* Central Seal & Title */}
            <div className="my-auto space-y-4 max-w-md">
              <NuLogoOrnament size="lg" showLabel={false} className="animate-subtle-float" />

              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-amber-950 dark:text-amber-200 drop-shadow-sm">
                  TAHLIL LIRBOYO RINGKAS
                </h1>

                <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto my-2" />

                <p className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                  VERSI RINGKASAN
                </p>

                <p className="text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-400 italic">
                  Ustadz Muhammad Qosyim
                </p>
              </div>

              {/* Calligraphic Arabic Title Block */}
              <div className="pt-3 pb-2 px-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <p className="text-2xl sm:text-3xl font-arabic font-bold text-amber-900 dark:text-amber-200 leading-snug drop-shadow-sm">
                  تَهْلِيْل لِرْبَوْيُ - مُخْتَصَر
                </p>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 font-medium mt-1">
                  Pondok Pesantren Lirboyo Kediri
                </p>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="w-full pt-3 border-t border-amber-700/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-semibold">
                <span>Geser ke kanan untuk membaca</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
              </div>
              <span className="text-emerald-800 dark:text-emerald-300 font-bold">
                Pondok Pesantren Lirboyo
              </span>
            </div>
          </div>
        </IslamicFrame>
      </div>
    );
  }

  // =========================================================================
  // RENDER: DIGITAL TEXT MODE FOR PAGES 1 TO 15
  // =========================================================================
  if (!pageData) return null;

  // Parse paragraphs by \n\n
  const arabicParas = pageData.arabicText
    ? pageData.arabicText.split('\n\n').map(s => s.trim()).filter(Boolean)
    : [];
  const latinParas = pageData.latinText
    ? pageData.latinText.split('\n\n').map(s => s.trim()).filter(Boolean)
    : [];
  const translationParas = pageData.translationText
    ? pageData.translationText.split('\n\n').map(s => s.trim()).filter(Boolean)
    : [];

  const totalPages = TAHLIL_PAGES.length;

  return (
    <div className={`w-full min-h-[540px] rounded-3xl flex flex-col justify-between border-2 shadow-2xl relative transition-all overflow-hidden ${themeStyles.bg} ${themeStyles.border}`}>
      <IslamicFrame theme={settings.paperTheme === 'emerald' || settings.paperTheme === 'dark' ? 'dark' : 'cream'}>
        <div className="flex flex-col h-full justify-between space-y-4">
          {/* Header Bar Page Indicator */}
          <div className={`px-3.5 py-2 rounded-2xl border flex items-center justify-between text-xs font-bold ${themeStyles.headerBg}`}>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span className="font-display tracking-tight text-amber-900 dark:text-amber-200">
                {pageData.category}
              </span>
            </span>
            <span className="font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/30">
              Hal. {pageIndex} / {totalPages}
            </span>
          </div>

          {/* VIEW MODE: DIGITAL ARABIC TEXT */}
          <div className="flex-1 space-y-4 my-1">
            {/* Subtitle / Context Note */}
            {pageData.subtitle && (
              <div className="flex items-center gap-2 text-xs font-semibold italic border-b border-amber-500/20 pb-2 text-amber-800 dark:text-amber-300">
                <span className="text-amber-500">۞</span>
                <span>{pageData.subtitle}</span>
              </div>
            )}

            {/* Render Paragraph Cards */}
            {arabicParas.map((aPara, idx) => {
              const lPara = latinParas[idx] || '';
              const tPara = translationParas[idx] || '';

              return (
                <div
                  key={idx}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all relative overflow-hidden shadow-sm space-y-3 ${themeStyles.cardBg}`}
                >
                  {/* Paragraph Badge Header if multiple paragraphs exist */}
                  {arabicParas.length > 1 && (
                    <div className="flex items-center justify-between text-[11px] font-bold border-b border-amber-500/15 pb-2 text-amber-800 dark:text-amber-300">
                      <span className="flex items-center gap-1.5 font-display tracking-wide uppercase">
                        <span className="text-amber-500 font-arabic text-sm">۞</span> Bait / Paragraf {idx + 1}
                      </span>
                      <span className="font-mono text-[10px] text-amber-700/60 dark:text-amber-300/60">
                        {idx + 1} dari {arabicParas.length}
                      </span>
                    </div>
                  )}

                  {/* Arabic Text */}
                  <div className="text-right font-arabic dir-rtl">
                    <p className={`${getFontSizeClass(settings.fontSize)} ${themeStyles.arabicText} tracking-wide leading-[2.3] select-text whitespace-pre-line`}>
                      {aPara}
                    </p>
                  </div>

                  {/* Digital Tasbih integrated into specific pages */}
                  {(pageIndex === 9 || pageIndex === 10) && idx === 0 && (
                    <div className="my-2">
                      <DigitalTasbih target={33} />
                    </div>
                  )}

                  {/* Latin Transliteration for this paragraph */}
                  {settings.showLatin && lPara && (
                    <div className="pt-2.5 border-t border-amber-500/20 text-left dir-ltr">
                      <p className="font-bold text-amber-800 dark:text-amber-300 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Transliterasi Latin:
                      </p>
                      <p className={`italic leading-relaxed ${themeStyles.latinText} whitespace-pre-line text-xs sm:text-sm`}>
                        {lPara}
                      </p>
                    </div>
                  )}

                  {/* Indonesian Translation for this paragraph */}
                  {settings.showTranslation && tPara && (
                    <div className="pt-2.5 border-t border-emerald-500/20 text-left dir-ltr">
                      <p className="font-bold text-emerald-800 dark:text-emerald-300 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Terjemahan / Panduan:
                      </p>
                      <p className={`leading-relaxed ${themeStyles.translationText} whitespace-pre-line text-xs sm:text-sm`}>
                        {tPara}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Page Footer */}
          <div className="pt-3 border-t border-amber-700/20 flex items-center justify-between text-[11px]">
            <span className={`font-display font-bold ${themeStyles.accent}`}>
              {pageData.title}
            </span>
            <span className="text-amber-700/80 dark:text-amber-400/80 font-medium">
              Ringkasan Ustadz Muhammad Qosyim
            </span>
          </div>
        </div>
      </IslamicFrame>
    </div>
  );
};


