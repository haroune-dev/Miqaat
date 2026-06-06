import { useEffect, useRef, useCallback } from "react";
import type { PrayerTime } from "~/data/prayer-data";

export function useNotifications(
  prayerTimes: PrayerTime[],
  enabled: boolean,
  preferences: Record<string, boolean> = {},
): void {
  const firedNotifications = useRef<Set<string>>(new Set());

  const checkAndFireNotifications = useCallback(() => {
    if (!enabled || prayerTimes.length === 0) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const now = new Date();
    const nowMs = now.getTime();
    const todayStr = now.toISOString().split("T")[0];

    for (const prayer of prayerTimes) {
      if (!prayer.isPrayer) continue;
      if (preferences[prayer.name] === false) continue;

      const [h, m] = prayer.time.split(":").map(Number);
      const target = new Date();
      target.setHours(h, m, 0, 0);

      const notifyMs = target.getTime() - 60_000;
      const delay = nowMs - notifyMs;
      const uniqueKey = `${todayStr}-${prayer.name}`;

      if (delay >= 0 && delay < 5 * 60_000) {
        if (!firedNotifications.current.has(uniqueKey)) {
          new Notification("Prayer Time Approaching", {
            body: `${prayer.name} prayer in 1 minute`,
            icon: "/logo.jpg",
            tag: `prayer-${prayer.name}`,
          });
          firedNotifications.current.add(uniqueKey);
        }
      }
    }
  }, [prayerTimes, enabled, preferences]);

  useEffect(() => {
    if (!enabled) return;

    checkAndFireNotifications();

    const intervalId = setInterval(checkAndFireNotifications, 10_000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkAndFireNotifications();
      }
    };

    window.addEventListener("focus", checkAndFireNotifications);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", checkAndFireNotifications);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [checkAndFireNotifications, enabled]);
}
