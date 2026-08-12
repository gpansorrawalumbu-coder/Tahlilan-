import React, { useState } from 'react';
import { CustomBookImages } from '../types';
import { compressImageFile } from '../utils/storage';
import { TAHLIL_PAGES } from '../data/tahlilData';
import { Upload, X, Trash2, CheckCircle2, Image as ImageIcon, Camera, RotateCcw } from 'lucide-react';

interface ImageUploaderProps {
  images: CustomBookImages;
  onUpdateImages: (images: CustomBookImages) => Promise<void>;
  onClose: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onUpdateImages,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<keyof CustomBookImages>('cover');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const tabs: { key: keyof CustomBookImages; label: string; title: string }[] = [
    { key: 'cover', label: 'Cover Depan', title: 'Cover Kitab' },
    ...Array.from({ length: 8 }, (_, i) => {
      const pageNum = i + 1;
      const pData = TAHLIL_PAGES.find((p) => p.id === pageNum);
      return {
        key: `page${pageNum}` as keyof CustomBookImages,
        label: `Hal. ${pageNum}`,
        title: pData ? `Hal ${pageNum}: ${pData.title}` : `Halaman ${pageNum}`,
      };
    }),
  ];

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof CustomBookImages
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setStatusMsg('Mengompres & memproses foto scan...');

    try {
      // Compress image to optimized format (~100KB-300KB JPEG)
      const compressedDataUrl = await compressImageFile(file, 1200, 1600, 0.82);

      const updated = {
        ...images,
        [key]: compressedDataUrl,
      };

      await onUpdateImages(updated);
      setStatusMsg('Foto scan berhasil disimpan!');
      setTimeout(() => setStatusMsg(null), 2500);
    } catch (err) {
      console.error(err);
      setStatusMsg('Gagal memproses foto. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveImage = async (key: keyof CustomBookImages) => {
    const updated = { ...images };
    delete updated[key];
    await onUpdateImages(updated);
    setStatusMsg(`Foto ${key} berhasil dihapus.`);
    setTimeout(() => setStatusMsg(null), 2000);
  };

  const handleClearAll = async () => {
    if (window.confirm('Hapus semua foto scan kustom yang diunggah?')) {
      await onUpdateImages({});
      setStatusMsg('Semua foto scan kustom telah dihapus.');
      setTimeout(() => setStatusMsg(null), 2000);
    }
  };

  const currentImg = images[activeTab];
  const activeTabMeta = tabs.find((t) => t.key === activeTab);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#24170d] text-amber-100 border-2 border-amber-600/50 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-800/40 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-amber-200">
                Upload Foto Buku Saku Scan Asli
              </h2>
              <p className="text-xs text-amber-400/80">
                Unggah foto halaman buku saku tahlil Anda untuk ditampilkan di Mode Scan Foto
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-amber-900/60 text-amber-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {statusMsg && (
          <div className="mb-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Tab Selection Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-thin">
          {tabs.map((tab) => {
            const hasImg = !!images[tab.key];
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all border ${
                  isActive
                    ? 'bg-amber-600 text-amber-950 border-amber-400 shadow-md scale-105'
                    : 'bg-amber-950/40 text-amber-300 border-amber-800/50 hover:bg-amber-900/40'
                }`}
              >
                <span>{tab.label}</span>
                {hasImg && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Box */}
        <div className="bg-[#180f08] rounded-2xl p-4 border border-amber-900/50 flex flex-col items-center justify-center min-h-[280px] relative">
          <h3 className="text-sm font-bold text-amber-300 mb-3 text-center">
            {activeTabMeta?.title}
          </h3>

          {currentImg ? (
            <div className="flex flex-col items-center space-y-3 w-full">
              <div className="relative group max-h-[260px] overflow-hidden rounded-xl border-2 border-amber-600/60 shadow-xl bg-black">
                <img
                  src={currentImg}
                  alt={`Preview ${activeTabMeta?.title}`}
                  className="max-h-[250px] w-auto object-contain"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-4 py-2 bg-amber-700 hover:bg-amber-600 text-amber-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all">
                  <Upload className="w-4 h-4" />
                  <span>Ganti Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, activeTab)}
                    disabled={isProcessing}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => handleRemoveImage(activeTab)}
                  className="px-3.5 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-600/50 text-rose-200 font-bold rounded-xl text-xs flex items-center gap-1 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center p-4 space-y-3">
              <div className="p-4 rounded-full bg-amber-900/30 text-amber-400 border border-amber-800/40">
                <ImageIcon className="w-8 h-8 opacity-80" />
              </div>
              <div>
                <p className="text-xs text-amber-300 font-medium">
                  Belum ada foto scan terpasang untuk {activeTabMeta?.title}
                </p>
                <p className="text-[11px] text-amber-500/70 mt-0.5">
                  Format gambar JPG/PNG disarankan
                </p>
              </div>

              <label className={`cursor-pointer px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload className="w-4 h-4" />
                <span>Pilih & Upload Foto Scan</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, activeTab)}
                  disabled={isProcessing}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-4 pt-3 border-t border-amber-800/40 flex items-center justify-between text-xs">
          <button
            onClick={handleClearAll}
            className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Semua Foto
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold rounded-xl transition-all shadow-md"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
