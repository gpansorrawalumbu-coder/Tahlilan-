import React, { useState, useRef, useEffect } from 'react';
import { YASIN_VERSES, YasinVerse } from '../data/yasinData';
import { ReaderSettings } from '../types';
import {
  X,
  Search,
  BookOpen,
  Volume2,
  Sparkles,
  ChevronUp,
  Bookmark,
  Check,
  Play,
  Pause,
  Sliders,
  Loader2,
  RefreshCw,
  Radio,
  VolumeX,
} from 'lucide-react';
import { NuLogoOrnament } from './NuLogoOrnament';

interface SurahYasinModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
}

interface QoriOption {
  id: string;
  name: string;
  sub: string;
  urls: string[];
}

const QORI_LIST: QoriOption[] = [
  {
    id: 'alafasy',
    name: 'Syaikh Mishary Al-Afasy',
    sub: 'Mishary Rashid Al-Afasy (Server Utama & Cepat)',
    urls: [
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/36.mp3',
      'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/036.mp3',
      'https://server8.mp3quran.net/afs/036.mp3',
    ],
  },
  {
    id: 'hanan_attaki',
    name: 'Ust. Hanan Attaki',
    sub: 'Ustadz Hanan Attaki (Murottal Syahdu)',
    urls: [
      'https://server11.mp3quran.net/hnn/036.mp3',
      'https://download.quranicaudio.com/quran/hanan_attaki/036.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/36.mp3',
    ],
  },
  {
    id: 'alghamdi',
    name: 'Syaikh Saad Al-Ghamdi',
    sub: 'Saad Al-Ghamdi (Murottal Halus)',
    urls: [
      'https://cdn.islamic.network/quran/audio/128/ar.ghamadi/36.mp3',
      'https://download.quranicaudio.com/quran/sa3d_al3agamy/036.mp3',
      'https://server7.mp3quran.net/s_gmd/036.mp3',
    ],
  },
  {
    id: 'yasser',
    name: 'Syaikh Yasser Al-Dosari',
    sub: 'Yasser Al-Dosari (Khas Masjidil Haram)',
    urls: [
      'https://server11.mp3quran.net/yasser/036.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.dussary/36.mp3',
      'https://download.quranicaudio.com/quran/yasser_ad-dussary/036.mp3',
    ],
  },
];

export const SurahYasinModal: React.FC<SurahYasinModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [search, setSearch] = useState('');
  const [bookmarkedVerse, setBookmarkedVerse] = useState<number | null>(() => {
    const saved = localStorage.getItem('yasin_bookmark');
    return saved ? parseInt(saved, 10) : null;
  });
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  // Audio State
  const [selectedQoriId, setSelectedQoriId] = useState<string>('alafasy');
  const [currentUrlIndex, setCurrentUrlIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Per-verse playing state
  const [playingVerseNum, setPlayingVerseNum] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const verseAudioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const verseRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const activeQori = QORI_LIST.find((q) => q.id === selectedQoriId) || QORI_LIST[0];
  const currentAudioUrl = activeQori.urls[currentUrlIndex] || activeQori.urls[0];

  // Reset audio source index when Qori changes
  useEffect(() => {
    setCurrentUrlIndex(0);
    setAudioError(null);
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  }, [selectedQoriId]);

  // Handle URL change or server switch during playback
  useEffect(() => {
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => {
          setIsAudioLoading(false);
          setAudioError(null);
        })
        .catch((err) => {
          console.warn('Playback error after URL change:', err);
        });
    }
  }, [currentUrlIndex]);

  // Auto-scroll logic
  useEffect(() => {
    let interval: any = null;
    if (isAutoScrolling && containerRef.current) {
      interval = setInterval(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop += 1.5;
        }
      }, 50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoScrolling]);

  // Switch to next server manually
  const switchNextServer = () => {
    const nextIdx = (currentUrlIndex + 1) % activeQori.urls.length;
    setCurrentUrlIndex(nextIdx);
    setAudioError(null);
    setIsAudioLoading(true);
  };

  // Handle Full Surah Audio Play/Pause
  const toggleAudioPlay = () => {
    // Stop verse audio if playing
    if (verseAudioRef.current) {
      verseAudioRef.current.pause();
      setPlayingVerseNum(null);
    }

    if (!audioRef.current) return;

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      setIsAudioLoading(true);
      setAudioError(null);

      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingAudio(true);
          setIsAudioLoading(false);
          setAudioError(null);
        })
        .catch((err) => {
          console.warn(`Audio play failed for Server ${currentUrlIndex + 1}: ${currentAudioUrl}`, err);
          handleAudioError();
        });
    }
  };

  // Audio Error Handler (auto switch server)
  const handleAudioError = () => {
    console.warn(`Audio stream failed for ${activeQori.name} Server ${currentUrlIndex + 1}`);

    if (currentUrlIndex < activeQori.urls.length - 1) {
      const nextIdx = currentUrlIndex + 1;
      setCurrentUrlIndex(nextIdx);
      setIsAudioLoading(true);
      setAudioError(`Server ${currentUrlIndex + 1} sibuk, mengalihkan ke Server ${nextIdx + 1}...`);
    } else {
      setIsAudioLoading(false);
      setIsPlayingAudio(false);
      setAudioError(`Semua server audio ${activeQori.name} gagal dijangkau. Coba ganti Qori ke Syaikh Al-Afasy.`);
    }
  };

  // Play individual verse audio using EveryAyah CDN
  const playVerseAudio = (verseNum: number) => {
    // Pause main audio if playing
    if (audioRef.current && isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }

    if (playingVerseNum === verseNum && verseAudioRef.current) {
      verseAudioRef.current.pause();
      setPlayingVerseNum(null);
      return;
    }

    // EveryAyah CDN format: 036 + 3-digit verse number (001 to 083)
    const verseFormatted = verseNum.toString().padStart(3, '0');
    const verseAudioUrl = `https://www.everyayah.com/data/Alafasy_128kbps/036${verseFormatted}.mp3`;

    if (!verseAudioRef.current) {
      verseAudioRef.current = new Audio(verseAudioUrl);
    } else {
      verseAudioRef.current.src = verseAudioUrl;
    }

    setPlayingVerseNum(verseNum);
    verseAudioRef.current
      .play()
      .then(() => {
        if (verseAudioRef.current) {
          verseAudioRef.current.onended = () => setPlayingVerseNum(null);
        }
      })
      .catch((e) => {
        console.warn('Primary verse audio error, trying fallback:', e);
        // Fallback verse audio URL
        const fallbackUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${3671 + verseNum}.mp3`;
        if (verseAudioRef.current) {
          verseAudioRef.current.src = fallbackUrl;
          verseAudioRef.current.play().then(() => {
            if (verseAudioRef.current) {
              verseAudioRef.current.onended = () => setPlayingVerseNum(null);
            }
          }).catch(() => setPlayingVerseNum(null));
        } else {
          setPlayingVerseNum(null);
        }
      });
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setAudioCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
      setIsAudioLoading(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setAudioCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const changePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 0.8];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const filteredVerses = YASIN_VERSES.filter((v) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      v.number.toString().includes(q) ||
      v.arabic.includes(q) ||
      v.latin.toLowerCase().includes(q) ||
      v.translation.toLowerCase().includes(q)
    );
  });

  const handleBookmark = (verseNum: number) => {
    if (bookmarkedVerse === verseNum) {
      setBookmarkedVerse(null);
      localStorage.removeItem('yasin_bookmark');
    } else {
      setBookmarkedVerse(verseNum);
      localStorage.setItem('yasin_bookmark', verseNum.toString());
    }
  };

  const scrollToVerse = (verseNum: number) => {
    const el = verseRefs.current[verseNum];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCopy = (v: YasinVerse) => {
    const text = `Surah Yasin Ayat ${v.number}\n\n${v.arabic}\n\n${v.latin}\n"${v.translation}"`;
    navigator.clipboard.writeText(text);
    setCopiedVerse(v.number);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const arabicSizeClass = {
    sm: 'text-2xl leading-[2.2]',
    md: 'text-3xl leading-[2.4]',
    lg: 'text-4xl leading-[2.6]',
    xl: 'text-5xl leading-[2.8]',
  }[settings.fontSize];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="bg-gradient-to-b from-emerald-950 via-[#022e20] to-emerald-950 text-emerald-50 rounded-3xl border border-amber-500/40 shadow-2xl w-full max-w-3xl h-[92vh] flex flex-col overflow-hidden relative">
        
        {/* Hidden Audio Element for Full Surah */}
        <audio
          ref={audioRef}
          src={currentAudioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            setIsPlayingAudio(false);
            setIsAudioLoading(false);
          }}
          onWaiting={() => setIsAudioLoading(true)}
          onPlaying={() => {
            setIsAudioLoading(false);
            setIsPlayingAudio(true);
            setAudioError(null);
          }}
          onError={handleAudioError}
        />

        {/* Header Bar */}
        <div className="p-3 sm:p-4 border-b border-emerald-800/80 bg-emerald-900/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <NuLogoOrnament size="sm" showLabel={false} />
            <div>
              <h3 className="font-extrabold gold-text-gradient font-display text-base sm:text-lg flex items-center gap-1.5">
                Surat Yasin Lengkap (سورة يس)
              </h3>
              <p className="text-[11px] text-emerald-300 font-medium">
                Surah ke-36 • 83 Ayat • Murottal {activeQori.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                isAutoScrolling
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-lg animate-pulse'
                  : 'bg-emerald-900/60 border-emerald-700/80 text-amber-300 hover:bg-emerald-800'
              }`}
              title="Gulir Otomatis (Auto Scroll)"
            >
              {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isAutoScrolling ? 'Jeda Scroll' : 'Auto Scroll'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-emerald-300 hover:text-white rounded-xl hover:bg-emerald-800/60 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Audio Murottal Player Banner with Qori Selector */}
        <div className="px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-950/90 via-emerald-950 to-amber-950/90 border-b border-amber-500/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-emerald-100 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Play/Pause Button */}
            <button
              onClick={toggleAudioPlay}
              className={`p-2.5 rounded-2xl border shadow-lg transition-all transform active:scale-95 shrink-0 flex items-center justify-center ${
                isPlayingAudio
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 ring-2 ring-amber-400/50 animate-pulse'
                  : 'bg-emerald-800 hover:bg-emerald-700 text-amber-300 border-amber-400/60'
              }`}
              title={isPlayingAudio ? 'Jeda Audio Murottal' : `Putar Audio Murottal ${activeQori.name}`}
            >
              {isAudioLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
              ) : isPlayingAudio ? (
                <Pause className="w-5 h-5 fill-emerald-950" />
              ) : (
                <Play className="w-5 h-5 fill-amber-300 ml-0.5" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-amber-400 animate-pulse" /> AUDIO
                </span>

                {/* Qori Selector Select Box */}
                <select
                  value={selectedQoriId}
                  onChange={(e) => setSelectedQoriId(e.target.value)}
                  className="bg-emerald-900/90 text-amber-200 text-xs font-bold rounded-lg px-2 py-0.5 border border-amber-500/40 focus:outline-none focus:border-amber-300 cursor-pointer"
                >
                  {QORI_LIST.map((q) => (
                    <option key={q.id} value={q.id} className="bg-emerald-950 text-amber-100 font-bold">
                      🎙️ {q.name}
                    </option>
                  ))}
                </select>

                {/* Manual Server Toggle Badge */}
                <button
                  onClick={switchNextServer}
                  className="text-[10px] font-bold bg-amber-900/60 hover:bg-amber-800/80 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/40 flex items-center gap-1 transition-all"
                  title="Klik untuk ganti Server Streaming Audio jika bermasalah"
                >
                  <RefreshCw className="w-2.5 h-2.5 text-amber-400" /> Server {currentUrlIndex + 1}/{activeQori.urls.length}
                </button>
              </div>

              <p className="text-[10px] text-emerald-300/90 truncate mt-0.5">
                {isAudioLoading
                  ? `Memuat audio ${activeQori.name} (Server ${currentUrlIndex + 1})...`
                  : audioError
                  ? audioError
                  : `Murottal Surat Yasin (83 Ayat) • ${activeQori.sub}`}
              </p>
            </div>
          </div>

          {/* Progress bar & Time */}
          <div className="flex items-center gap-2 flex-1 max-w-xs mx-1">
            <span className="text-[10px] font-mono text-amber-300/90">{formatTime(audioCurrentTime)}</span>
            <input
              type="range"
              min={0}
              max={audioDuration || 100}
              value={audioCurrentTime}
              onChange={handleSeek}
              className="w-full accent-amber-400 h-1.5 bg-emerald-900 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-mono text-emerald-400/80">{formatTime(audioDuration)}</span>
          </div>

          <div className="flex items-center gap-1.5 justify-end">
            <button
              onClick={changePlaybackRate}
              className="px-2.5 py-1 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-emerald-700/60 text-[11px] font-bold"
              title="Kecepatan Putar Audio"
            >
              {playbackRate}x
            </button>
          </div>
        </div>

        {/* Audio Error Alert Banner */}
        {audioError && (
          <div className="px-4 py-2 bg-amber-900/90 border-b border-amber-500/50 flex items-center justify-between text-xs text-amber-100 shrink-0">
            <div className="flex items-center gap-2">
              <VolumeX className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{audioError}</span>
            </div>
            <button
              onClick={() => {
                setSelectedQoriId('alafasy');
                setAudioError(null);
              }}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold rounded-lg text-[10px] uppercase shadow"
            >
              Ganti Qori Al-Afasy
            </button>
          </div>
        )}

        {/* Toolbar Controls: Jump to Verse, Search, Settings */}
        <div className="px-3 sm:px-4 py-2 bg-emerald-900/40 border-b border-emerald-800/60 flex flex-wrap items-center justify-between gap-2 shrink-0">
          {/* Search box */}
          <div className="relative flex-1 min-w-[140px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-amber-400" />
            <input
              type="text"
              placeholder="Cari ayat, nomor, terjemahan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-emerald-950/80 text-emerald-100 text-xs rounded-xl pl-8 pr-3 py-1.5 border border-emerald-700/80 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Quick verse selector */}
          <div className="flex items-center gap-1 text-[11px] overflow-x-auto py-1 scrollbar-none">
            <span className="text-amber-300/80 font-bold shrink-0">Lompat:</span>
            {[1, 10, 20, 30, 40, 50, 60, 70, 80, 83].map((num) => (
              <button
                key={num}
                onClick={() => scrollToVerse(num)}
                className="px-2 py-0.5 rounded-lg bg-emerald-900/80 hover:bg-amber-500/20 text-emerald-200 border border-emerald-700/60 font-mono text-[11px] font-bold shrink-0 transition-colors"
              >
                {num}
              </button>
            ))}
            {bookmarkedVerse && (
              <button
                onClick={() => scrollToVerse(bookmarkedVerse)}
                className="px-2 py-0.5 rounded-lg bg-amber-500/30 text-amber-200 border border-amber-400/60 font-bold flex items-center gap-1 shrink-0"
              >
                <Bookmark className="w-3 h-3 fill-amber-400" />
                <span>Ayat {bookmarkedVerse}</span>
              </button>
            )}
          </div>

          {/* Font size and toggles */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() =>
                onUpdateSettings({
                  fontSize:
                    settings.fontSize === 'sm'
                      ? 'md'
                      : settings.fontSize === 'md'
                      ? 'lg'
                      : settings.fontSize === 'lg'
                      ? 'xl'
                      : 'sm',
                })
              }
              className="px-2 py-1 rounded-lg bg-emerald-900/60 border border-emerald-700/60 text-amber-200 font-bold"
            >
              Teks: {settings.fontSize.toUpperCase()}
            </button>

            <button
              onClick={() => onUpdateSettings({ showLatin: !settings.showLatin })}
              className={`px-2 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                settings.showLatin
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-emerald-900/60 border-emerald-700/60 text-emerald-400'
              }`}
            >
              Latin
            </button>

            <button
              onClick={() => onUpdateSettings({ showTranslation: !settings.showTranslation })}
              className={`px-2 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                settings.showTranslation
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-emerald-900/60 border-emerald-700/60 text-emerald-400'
              }`}
            >
              Arti
            </button>
          </div>
        </div>

        {/* Scrollable Verses List */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-6 scroll-smooth bg-[#032318]/90"
        >
          {/* Header Bismillah Frame */}
          <div className="text-center py-4 px-4 bg-gradient-to-r from-emerald-900/40 via-emerald-800/50 to-emerald-900/40 border border-amber-500/30 rounded-3xl shadow-lg relative overflow-hidden space-y-2">
            <p className="text-3xl sm:text-4xl font-serif font-bold text-amber-300 drop-shadow">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>
            <p className="text-xs text-amber-200/90 font-medium">
              "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang"
            </p>
          </div>

          {/* Verses Mapping */}
          {filteredVerses.map((verse) => {
            const isBookmarked = bookmarkedVerse === verse.number;
            const isCopied = copiedVerse === verse.number;

            return (
              <div
                key={verse.number}
                ref={(el) => (verseRefs.current[verse.number] = el)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative ${
                  isBookmarked
                    ? 'bg-amber-500/15 border-amber-400/80 shadow-xl ring-1 ring-amber-400/40'
                    : 'bg-emerald-950/70 border-emerald-800/70 hover:border-emerald-700/90'
                }`}
              >
                {/* Verse Header Row */}
                <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    {/* Verse Number Emblem */}
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/60 flex items-center justify-center font-bold font-mono text-xs text-amber-300 shadow-sm">
                      {verse.number}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-300">
                      Ayat {verse.number} dari 83
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Per-Verse Play Audio Button */}
                    <button
                      onClick={() => playVerseAudio(verse.number)}
                      className={`p-1.5 rounded-xl border text-xs flex items-center gap-1 transition-all ${
                        playingVerseNum === verse.number
                          ? 'bg-amber-400 text-emerald-950 border-amber-300 font-bold shadow-md animate-pulse'
                          : 'bg-emerald-900/60 border-emerald-700/60 text-amber-300 hover:bg-emerald-800'
                      }`}
                      title={`Putar Suara Ayat ${verse.number}`}
                    >
                      {playingVerseNum === verse.number ? (
                        <Pause className="w-3.5 h-3.5 fill-emerald-950" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                      )}
                      <span className="text-[10px] font-bold hidden sm:inline">
                        {playingVerseNum === verse.number ? 'Jeda' : 'Suara'}
                      </span>
                    </button>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => handleBookmark(verse.number)}
                      className={`p-1.5 rounded-xl border transition-colors ${
                        isBookmarked
                          ? 'bg-amber-400 text-emerald-950 border-amber-300 font-bold'
                          : 'bg-emerald-900/60 border-emerald-700/60 text-emerald-300 hover:text-amber-300'
                      }`}
                      title={isBookmarked ? 'Hapus Penanda' : 'Tandai Ayat Ini'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-emerald-950' : ''}`} />
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(verse)}
                      className="p-1.5 rounded-xl bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 hover:text-amber-300 text-xs flex items-center gap-1 transition-colors"
                      title="Salin Ayat"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <span className="text-[10px] font-bold">Salin</span>}
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <div className="text-right py-2">
                  <p
                    className={`font-serif font-bold text-amber-100 dir-rtl tracking-wide select-text ${arabicSizeClass}`}
                    style={{ fontFamily: "'Scheherazade New', 'Amiri', 'Traditional Arabic', serif" }}
                  >
                    {verse.arabic}{' '}
                    <span className="inline-block text-amber-400/80 text-lg font-mono px-1">
                      ﴿{verse.number}﴾
                    </span>
                  </p>
                </div>

                {/* Transliteration (Latin) */}
                {settings.showLatin && (
                  <p className="text-xs text-emerald-200 font-medium italic mt-2 border-t border-emerald-900/80 pt-2 leading-relaxed">
                    {verse.latin}
                  </p>
                )}

                {/* Translation (Indonesian) */}
                {settings.showTranslation && (
                  <p className="text-xs text-amber-200/90 font-sans mt-2 leading-relaxed bg-emerald-900/30 p-2.5 rounded-xl border border-emerald-800/40">
                    "{verse.translation}"
                  </p>
                )}
              </div>
            );
          })}

          {filteredVerses.length === 0 && (
            <div className="text-center py-12 text-emerald-300 space-y-2">
              <Search className="w-8 h-8 mx-auto text-amber-400 opacity-60" />
              <p className="text-sm font-semibold">Tidak ada ayat Yasin yang sesuai pencarian "{search}"</p>
            </div>
          )}

          {/* End of Surah Seal */}
          <div className="text-center pt-6 pb-4 space-y-2 border-t border-emerald-800/80">
            <p className="text-2xl font-serif text-amber-300 font-bold">
              صَدَقَ اللهُ الْعَظِيْمُ
            </p>
            <p className="text-xs text-emerald-300">
              "Maha Benar Allah Yang Maha Agung dengan segala firman-Nya"
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  if (containerRef.current) {
                    containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-1.5"
              >
                <ChevronUp className="w-4 h-4" />
                <span>Kembali ke Awal Surah</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-3 border-t border-emerald-800/80 bg-emerald-900/60 text-center text-xs text-emerald-300 font-medium flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1 text-[11px] text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Khatam Yasin & Tahlil Lirboyo Kediri</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-extrabold text-xs rounded-xl shadow-md transition-all"
          >
            Tutup Yasin
          </button>
        </div>

      </div>
    </div>
  );
};
