/**
 * Utility for Hijri (Islamic) Calendar and Javanese (Kalender Jawa & Pasaran) Calculations
 */

export interface HijriDateInfo {
  day: number;
  monthIndex: number; // 0-11
  monthNameIndo: string;
  monthNameArabic: string;
  year: number;
  formatted: string;
  formattedArabic: string;
}

export interface JavaneseDateInfo {
  dayName: string; // e.g. "Selasa"
  pasaranName: string; // e.g. "Kliwon"
  fullDayPasaran: string; // e.g. "Selasa Kliwon"
  neptuDay: number; // e.g. 3
  neptuPasaran: number; // e.g. 8
  totalNeptu: number; // e.g. 11
  javaneseMonthName: string; // e.g. "Sapar"
  javaneseYear: number; // e.g. 1960
  yearName: string; // e.g. "Dal"
  wuku?: string;
}

export const HIJRI_MONTHS_INDO = [
  'Muharram',
  'Safar',
  'Rabi\'ul Awal',
  'Rabi\'ul Akhir',
  'Jumadil Awal',
  'Jumadil Akhir',
  'Rajab',
  'Sya\'ban',
  'Ramadhan',
  'Syawal',
  'Dzulqa\'dah',
  'Dzulhijjah',
];

export const HIJRI_MONTHS_ARABIC = [
  'محرّم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

export const JAVANESE_MONTHS = [
  'Suro',
  'Sapar',
  'Mulud',
  'Bakda Mulud',
  'Jumadil Awal',
  'Jumadil Akhir',
  'Rejob',
  'Ruwah',
  'Pasa',
  'Sawal',
  'Sela',
  'Besar',
];

export const PASARAN_NAMES = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

export const DAY_NAMES_INDO = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

// Neptu values
export const NEPTU_HARI: Record<string, number> = {
  Minggu: 5,
  Senin: 4,
  Selasa: 3,
  Rabu: 7,
  Kamis: 8,
  Jumat: 6,
  Sabtu: 9,
};

export const NEPTU_PASARAN: Record<string, number> = {
  Legi: 5,
  Pahing: 9,
  Pon: 7,
  Wage: 4,
  Kliwon: 8,
};

export const JAVANESE_YEAR_NAMES = [
  'Alip',
  'Ehe',
  'Jimawal',
  'Je',
  'Dal',
  'Be',
  'Wawu',
  'Jimakhir',
];

/**
 * Calculates Julian Day Number for a Gregorian Date (year, month: 1-12, day: 1-31)
 */
export function getJulianDay(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * Computes Hijri Calendar Date with user adjustment offset (± days)
 */
export function getHijriDate(date: Date = new Date(), offsetDays: number = 0): HijriDateInfo {
  const jd = getJulianDay(date) + offsetDays;

  // Kuwaiti Algorithm / Tabular Islamic Calendar approximation
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l1 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l1) / 5316) * Math.floor((50 * l1) / 17719) +
    Math.floor(l1 / 5670) * Math.floor((43 * l1) / 15238);
  const l2 =
    l1 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const m = Math.floor((24 * l2) / 709);
  const d = l2 - Math.floor((709 * m) / 24);
  const y = 30 * n + j - 30;

  const monthIndex = Math.min(11, Math.max(0, m - 1));
  const monthNameIndo = HIJRI_MONTHS_INDO[monthIndex];
  const monthNameArabic = HIJRI_MONTHS_ARABIC[monthIndex];

  return {
    day: d,
    monthIndex,
    monthNameIndo,
    monthNameArabic,
    year: y,
    formatted: `${d} ${monthNameIndo} ${y} H`,
    formattedArabic: `${d} ${monthNameArabic} ${y} هـ`,
  };
}

/**
 * Computes Javanese Date & Pasaran (Legi, Pahing, Pon, Wage, Kliwon)
 */
export function getJavaneseDate(date: Date = new Date(), hijriOffset: number = 0): JavaneseDateInfo {
  const jd = getJulianDay(date);
  const dayIndex = date.getDay(); // 0 = Minggu
  const dayName = DAY_NAMES_INDO[dayIndex];

  // Pasaran calculation from Julian Day
  // Anchor verified: 2000-01-01 (Sabtu Pahing) => (2451545 + 1) % 5 = 1 (Pahing)
  const pasaranIndex = (jd + 1) % 5;
  const pasaranName = PASARAN_NAMES[pasaranIndex];

  const neptuDay = NEPTU_HARI[dayName] || 0;
  const neptuPasaran = NEPTU_PASARAN[pasaranName] || 0;
  const totalNeptu = neptuDay + neptuPasaran;

  const hijriInfo = getHijriDate(date, hijriOffset);
  const javaneseMonthName = JAVANESE_MONTHS[hijriInfo.monthIndex];

  // Sultan Agungan Javanese Year approx (Hijri year + 512)
  const javaneseYear = hijriInfo.year + 512;
  const yearNameIndex = (javaneseYear - 1) % 8;
  const yearName = JAVANESE_YEAR_NAMES[yearNameIndex];

  return {
    dayName,
    pasaranName,
    fullDayPasaran: `${dayName} ${pasaranName}`,
    neptuDay,
    neptuPasaran,
    totalNeptu,
    javaneseMonthName,
    javaneseYear,
    yearName,
  };
}
