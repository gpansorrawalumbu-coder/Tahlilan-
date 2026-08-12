import { CustomBookImages, ReaderSettings } from '../types';

const IMAGES_KEY = 'tahlil_lirboyo_custom_images';
const SETTINGS_KEY = 'tahlil_lirboyo_settings';
const LAST_PAGE_KEY = 'tahlil_lirboyo_last_page';
const BOOKMARKS_KEY = 'tahlil_lirboyo_bookmarks';

const DB_NAME = 'tahlil_lirboyo_db';
const STORE_NAME = 'custom_images';

export const DEFAULT_SETTINGS: ReaderSettings = {
  paperTheme: 'cream',
  fontSize: 'lg',
  showLatin: true,
  showTranslation: true,
  viewMode: 'digital',
  autoScroll: false,
  soundEnabled: true,
};

// IndexedDB Helper
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Image Compressor to shrink raw camera photos to optimized Web JPEGs (~100KB)
 */
export function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1600,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

// Async storage for Images (IndexedDB + safe localStorage fallback)
export async function loadStoredImagesAsync(): Promise<CustomBookImages> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get('book_images');
    const result = await new Promise<CustomBookImages>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || {});
      request.onerror = () => reject(request.error);
    });
    if (result && Object.keys(result).length > 0) {
      return result;
    }
  } catch (e) {
    console.warn('IndexedDB load failed, checking localStorage fallback:', e);
  }

  // Fallback to localStorage
  try {
    const data = localStorage.getItem(IMAGES_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

export async function saveStoredImagesAsync(images: CustomBookImages): Promise<void> {
  // Try IndexedDB first (no quota limitation for user images)
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(images, 'book_images');
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch (e) {
    console.error('IndexedDB save failed:', e);
  }

  // Also attempt safe localStorage sync, catching QuotaExceededError without throwing error
  try {
    localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
  } catch (e) {
    // Quota exceeded in localStorage is safe to ignore because IndexedDB holds the primary state
    console.warn('localStorage quota exceeded for custom images, stored safely in IndexedDB.');
  }
}

// Synchronous legacy getters/setters for initial render & fallback
export function loadStoredImages(): CustomBookImages {
  try {
    const data = localStorage.getItem(IMAGES_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

export function saveStoredImages(images: CustomBookImages): void {
  try {
    localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
  } catch (e) {
    console.warn('localStorage setItem failed (quota exceeded), image saved via IndexedDB handler.', e);
  }
}

export function loadStoredSettings(): ReaderSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: ReaderSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadLastPage(): number {
  try {
    const p = localStorage.getItem(LAST_PAGE_KEY);
    return p ? parseInt(p, 10) : 0; // 0 = Cover
  } catch (e) {
    return 0;
  }
}

export function saveLastPage(pageIndex: number): void {
  try {
    localStorage.setItem(LAST_PAGE_KEY, pageIndex.toString());
  } catch (e) {
    console.error('Failed to save last page', e);
  }
}

export function loadBookmarks(): number[] {
  try {
    const b = localStorage.getItem(BOOKMARKS_KEY);
    return b ? JSON.parse(b) : [];
  } catch (e) {
    return [];
  }
}

export function saveBookmarks(bookmarks: number[]): void {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to save bookmarks', e);
  }
}
