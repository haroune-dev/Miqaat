import { Moon, Sun, Cloud, Sunrise, Sunset, Star } from "lucide-react";
import classnames from "classnames";
import { useAppContext } from "~/context/app-context";
import style from "./current-prayer-highlight.module.css";

export interface CurrentPrayerHighlightProps {
  className?: string;
}

const PRAYER_ICONS: Record<string, React.ReactNode> = {
  moon: <Moon size={22} />,
  sun: <Sun size={22} />,
  sunrise: <Sunrise size={22} />,
  sunset: <Sunset size={22} />,
  "cloud-sun": <Cloud size={22} />,
  star: <Star size={22} />,
};

function formatTime(time: string, format: "12h" | "24h"): string {
  const [h, m] = time.split(":").map(Number);
  if (format === "24h") return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export function CurrentPrayerHighlight({ className }: CurrentPrayerHighlightProps) {
  const { currentPrayer, timeFormat } = useAppContext();

  if (!currentPrayer) return null;

  return (
    <div className={classnames(style.root, className)}>
      <div className={style.left}>
        <div className={style.iconWrapper}>
          {PRAYER_ICONS[currentPrayer.icon] ?? <Star size={22} />}
        </div>
        <div>
          <div className={style.label}>Current Prayer</div>
          <div className={style.name}>{currentPrayer.name}</div>
        </div>
      </div>
      <div className={style.right}>
        <div className={style.timeLabel}>Prayer Time</div>
        <div className={style.time}>{formatTime(currentPrayer.time, timeFormat)}</div>
      </div>
    </div>
  );
}
