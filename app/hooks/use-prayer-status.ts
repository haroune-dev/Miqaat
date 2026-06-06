import { useState, useEffect } from "react";
import type { PrayerTime } from "~/data/prayer-data";

export type PrayerStatus = "forbidden" | "duha" | null;

export function usePrayerStatus(prayerTimes: PrayerTime[]): PrayerStatus {
  const [status, setStatus] = useState<PrayerStatus>(null);

  useEffect(() => {
    if (prayerTimes.length === 0) return;

    const sunrise = prayerTimes.find((p) => p.name === "Sunrise");
    const dhuhr = prayerTimes.find((p) => p.name === "Dhuhr");
    if (!sunrise || !dhuhr) return;

    const [sunH, sunM] = sunrise.time.split(":").map(Number);
    const sunriseMinutes = sunH * 60 + sunM;

    const [dhuH, dhuM] = dhuhr.time.split(":").map(Number);
    const dhuhrMinutes = dhuH * 60 + dhuM;

    const calc = () => {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      if (nowMinutes >= sunriseMinutes && nowMinutes < sunriseMinutes + 15) {
        setStatus("forbidden");
      } else if (nowMinutes >= sunriseMinutes + 15 && nowMinutes < dhuhrMinutes - 15) {
        setStatus("duha");
      } else if (nowMinutes >= dhuhrMinutes - 15 && nowMinutes < dhuhrMinutes) {
        setStatus("forbidden");
      } else {
        setStatus(null);
      }
    };

    calc();
    const interval = setInterval(calc, 15000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  return status;
}
