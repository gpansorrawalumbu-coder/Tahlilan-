export interface CityLocation {
  id: string;
  name: string;
  province: string;
  lat: number;
  lng: number;
  tz: number; // UTC offset in hours (+7, +8, +9)
}

export interface PrayerTimesData {
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export const INDONESIA_CITIES: CityLocation[] = [
  { id: 'kediri', name: 'Kediri (Lirboyo / Ponpes)', province: 'Jawa Timur', lat: -7.8167, lng: 112.0167, tz: 7 },
  { id: 'jombang', name: 'Jombang (Tebuireng / Denanyar)', province: 'Jawa Timur', lat: -7.5461, lng: 112.2331, tz: 7 },
  { id: 'pasuruan', name: 'Pasuruan (Sidogiri)', province: 'Jawa Timur', lat: -7.6453, lng: 112.9075, tz: 7 },
  { id: 'rembang', name: 'Rembang (Sarang / Al-Anwar)', province: 'Jawa Tengah', lat: -6.7088, lng: 111.3411, tz: 7 },
  { id: 'jakarta', name: 'DKI Jakarta', province: 'DKI Jakarta', lat: -6.2088, lng: 106.8456, tz: 7 },
  { id: 'tangerang', name: 'Tangerang / Tangerang Selatan', province: 'Banten', lat: -6.1783, lng: 106.63, tz: 7 },
  { id: 'bekasi', name: 'Bekasi', province: 'Jawa Barat', lat: -6.2383, lng: 106.9756, tz: 7 },
  { id: 'depok', name: 'Depok', province: 'Jawa Barat', lat: -6.4, lng: 106.8186, tz: 7 },
  { id: 'bogor', name: 'Bogor', province: 'Jawa Barat', lat: -6.595, lng: 106.8167, tz: 7 },
  { id: 'surabaya', name: 'Surabaya', province: 'Jawa Timur', lat: -7.2575, lng: 112.7521, tz: 7 },
  { id: 'sidoarjo', name: 'Sidoarjo', province: 'Jawa Timur', lat: -7.4478, lng: 112.7183, tz: 7 },
  { id: 'bandung', name: 'Bandung', province: 'Jawa Barat', lat: -6.9175, lng: 107.6191, tz: 7 },
  { id: 'semarang', name: 'Semarang', province: 'Jawa Tengah', lat: -6.9667, lng: 110.4167, tz: 7 },
  { id: 'yogyakarta', name: 'Yogyakarta', province: 'DI Yogyakarta', lat: -7.7956, lng: 110.3695, tz: 7 },
  { id: 'malang', name: 'Malang', province: 'Jawa Timur', lat: -7.9667, lng: 112.6333, tz: 7 },
  { id: 'solo', name: 'Surakarta / Solo', province: 'Jawa Tengah', lat: -7.5667, lng: 110.8167, tz: 7 },
  { id: 'serang', name: 'Serang / Banten', province: 'Banten', lat: -6.12, lng: 106.15, tz: 7 },
  { id: 'cirebon', name: 'Cirebon', province: 'Jawa Barat', lat: -6.7063, lng: 108.557, tz: 7 },
  { id: 'tasikmalaya', name: 'Tasikmalaya', province: 'Jawa Barat', lat: -7.3274, lng: 108.2207, tz: 7 },
  { id: 'kudus', name: 'Kudus', province: 'Jawa Tengah', lat: -6.8048, lng: 110.8405, tz: 7 },
  { id: 'purwokerto', name: 'Purwokerto / Banyumas', province: 'Jawa Tengah', lat: -7.4244, lng: 109.2391, tz: 7 },
  { id: 'magelang', name: 'Magelang', province: 'Jawa Tengah', lat: -7.4706, lng: 110.2178, tz: 7 },
  { id: 'tuban', name: 'Tuban', province: 'Jawa Timur', lat: -6.8969, lng: 112.0649, tz: 7 },
  { id: 'lamongan', name: 'Lamongan', province: 'Jawa Timur', lat: -7.1182, lng: 112.4158, tz: 7 },
  { id: 'blitar', name: 'Blitar', province: 'Jawa Timur', lat: -8.0983, lng: 112.1681, tz: 7 },
  { id: 'tulungagung', name: 'Tulungagung', province: 'Jawa Timur', lat: -8.0667, lng: 111.9000, tz: 7 },
  { id: 'madiun', name: 'Madiun', province: 'Jawa Timur', lat: -7.6298, lng: 111.5239, tz: 7 },
  { id: 'probolinggo', name: 'Probolinggo', province: 'Jawa Timur', lat: -7.7543, lng: 113.2159, tz: 7 },
  { id: 'banyuwangi', name: 'Banyuwangi', province: 'Jawa Timur', lat: -8.2192, lng: 114.3691, tz: 7 },
  { id: 'medan', name: 'Medan', province: 'Sumatera Utara', lat: 3.5952, lng: 98.6722, tz: 7 },
  { id: 'palembang', name: 'Palembang', province: 'Sumatera Selatan', lat: -2.9761, lng: 104.7754, tz: 7 },
  { id: 'padang', name: 'Padang', province: 'Sumatera Barat', lat: -0.9492, lng: 100.3543, tz: 7 },
  { id: 'pekanbaru', name: 'Pekanbaru', province: 'Riau', lat: 0.5071, lng: 101.4478, tz: 7 },
  { id: 'lampung', name: 'Bandar Lampung', province: 'Lampung', lat: -5.45, lng: 105.2667, tz: 7 },
  { id: 'aceh', name: 'Banda Aceh', province: 'Aceh', lat: 5.5483, lng: 95.3238, tz: 7 },
  { id: 'makassar', name: 'Makassar', province: 'Sulawesi Selatan', lat: -5.1477, lng: 119.4327, tz: 8 },
  { id: 'manado', name: 'Manado', province: 'Sulawesi Utara', lat: 1.4748, lng: 124.8428, tz: 8 },
  { id: 'denpasar', name: 'Denpasar / Bali', province: 'Bali', lat: -8.6705, lng: 115.2126, tz: 8 },
  { id: 'mataram', name: 'Mataram / Lombok', province: 'NTB', lat: -8.5833, lng: 116.1167, tz: 8 },
  { id: 'kupang', name: 'Kupang', province: 'NTT', lat: -10.1772, lng: 123.607, tz: 8 },
  { id: 'banjarmasin', name: 'Banjarmasin', province: 'Kalimantan Selatan', lat: -3.3194, lng: 114.5908, tz: 8 },
  { id: 'samarinda', name: 'Samarinda', province: 'Kalimantan Timur', lat: -0.5022, lng: 117.1536, tz: 8 },
  { id: 'pontianak', name: 'Pontianak', province: 'Kalimantan Barat', lat: -0.0263, lng: 109.3425, tz: 7 },
  { id: 'ambon', name: 'Ambon', province: 'Maluku', lat: -3.6554, lng: 128.1906, tz: 9 },
  { id: 'jayapura', name: 'Jayapura', province: 'Papua', lat: -2.5489, lng: 140.7197, tz: 9 },
];

/**
 * Calculates Qibla direction (angle in degrees from true North, clockwise)
 * Mecca coordinates: Lat 21.4225° N, Lng 39.8262° E
 */
export function calculateQiblaAngle(lat: number, lng: number): number {
  const meccaLat = (21.4225 * Math.PI) / 180;
  const meccaLng = (39.8262 * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const lambda = (lng * Math.PI) / 180;

  const deltaLambda = meccaLng - lambda;

  const y = Math.sin(deltaLambda);
  const x =
    Math.cos(phi) * Math.tan(meccaLat) - Math.sin(phi) * Math.cos(deltaLambda);

  let qiblaRad = Math.atan2(y, x);
  let qiblaDeg = (qiblaRad * 180) / Math.PI;

  return (qiblaDeg + 360) % 360;
}

/**
 * Depag / Kemenag Indonesia standard astronomical prayer times calculator
 */
export function calculatePrayerTimes(
  city: CityLocation,
  date: Date = new Date()
): PrayerTimesData {
  const lat = city.lat;
  const lng = city.lng;
  const timezone = city.tz;

  // Day of year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Solar declination approx
  const d = dayOfYear;
  const declination =
    23.45 * Math.sin((((284 + d) * 360) / 365) * (Math.PI / 180));
  const decRad = (declination * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;

  // Equation of Time (EoT in minutes)
  const b = ((2 * Math.PI * (d - 81)) / 364);
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);

  // Solar Noon (Transit time in hours)
  const solarNoon = 12 + (timezone * 15 - lng) / 15 - eot / 60;

  // Depag Kemenag parameters:
  // Subuh: angle = -20 degrees
  // Terbit (Sunrise): angle = -0.833 degrees
  // Isya: angle = -18 degrees

  const getHourAngle = (angle: number) => {
    const angleRad = (angle * Math.PI) / 180;
    const cosHA =
      (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(decRad)) /
      (Math.cos(latRad) * Math.cos(decRad));

    if (cosHA > 1) return 0; // Never reaches
    if (cosHA < -1) return 12; // Always above
    return (Math.acos(cosHA) * 180) / Math.PI / 15;
  };

  // Hour angles
  const haSubuh = getHourAngle(-20);
  const haTerbit = getHourAngle(-0.833);
  const haIsya = getHourAngle(-18);

  // Ashar hour angle (Shafi'i shadow ratio = 1)
  const shadowLength = 1 + Math.tan(Math.abs(latRad - decRad));
  const asharAngleRad = Math.atan(1 / shadowLength);
  const asharAngle = (asharAngleRad * 180) / Math.PI;
  const haAshar = getHourAngle(asharAngle);

  // Times in decimal hours (+2 minutes Kemenag safety margin for Ihtiyath)
  const ihtiyath = 2 / 60;

  const subuhH = solarNoon - haSubuh + ihtiyath;
  const imsakH = subuhH - 10 / 60; // Imsak is 10 minutes before Subuh
  const terbitH = solarNoon - haTerbit;
  const dhuhaH = terbitH + 20 / 60; // Dhuha is approx 20 mins after sunrise
  const dzuhurH = solarNoon + ihtiyath;
  const asharH = solarNoon + haAshar + ihtiyath;
  const maghribH = solarNoon + haTerbit + ihtiyath;
  const isyaH = solarNoon + haIsya + ihtiyath;

  const formatTime = (h: number) => {
    let hours = Math.floor(h);
    let minutes = Math.floor((h - hours) * 60);
    if (minutes >= 60) {
      hours += 1;
      minutes -= 60;
    }
    const hStr = hours < 10 ? `0${hours}` : `${hours}`;
    const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hStr}:${mStr}`;
  };

  return {
    imsak: formatTime(imsakH),
    subuh: formatTime(subuhH),
    terbit: formatTime(terbitH),
    dhuha: formatTime(dhuhaH),
    dzuhur: formatTime(dzuhurH),
    ashar: formatTime(asharH),
    maghrib: formatTime(maghribH),
    isya: formatTime(isyaH),
  };
}

export function getNextPrayerInfo(
  times: PrayerTimesData,
  now: Date = new Date()
): { name: string; time: string; minutesLeft: number } {
  const nowMins = now.getHours() * 60 + now.getMinutes();

  const parseMins = (str: string) => {
    const [h, m] = str.split(':').map(Number);
    return h * 60 + m;
  };

  const schedule = [
    { name: 'Imsak', time: times.imsak, mins: parseMins(times.imsak) },
    { name: 'Subuh', time: times.subuh, mins: parseMins(times.subuh) },
    { name: 'Terbit', time: times.terbit, mins: parseMins(times.terbit) },
    { name: 'Dhuha', time: times.dhuha, mins: parseMins(times.dhuha) },
    { name: 'Dzuhur', time: times.dzuhur, mins: parseMins(times.dzuhur) },
    { name: 'Ashar', time: times.ashar, mins: parseMins(times.ashar) },
    { name: 'Maghrib', time: times.maghrib, mins: parseMins(times.maghrib) },
    { name: 'Isya', time: times.isya, mins: parseMins(times.isya) },
  ];

  for (const item of schedule) {
    if (item.mins > nowMins) {
      return {
        name: item.name,
        time: item.time,
        minutesLeft: item.mins - nowMins,
      };
    }
  }

  // Next is Subuh tomorrow
  const subuhMinsTomorrow = parseMins(times.subuh) + 24 * 60;
  return {
    name: 'Subuh (Besok)',
    time: times.subuh,
    minutesLeft: subuhMinsTomorrow - nowMins,
  };
}

/**
 * Reverse geocodes latitude/longitude into local Indonesian city or district name
 */
export async function reverseGeocodeCoords(lat: number, lng: number): Promise<{ name: string; province: string }> {
  // 1. Try BigDataCloud reverse geocode client
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`);
    if (res.ok) {
      const data = await res.json();
      const place = data.locality || data.city || data.localityInfo?.administrative?.[2]?.name || data.localityInfo?.administrative?.[1]?.name;
      const province = data.principalSubdivision || '';
      if (place) {
        return { name: place, province };
      }
    }
  } catch (e) {
    console.warn('BigDataCloud reverse geocode error:', e);
  }

  // 2. Try Nominatim reverse geocoding fallback
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=11&addressdetails=1`);
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const place = addr.city || addr.town || addr.regency || addr.county || addr.subdistrict || addr.district || addr.state_district || '';
      const province = addr.state || '';
      if (place) {
        return { name: place, province };
      }
    }
  } catch (e) {
    console.warn('Nominatim reverse geocode error:', e);
  }

  return { name: '', province: '' };
}

/**
 * Detects user location via GPS HTML5 Geolocation with automatic IP-geolocation fallback.
 */
export async function detectUserGPSLocation(): Promise<{ city: CityLocation; source: string }> {
  let lat: number | null = null;
  let lng: number | null = null;
  let source = 'GPS Satelit Presisi';

  // 1. HTML5 Geolocation API
  if (typeof window !== 'undefined' && 'geolocation' in navigator) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 0,
        });
      });
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      source = 'GPS Satelit Akurat';
    } catch (err) {
      console.warn('GPS browser error or rejected, trying IP network fallback...', err);
    }
  }

  // 2. IP Geolocation Fallback
  if (lat === null || lng === null) {
    const apis = [
      'https://ipapi.co/json/',
      'https://ip-api.com/json/?fields=status,city,regionName,lat,lon,utc_offset',
    ];

    for (const api of apis) {
      try {
        const res = await fetch(api);
        if (res.ok) {
          const data = await res.json();
          const foundLat = data.latitude || data.lat;
          const foundLng = data.longitude || data.lon;
          if (foundLat && foundLng) {
            lat = parseFloat(foundLat);
            lng = parseFloat(foundLng);
            const cityName = data.city || data.regionName || 'Jaringan IP';
            source = `Jaringan Internet (${cityName})`;
            break;
          }
        }
      } catch (e) {
        console.warn('IP API error:', api, e);
      }
    }
  }

  // 3. Ultimate Fallback: Kediri
  if (lat === null || lng === null) {
    return {
      city: INDONESIA_CITIES[0],
      source: 'Default Lirboyo Kediri',
    };
  }

  // 4. Calculate exact timezone offset for Indonesia based on longitude
  let tz = 7; // Default WIB (+7)
  if (lng >= 125) {
    tz = 9; // WIT (Papua / Maluku)
  } else if (lng >= 115) {
    tz = 8; // WITA (Bali, NTB, NTT, Sulsel, Kaltim, Kalsel)
  }

  // 5. Reverse geocode coordinates to real local Indonesian district/city name
  const geo = await reverseGeocodeCoords(lat, lng);

  // Find closest city in dictionary for province fallback
  let closest = INDONESIA_CITIES[0];
  let minDist = Infinity;
  for (const city of INDONESIA_CITIES) {
    const dist = Math.hypot(city.lat - lat, city.lng - lng);
    if (dist < minDist) {
      minDist = dist;
      closest = city;
    }
  }

  const locationTitle = geo.name ? geo.name : closest.name;
  const provinceTitle = geo.province ? geo.province : closest.province;

  return {
    city: {
      id: `gps-${lat.toFixed(4)}-${lng.toFixed(4)}`,
      name: `Lokasi Saya (${locationTitle})`,
      province: provinceTitle,
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
      tz,
    },
    source,
  };
}
