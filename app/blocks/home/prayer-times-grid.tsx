import { Moon, Sun, Cloud, Sunrise, Sunset, Star } from "lucide-react";
import classnames from "classnames";
import { useAppContext } from "~/context/app-context";
import style from "./prayer-times-grid.module.css";

export interface PrayerTimesGridProps {
  className?: string;
}

const PRAYER_ICONS: Record<string, React.ReactNode> = {
  moon: <Moon size={18} />,
  sun: <Sun size={18} />,
  sunrise: <Sunrise size={18} />,
  sunset: <Sunset size={18} />,
  "cloud-sun": <Cloud size={18} />,
  star: <Star size={18} />,
};

function formatTime(time: string, format: "12h" | "24h"): string {
  const [h, m] = time.split(":").map(Number);
  if (format === "24h") return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export function PrayerTimesGrid({ className }: PrayerTimesGridProps) {
  const { prayerTimes, currentPrayer, timeFormat } = useAppContext();

  return (
    <div className={classnames(style.root, className)}>
      <div className={style.sectionTitle}>Today&apos;s Prayer Schedule</div>
      {prayerTimes.map((prayer) => {
        const isActive = prayer.isPrayer && currentPrayer?.name === prayer.name;
        const isSunrise = prayer.name === "Sunrise";
        return (
          <div
            key={prayer.name}
            className={classnames(style.item, isActive && style.itemActive)}
          >
            <div className={style.itemLeft}>
              <div
                className={classnames(
                  style.iconBox,
                  isActive && style.iconBoxActive,
                  isSunrise && !isActive && style.iconBoxSunrise
                )}
              >
                {PRAYER_ICONS[prayer.icon] ?? <Star size={18} />}
              </div>
              <span className={style.prayerName}>
                {prayer.name}
                {isActive && <span className={style.badge}>Now</span>}
              </span>
            </div>
            <span
              className={classnames(
                style.prayerTime,
                isActive && style.prayerTimeActive,
                isSunrise && style.prayerTimeSunrise
              )}
            >
              {formatTime(prayer.time, timeFormat)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
