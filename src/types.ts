export interface TahlilPage {
  id: number;
  title: string;
  subtitle?: string;
  category: string;
  arabicText?: string;
  latinText?: string;
  translationText?: string;
  notes?: string;
  defaultImageUrl?: string;
}

export type PaperTheme = 'cream' | 'white' | 'dark' | 'emerald';

export interface ReaderSettings {
  paperTheme: PaperTheme;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  showLatin: boolean;
  showTranslation: boolean;
  viewMode: 'digital' | 'image'; // Digital typography or custom scanned image
  autoScroll: boolean;
  soundEnabled: boolean;
}

export interface CustomBookImages {
  cover?: string;
  page1?: string;
  page2?: string;
  page3?: string;
  page4?: string;
  page5?: string;
  page6?: string;
  page7?: string;
  page8?: string;
}
