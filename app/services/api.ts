import type { PrayerTime, Wilaya, Baladiya } from "~/data/prayer-data";

/**
 * Base URL for the prayer times API.
 * Change this to your real backend URL when ready.
 */
const API_BASE = "/api";

/* ------------------------------------------------------------------ */
/*  Mock data – remove once connected to real backend                 */
/* ------------------------------------------------------------------ */

const MOCK_WILAYAS: Wilaya[] = [
  { id: 1, name: "Adrar", nameAr: "أدرار" },
  { id: 2, name: "Chlef", nameAr: "الشلف" },
  { id: 3, name: "Laghouat", nameAr: "الأغواط" },
  { id: 4, name: "Oum El Bouaghi", nameAr: "أم البواقي" },
  { id: 5, name: "Batna", nameAr: "باتنة" },
  { id: 6, name: "Béjaïa", nameAr: "بجاية" },
  { id: 7, name: "Biskra", nameAr: "بسكرة" },
  { id: 8, name: "Béchar", nameAr: "بشار" },
  { id: 9, name: "Blida", nameAr: "البليدة" },
  { id: 10, name: "Bouira", nameAr: "البويرة" },
  { id: 11, name: "Tamanrasset", nameAr: "تمنراست" },
  { id: 12, name: "Tébessa", nameAr: "تبسة" },
  { id: 13, name: "Tlemcen", nameAr: "تلمسان" },
  { id: 14, name: "Tiaret", nameAr: "تيارت" },
  { id: 15, name: "Tizi Ouzou", nameAr: "تيزي وزو" },
  { id: 16, name: "Algiers", nameAr: "الجزائر" },
  { id: 17, name: "Djelfa", nameAr: "الجلفة" },
  { id: 18, name: "Jijel", nameAr: "جيجل" },
  { id: 19, name: "Sétif", nameAr: "سطيف" },
  { id: 20, name: "Saïda", nameAr: "سعيدة" },
  { id: 21, name: "Skikda", nameAr: "سكيكدة" },
  { id: 22, name: "Sidi Bel Abbès", nameAr: "سيدي بلعباس" },
  { id: 23, name: "Annaba", nameAr: "عنابة" },
  { id: 24, name: "Guelma", nameAr: "قالمة" },
  { id: 25, name: "Constantine", nameAr: "قسنطينة" },
  { id: 26, name: "Médéa", nameAr: "المدية" },
  { id: 27, name: "Mostaganem", nameAr: "مستغانم" },
  { id: 28, name: "M'Sila", nameAr: "المسيلة" },
  { id: 29, name: "Mascara", nameAr: "معسكر" },
  { id: 30, name: "Ouargla", nameAr: "ورقلة" },
  { id: 31, name: "Oran", nameAr: "وهران" },
  { id: 32, name: "El Bayadh", nameAr: "البيض" },
  { id: 33, name: "Illizi", nameAr: "إليزي" },
  { id: 34, name: "Bordj Bou Arréridj", nameAr: "برج بوعريريج" },
  { id: 35, name: "Boumerdès", nameAr: "بومرداس" },
  { id: 36, name: "El Tarf", nameAr: "الطارف" },
  { id: 37, name: "Tindouf", nameAr: "تندوف" },
  { id: 38, name: "Tissemsilt", nameAr: "تيسمسيلت" },
  { id: 39, name: "El Oued", nameAr: "الوادي" },
  { id: 40, name: "Khenchela", nameAr: "خنشلة" },
  { id: 41, name: "Souk Ahras", nameAr: "سوق أهراس" },
  { id: 42, name: "Tipaza", nameAr: "تيبازة" },
  { id: 43, name: "Mila", nameAr: "ميلة" },
  { id: 44, name: "Aïn Defla", nameAr: "عين الدفلى" },
  { id: 45, name: "Naâma", nameAr: "النعامة" },
  { id: 46, name: "Aïn Témouchent", nameAr: "عين تموشنت" },
  { id: 47, name: "Ghardaïa", nameAr: "غرداية" },
  { id: 48, name: "Relizane", nameAr: "غليزان" },
];

/** Coordinates by wilaya center (approximate) */
const WILAYA_COORDS: Record<number, { lat: number; lng: number }> = {
  1: { lat: 27.87, lng: -0.29 },
  2: { lat: 36.16, lng: 1.33 },
  3: { lat: 33.8, lng: 2.88 },
  4: { lat: 35.88, lng: 7.11 },
  5: { lat: 35.56, lng: 6.17 },
  6: { lat: 36.75, lng: 5.08 },
  7: { lat: 34.85, lng: 5.73 },
  8: { lat: 31.62, lng: -2.22 },
  9: { lat: 36.47, lng: 2.83 },
  10: { lat: 36.38, lng: 3.9 },
  11: { lat: 22.79, lng: 5.53 },
  12: { lat: 35.4, lng: 8.12 },
  13: { lat: 34.88, lng: -1.32 },
  14: { lat: 35.37, lng: 1.32 },
  15: { lat: 36.71, lng: 4.05 },
  16: { lat: 36.75, lng: 3.06 },
  17: { lat: 34.67, lng: 3.25 },
  18: { lat: 36.82, lng: 5.77 },
  19: { lat: 36.19, lng: 5.41 },
  20: { lat: 34.83, lng: 0.15 },
  21: { lat: 36.88, lng: 6.91 },
  22: { lat: 35.19, lng: -0.63 },
  23: { lat: 36.9, lng: 7.77 },
  24: { lat: 36.46, lng: 7.43 },
  25: { lat: 36.37, lng: 6.61 },
  26: { lat: 36.26, lng: 2.75 },
  27: { lat: 35.93, lng: 0.09 },
  28: { lat: 35.7, lng: 4.54 },
  29: { lat: 35.4, lng: 0.14 },
  30: { lat: 31.95, lng: 5.33 },
  31: { lat: 35.7, lng: -0.63 },
  32: { lat: 33.69, lng: 1.02 },
  33: { lat: 26.51, lng: 8.48 },
  34: { lat: 36.07, lng: 4.76 },
  35: { lat: 36.76, lng: 3.47 },
  36: { lat: 36.77, lng: 8.31 },
  37: { lat: 27.67, lng: -8.15 },
  38: { lat: 35.61, lng: 1.81 },
  39: { lat: 33.37, lng: 6.85 },
  40: { lat: 35.44, lng: 7.14 },
  41: { lat: 36.29, lng: 7.95 },
  42: { lat: 36.59, lng: 2.45 },
  43: { lat: 36.45, lng: 6.26 },
  44: { lat: 36.26, lng: 1.97 },
  45: { lat: 33.27, lng: -0.31 },
  46: { lat: 35.3, lng: -1.14 },
  47: { lat: 32.49, lng: 3.67 },
  48: { lat: 35.74, lng: 0.56 },
};

/** Generate mock baladiyas for a given wilaya */
function generateMockBaladiyas(wilayaId: number): Baladiya[] {
  const coords = WILAYA_COORDS[wilayaId] ?? { lat: 36.75, lng: 3.06 };
  const wilaya = MOCK_WILAYAS.find((w) => w.id === wilayaId);
  if (!wilaya) return [];

  const suffixes = ["Centre", "Est", "Ouest", "Nord", "Sud"];
  return suffixes.map((s, i) => ({
    id: wilayaId * 100 + i + 1,
    name: `${wilaya.name} ${s}`,
    nameAr: `${wilaya.nameAr} ${s}`,
    wilayaId,
    latitude: coords.lat + (i - 2) * 0.05,
    longitude: coords.lng + (i - 2) * 0.03,
  }));
}

/** Generate mock prayer times for given coordinates */
function generateMockPrayerTimes(lat: number, _lng: number): PrayerTime[] {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const seasonalFactor = Math.sin(((dayOfYear - 80) * 2 * Math.PI) / 365);
  const latFactor = Math.abs(lat) / 90;

  const fajrMin = 300 - latFactor * 60 * seasonalFactor;
  const sunriseMin = fajrMin + 80;
  const dhuhrMin = 750;
  const asrMin = dhuhrMin + 180 + latFactor * 40 * seasonalFactor;
  const maghribMin = dhuhrMin + 390 - latFactor * 60 * seasonalFactor;
  const ishaMin = maghribMin + 75 + latFactor * 30 * seasonalFactor;

  const toTime = (minutes: number): string => {
    const h = Math.floor((((minutes % 1440) + 1440) % 1440) / 60);
    const m = Math.floor(minutes % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  return [
    { name: "Fajr", label: "Fajr", time: toTime(fajrMin), icon: "moon", isPrayer: true },
    { name: "Sunrise", label: "Sunrise", time: toTime(sunriseMin), icon: "sunrise", isPrayer: false },
    { name: "Dhuhr", label: "Dhuhr", time: toTime(dhuhrMin), icon: "sun", isPrayer: true },
    { name: "Asr", label: "Asr", time: toTime(asrMin), icon: "cloud-sun", isPrayer: true },
    { name: "Maghrib", label: "Maghrib", time: toTime(maghribMin), icon: "sunset", isPrayer: true },
    { name: "Isha", label: "Isha", time: toTime(ishaMin), icon: "star", isPrayer: true },
  ];
}

/* ------------------------------------------------------------------ */
/*  API functions – swap mock bodies with real fetch() calls          */
/* ------------------------------------------------------------------ */

/** Simulate network latency */
function delay(ms = 400): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Fetch all wilayas (provinces) */
export async function fetchWilayas(): Promise<Wilaya[]> {
  // TODO: Replace with real API call:
  // const res = await fetch(`${API_BASE}/wilayas`);
  // if (!res.ok) throw new Error("Failed to fetch wilayas");
  // return res.json();
  await delay(300);
  return MOCK_WILAYAS;
}

/** Fetch baladiyas (municipalities) for a given wilaya */
export async function fetchBaladiyas(wilayaId: number): Promise<Baladiya[]> {
  // TODO: Replace with real API call:
  // const res = await fetch(`${API_BASE}/wilayas/${wilayaId}/baladiyas`);
  // if (!res.ok) throw new Error("Failed to fetch baladiyas");
  // return res.json();
  await delay(250);
  return generateMockBaladiyas(wilayaId);
}

/** Fetch prayer times for given coordinates */
export async function fetchPrayerTimes(
  lat: number,
  lng: number
): Promise<PrayerTime[]> {
  // TODO: Replace with real API call:
  // const res = await fetch(`${API_BASE}/prayer-times?lat=${lat}&lng=${lng}`);
  // if (!res.ok) throw new Error("Failed to fetch prayer times");
  // return res.json();
  await delay(350);
  return generateMockPrayerTimes(lat, lng);
}

/** Find the nearest wilaya/baladiya for GPS coordinates */
export async function findNearestLocation(
  lat: number,
  lng: number
): Promise<{ wilaya: Wilaya; baladiya: Baladiya } | null> {
  await delay(200);
  let nearestWilayaId = 16; // default Algiers
  let minDist = Infinity;
  for (const [id, coords] of Object.entries(WILAYA_COORDS)) {
    const dist = Math.hypot(coords.lat - lat, coords.lng - lng);
    if (dist < minDist) {
      minDist = dist;
      nearestWilayaId = Number(id);
    }
  }
  const wilaya = MOCK_WILAYAS.find((w) => w.id === nearestWilayaId);
  if (!wilaya) return null;
  const baladiyas = generateMockBaladiyas(nearestWilayaId);
  return { wilaya, baladiya: baladiyas[0] };
}
