import { Sunrise, Sunset, CalendarDays, Wind } from "lucide-react";
import classnames from "classnames";
import { useAppContext } from "~/context/app-context";
import { useClock } from "~/hooks/use-clock";
import style from "./additional-info-section.module.css";

export interface AdditionalInfoSectionProps {
  className?: string;
}

function formatTime(time: string, format: "12h" | "24h"): string {
  const [h, m] = time.split(":").map(Number);
  if (format === "24h") return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export function AdditionalInfoSection({ className }: AdditionalInfoSectionProps) {
  const { prayerTimes, timeFormat, location } = useAppContext();
  const { hijriDate } = useClock(timeFormat);

  const sunrise = prayerTimes.find((p) => p.name === "Sunrise");
  const maghrib = prayerTimes.find((p) => p.name === "Maghrib");

  return (
    <div className={classnames(style.root, className)}>
      {sunrise && (
        <div className={style.card}>
          <div className={style.iconBox}><Sunrise size={16} /></div>
          <div className={style.label}>Sunrise</div>
          <div className={style.value}>{formatTime(sunrise.time, timeFormat)}</div>
        </div>
      )}
      {maghrib && (
        <div className={style.card}>
          <div className={style.iconBox}><Sunset size={16} /></div>
          <div className={style.label}>Sunset</div>
          <div className={style.value}>{formatTime(maghrib.time, timeFormat)}</div>
        </div>
      )}
      <div className={style.card}>
        <div className={style.iconBox}><CalendarDays size={16} /></div>
        <div className={style.label}>Hijri Date</div>
        <div className={style.value} style={{ fontSize: "var(--text-base)" }}>{hijriDate}</div>
      </div>
      <div className={style.card}>
        <div className={style.iconBox}><Wind size={16} /></div>
        <div className={style.label}>Timezone</div>
        <div className={style.value} style={{ fontSize: "var(--text-sm)" }}>{location.timezone}</div>
      </div>
    </div>
  );
}
