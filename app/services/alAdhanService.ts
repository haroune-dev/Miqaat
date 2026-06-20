import type { PrayerTime } from "~/data/prayer-data";

const ALADHAN_API_BASE = "https://api.aladhan.com/v1";

export interface AlAdhanTiming {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

export interface AlAdhanDay {
  timings: AlAdhanTiming;
  date: {
    readable: string;
    timestamp: string;
    gregorian: { date: string };
  };
}

export interface AlAdhanResponse {
  code: number;
  status: string;
  data: Record<string, AlAdhanDay[]>; // Keys are months "1" to "12"
}

// The 10 coordinates-based cities as requested (we treat cityIds > 58 as the new/coordinates-based ones, plus any others if needed. The user specified "58 predefined cities", so we'll check if cityId <= 58 for the 58 established wilayas).
export async function fetchAlAdhanAnnualCalendar(
  cityId: number,
  cityName: string,
  lat: number,
  lng: number,
  year: number
): Promise<AlAdhanResponse> {
  const cacheKey = `aladhan_calendar_v2_${cityId}_${year}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error("Failed to parse cached calendar", e);
    }
  }

  // Determine endpoint
  // Always use exact coordinates since AlAdhan geocoding is unreliable for Algerian cities
  const url = `${ALADHAN_API_BASE}/calendar/${year}?latitude=${lat}&longitude=${lng}&method=19`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch AlAdhan calendar: ${res.status} ${res.statusText}`);
  }

  const data: AlAdhanResponse = await res.json();
  if (data.code !== 200) {
    throw new Error(`AlAdhan API error: ${data.status}`);
  }

  try {
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (e) {
    console.warn("Could not cache calendar (quota exceeded?)", e);
  }

  return data;
}

// Strip timezone strings like " (CET)" -> ""
export function stripTimezone(timeString: string): string {
  return timeString.split(" ")[0];
}

function normalizeTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function calculateDuha(sunriseTime: string): string {
  const [h, m] = sunriseTime.split(":").map(Number);
  const totalMinutes = h * 60 + m + 15;
  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

export function mapAlAdhanDayToPrayerTimes(day: AlAdhanDay): PrayerTime[] {
  const timings = day.timings;
  
  const fajr = normalizeTime(stripTimezone(timings.Fajr));
  const sunrise = normalizeTime(stripTimezone(timings.Sunrise));
  const dhuhr = normalizeTime(stripTimezone(timings.Dhuhr));
  const asr = normalizeTime(stripTimezone(timings.Asr));
  const maghrib = normalizeTime(stripTimezone(timings.Maghrib));
  const isha = normalizeTime(stripTimezone(timings.Isha));
  
  const duha = calculateDuha(sunrise);

  return [
    { name: "Fajr", label: "Fajr", time: fajr, icon: "moon", isPrayer: true },
    { name: "Sunrise", label: "Sunrise", time: sunrise, icon: "sunrise", isPrayer: false },
    { name: "Duha", label: "Duha", time: duha, icon: "sun-dim", isPrayer: true },
    { name: "Dhuhr", label: "Dhuhr", time: dhuhr, icon: "sun", isPrayer: true },
    { name: "Asr", label: "Asr", time: asr, icon: "cloud-sun", isPrayer: true },
    { name: "Maghrib", label: "Maghrib", time: maghrib, icon: "sunset", isPrayer: true },
    { name: "Isha", label: "Isha", time: isha, icon: "star", isPrayer: true },
  ];
}
