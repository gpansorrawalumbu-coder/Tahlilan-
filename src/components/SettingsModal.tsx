import React from 'react';
import { ReaderSettings, PaperTheme } from '../types';
import { Settings, Sliders, Type, Volume2, VolumeX, Eye, BookOpen, X, Download } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (settings: ReaderSettings) => void;
  onOpenUpload?: () => void;
  onOpenPwaInfo: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenUpload,
  onOpenPwaInfo,
}) => {
  if (!isOpen) return null;

  const themes: Array<{ id: PaperTheme; name: string; bg: string; border: string; text: string }> = [
    { id: 'cream', name: 'Kertas Kitab (Kuning/Cream)', bg: 'bg-[#FAF3DF]', border: 'border-amber-400', text: 'text-amber-950' },
    { id: 'white', name: 'Kertas Putih Bersih', bg: 'bg-white', border: 'border-gray-300', text: 'text-gray-900' },
    { id: 'emerald', name: 'Khas Lirboyo (Hijau)', bg: 'bg-[#0f382c]', border: 'border-emerald-500', text: 'text-emerald-100' },
    { id: 'dark', name: 'Mode Malam (Gelap)', bg: 'bg-gray-950', border: 'border-gray-700', text: 'text-gray-100' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-emerald-950 text-emerald-100 border border-emerald-700/60 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-emerald-800/80 flex items-center justify-between bg-emerald-900/60">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-amber-200 text-base">Pengaturan Buku Saku</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs text-emerald-100 overflow-y-auto max-h-[80vh]">
          {/* Mode Tampilan */}
          <div className="space-y-2">
            <label className="font-bold text-amber-300 flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> Mode Tampilan Buku
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings({ ...settings, viewMode: 'digital' })}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  settings.viewMode === 'digital'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                    : 'bg-emerald-900/40 border-emerald-800 hover:bg-emerald-800/40 text-emerald-300'
                }`}
              >
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>Teks Arab Jelas & Digital</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ ...settings, viewMode: 'image' })}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  settings.viewMode === 'image'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                    : 'bg-emerald-900/40 border-emerald-800 hover:bg-emerald-800/40 text-emerald-300'
                }`}
              >
                <Sliders className="w-5 h-5 text-amber-400" />
                <span>Gambar Scan Klasik (Cover & Hal 1-8)</span>
              </button>
            </div>
          </div>

          {/* Tema Kertas */}
          <div className="space-y-2">
            <label className="font-bold text-amber-300 flex items-center gap-1.5">
              🎨 Warna & Kertas Buku
            </label>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onUpdateSettings({ ...settings, paperTheme: t.id })}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                    settings.paperTheme === t.id
                      ? 'border-amber-400 ring-2 ring-amber-400/50 font-bold'
                      : 'border-emerald-800 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full ${t.bg} border ${t.border} shrink-0`} />
                  <span className="text-[11px] truncate text-emerald-100">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ukuran Font Arab */}
          <div className="space-y-2">
            <label className="font-bold text-amber-300 flex items-center gap-1.5">
              <Type className="w-4 h-4" /> Ukuran Tulisan Arab
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => onUpdateSettings({ ...settings, fontSize: sz })}
                  className={`py-2 rounded-xl border text-center font-semibold transition-all ${
                    settings.fontSize === sz
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                      : 'bg-emerald-900/30 border-emerald-800 text-emerald-300 hover:bg-emerald-800/40'
                  }`}
                >
                  {sz === 'sm' && 'Kecil'}
                  {sz === 'md' && 'Sedang'}
                  {sz === 'lg' && 'Besar'}
                  {sz === 'xl' && 'Jumbo'}
                </button>
              ))}
            </div>
          </div>

          {/* Sakelar Teks Transliterasi & Terjemahan */}
          <div className="space-y-2 border-t border-emerald-800/80 pt-3">
            <div className="flex items-center justify-between">
              <span>Tampilkan Teks Latin (Transliterasi)</span>
              <input
                type="checkbox"
                checked={settings.showLatin}
                onChange={(e) => onUpdateSettings({ ...settings, showLatin: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Tampilkan Terjemahan Bahasa Indonesia</span>
              <input
                type="checkbox"
                checked={settings.showTranslation}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, showTranslation: e.target.checked })
                }
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                Efek Suara Membalik Halaman & Tasbih
              </span>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, soundEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-emerald-800/80 pt-3 space-y-2">
            {onOpenUpload && (
              <button
                onClick={() => {
                  onClose();
                  onOpenUpload();
                }}
                className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-800 border border-amber-500/40 text-amber-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Kelola & Upload Foto Buku Saku Asli</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenPwaInfo();
              }}
              className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-emerald-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Cara Install di HP Android (Bebas Iklan & Offline)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
