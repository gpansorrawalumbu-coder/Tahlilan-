import React, { useState, useEffect } from 'react';
import { Smartphone, Download, CheckCircle2, ShieldCheck, WifiOff, X, Sparkles } from 'lucide-react';

interface PwaInstallPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('Untuk menginstall di HP Android:\n1. Buka menu titik tiga (⋮) di Chrome/Browser HP Anda\n2. Pilih "Tambahkan ke Layar Utama" / "Add to Home Screen" atau "Install Aplikasi"');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-emerald-950 text-emerald-100 border border-emerald-600/50 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-emerald-800/80 flex items-center justify-between bg-emerald-900/60">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-amber-200 text-base">Install di HP Android</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-emerald-100">
          <div className="text-center py-2">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl border-2 border-amber-400 mx-auto flex items-center justify-center shadow-lg mb-3">
              <span className="text-2xl">📖</span>
            </div>
            <h4 className="font-extrabold text-base text-amber-200">
              Aplikasi TAHLIL LIRBOYO RINGKAS
            </h4>
            <p className="text-emerald-300 text-xs mt-1">
              Ringkasan Ustadz Muhammad Qosyim • Buku Saku Digital
            </p>
          </div>

          <div className="space-y-2 bg-emerald-900/40 p-3.5 rounded-xl border border-emerald-800/80">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <WifiOff className="w-4 h-4 shrink-0 text-amber-400" />
              <span>100% Offline Tanpa Kuota Internet</span>
            </div>
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Bebas Iklan Apapun (Tanpa Pop-up / Banner)</span>
            </div>
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Ringan & Cepat di Semua HP Android</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h5 className="font-bold text-amber-300">Cara Memasang di HP:</h5>
            <ol className="list-decimal list-inside space-y-1.5 text-emerald-200/90 leading-relaxed bg-emerald-900/20 p-3 rounded-xl border border-emerald-800/50">
              <li>Tekan tombol <strong>"Install ke Layar HP"</strong> di bawah.</li>
              <li>Atau ketuk menu <strong>titik tiga (⋮)</strong> di sudut kanan atas browser Google Chrome HP.</li>
              <li>Pilih opsi <strong>"Tambahkan ke Layar Utama"</strong> (Add to Home Screen) atau <strong>"Install Aplikasi"</strong>.</li>
              <li>Ikon Buku Saku Tahlil Lirboyo akan langsung muncul di HP Anda!</li>
            </ol>
          </div>

          {installed ? (
            <div className="p-3 bg-emerald-900/80 border border-emerald-500/60 rounded-xl text-center text-amber-300 font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              Aplikasi Sudah Terpasang di HP Anda!
            </div>
          ) : (
            <button
              onClick={handleInstallClick}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-extrabold text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Download className="w-5 h-5" />
              <span>Install ke Layar HP Sekarang</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
