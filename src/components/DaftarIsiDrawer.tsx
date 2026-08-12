import React, { useState } from 'react';
import { TAHLIL_PAGES } from '../data/tahlilData';
import { BookOpen, Search, Bookmark, ChevronRight, X, Sparkles } from 'lucide-react';

interface DaftarIsiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number; // 0 = Cover, 1-8 = Pages
  onSelectPage: (pageIndex: number) => void;
  bookmarks: number[];
  onToggleBookmark: (pageIndex: number) => void;
  onOpenYasin?: () => void;
}

export const DaftarIsiDrawer: React.FC<DaftarIsiDrawerProps> = ({
  isOpen,
  onClose,
  currentPage,
  onSelectPage,
  bookmarks,
  onToggleBookmark,
  onOpenYasin,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredPages = TAHLIL_PAGES.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subtitle?.toLowerCase().includes(search.toLowerCase()) ||
      p.arabicText?.includes(search) ||
      p.latinText?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-md bg-emerald-950/95 text-emerald-100 h-full flex flex-col shadow-2xl border-l border-amber-500/30 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-emerald-800/80 flex items-center justify-between bg-emerald-900/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold gold-text-gradient font-display text-base">Daftar Isi Buku Saku</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white rounded-xl hover:bg-emerald-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 bg-emerald-900/40 border-b border-emerald-800/60">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-amber-400" />
            <input
              type="text"
              placeholder="Cari bacaan, fatihah, doa arwah..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-emerald-950/90 text-emerald-100 text-xs rounded-xl pl-9 pr-3 py-2 border border-emerald-700/80 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </div>

        {/* Page List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {/* Surah Yasin Lengkap Button Banner */}
          {onOpenYasin && (
            <div
              onClick={() => {
                onClose();
                onOpenYasin();
              }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/30 via-emerald-900/60 to-amber-500/20 border border-amber-400/80 cursor-pointer hover:border-amber-300 transition-all shadow-lg flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-emerald-950 flex items-center justify-center font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
                  ✨
                </div>
                <div>
                  <p className="font-extrabold text-sm gold-text-gradient font-display flex items-center gap-1.5">
                    Surat Yasin Lengkap
                  </p>
                  <p className="text-[11px] text-amber-200/90 font-medium">
                    83 Ayat • Arab, Latin & Terjemahan
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </div>
          )}

          {/* Cover item */}
          <div
            onClick={() => {
              onSelectPage(0);
              onClose();
            }}
            className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
              currentPage === 0
                ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                : 'bg-emerald-900/40 border-emerald-800/80 hover:bg-emerald-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 flex items-center justify-center font-bold text-sm shadow-md">
                📖
              </div>
              <div>
                <p className="font-bold text-xs text-amber-200 font-display">Cover Depan Buku Saku</p>
                <p className="text-[10px] text-emerald-300">Sampul Tahlil Lirboyo Ringkasan Qosyim</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </div>

          <div className="my-2 border-t border-emerald-800/60 flex items-center justify-between px-1 pt-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
              15 Halaman Isi Utama:
            </span>
            <span className="text-[10px] text-emerald-400">
              {filteredPages.length} Halaman Ditemukan
            </span>
          </div>

          {filteredPages.map((page) => {
            const isCurrent = currentPage === page.id;
            const isBookmarked = bookmarks.includes(page.id);

            return (
              <div
                key={page.id}
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-lg'
                    : 'bg-emerald-900/30 border-emerald-800/60 hover:bg-emerald-800/50'
                }`}
              >
                <div
                  onClick={() => {
                    onSelectPage(page.id);
                    onClose();
                  }}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                      isCurrent
                        ? 'bg-amber-400 text-emerald-950 font-extrabold'
                        : 'bg-emerald-800 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {page.id}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-emerald-100 truncate font-display">
                      {page.title}
                    </p>
                    <p className="text-[10px] text-emerald-300/80 truncate">{page.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(page.id);
                    }}
                    className={`p-1.5 rounded-xl transition-colors ${
                      isBookmarked
                        ? 'text-amber-400 bg-amber-400/20 border border-amber-400/40'
                        : 'text-emerald-500 hover:text-emerald-300'
                    }`}
                    title={isBookmarked ? 'Hapus Penanda' : 'Tandai Halaman Ini'}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                  <ChevronRight
                    onClick={() => {
                      onSelectPage(page.id);
                      onClose();
                    }}
                    className="w-4 h-4 text-emerald-400"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-emerald-900/80 border-t border-emerald-800/80 text-[11px] text-emerald-300 text-center flex items-center justify-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Versi Ringkasan Ustadz Muhammad Qosyim Lirboyo</span>
        </div>
      </div>
    </div>
  );
};

