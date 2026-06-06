const API_BASE = "https://adhan-dz.dexter21767.com";

export interface ApiCity {
  _id: number;
  ParentId: number | null;
  MADINA_NAME: string;
}

export interface ApiPrayerTimesEntry {
  _id: number;
  MADINA_ID: number;
  GeoDate: string;
  Fajr: string;
  Shurooq: string;
  Kibla: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public endpoint?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(res: Response, endpoint: string): Promise<T> {
  if (!res.ok) {
    let message = `API request failed: ${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
    }
    throw new ApiError(message, res.status, endpoint);
  }
  return res.json() as Promise<T>;
}

export async function fetchCities(): Promise<ApiCity[]> {
  const endpoint = "/cities";
  const res = await fetch(`${API_BASE}${endpoint}`);
  return handleResponse<ApiCity[]>(res, endpoint);
}

export async function fetchDailyPrayerTimes(
  cityId: number,
  date?: string,
): Promise<ApiPrayerTimesEntry[]> {
  const d = date ?? formatDate(new Date());
  const endpoint = `/prayerTimes?cityId=${cityId}&date=${d}`;
  const res = await fetch(`${API_BASE}${endpoint}`);
  return handleResponse<ApiPrayerTimesEntry[]>(res, endpoint);
}

export async function fetchPrayerTimesRange(
  cityId: number,
  startDate: string,
  endDate: string,
): Promise<ApiPrayerTimesEntry[]> {
  const endpoint = `/prayerTimes?cityId=${cityId}&startDate=${startDate}&endDate=${endDate}`;
  const res = await fetch(`${API_BASE}${endpoint}`);
  return handleResponse<ApiPrayerTimesEntry[]>(res, endpoint);
}

export function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
