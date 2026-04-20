import { Clock } from "lucide-react";
import classnames from "classnames";
import { useAppContext } from "~/context/app-context";
import { useCountdown } from "~/hooks/use-countdown";
import style from "./next-prayer-countdown.module.css";

export interface NextPrayerCountdownProps {
  className?: string;
}

function formatTime(time: string, format: "12h" | "24h"): string {
  const [h, m] = time.split(":").map(Number);
  if (format === "24h") return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export function NextPrayerCountdown({ className }: NextPrayerCountdownProps) {
  const { nextPrayer, timeFormat } = useAppContext();
  const { hours, minutes, seconds } = useCountdown(nextPrayer?.time ?? null);

  if (!nextPrayer) return null;

  return (
    <div className={classnames(style.root, className)}>
      <div className={style.header}>
        <Clock size={14} />
        <span className={style.headerLabel}>Next Prayer</span>
      </div>
      <div className={style.prayerName}>{nextPrayer.name}</div>
      <div className={style.countdown}>
        <div className={style.unit}>
          <span className={style.digits}>{hours}</span>
          <span className={style.unitLabel}>Hours</span>
        </div>
        <span className={style.separator}>:</span>
        <div className={style.unit}>
          <span className={style.digits}>{minutes}</span>
          <span className={style.unitLabel}>Minutes</span>
        </div>
        <span className={style.separator}>:</span>
        <div className={style.unit}>
          <span className={style.digits}>{seconds}</span>
          <span className={style.unitLabel}>Seconds</span>
        </div>
      </div>
      <div className={style.prayerTime}>
        Starts at <strong>{formatTime(nextPrayer.time, timeFormat)}</strong>
      </div>
    </div>
  );
}
