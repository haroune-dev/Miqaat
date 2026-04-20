export type PrayerName = "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export interface PrayerTime {
  name: PrayerName;
  time: string; // "HH:MM" 24h
  label: string;
  icon: string;
  isPrayer: boolean; // false for Sunrise
}

export interface Location {
  city: string;
  country: string;
  timezone: string;
  latitude: number;
  longitude: number;
}

export type CalculationMethod =
  | "ISNA"
  | "MWL"
  | "Karachi"
  | "Umm Al-Qura"
  | "Egyptian"
  | "Gulf";

export interface CalculationMethodInfo {
  id: CalculationMethod;
  name: string;
  description: string;
  region: string;
}

export const CALCULATION_METHODS: CalculationMethodInfo[] = [
  {
    id: "ISNA",
    name: "ISNA",
    description: "Islamic Society of North America",
    region: "North America",
  },
  {
    id: "MWL",
    name: "MWL",
    description: "Muslim World League",
    region: "Europe, Far East",
  },
  {
    id: "Karachi",
    name: "Karachi / Hanafi",
    description: "University of Islamic Sciences, Karachi",
    region: "Pakistan, Bangladesh, India",
  },
  {
    id: "Umm Al-Qura",
    name: "Umm Al-Qura",
    description: "Umm Al-Qura University, Makkah",
    region: "Arabian Peninsula",
  },
  {
    id: "Egyptian",
    name: "Egyptian",
    description: "Egyptian General Authority of Survey",
    region: "Africa, Syria",
  },
  {
    id: "Gulf",
    name: "Gulf Region",
    description: "Gulf Region standard method",
    region: "Gulf Countries",
  },
];

export interface Wilaya {
  id: number;
  name: string;
  nameAr: string;
}

export interface Baladiya {
  id: number;
  name: string;
  nameAr: string;
  wilayaId: number;
  latitude: number;
  longitude: number;
}
