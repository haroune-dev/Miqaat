import { Sunrise, Sunset, Moon, Sparkles, Clock } from "lucide-react";
import classnames from "classnames";
import { useAppContext } from "~/context/app-context";
import { useLanguage } from "~/i18n/language-context";
import style from "./additional-info-section.module.css";
import { formatMinutesToTime } from "~/utils/time-utils";

function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}


export interface AdditionalInfoSectionProps {
  className?: string;
}


export function AdditionalInfoSection({ className }: AdditionalInfoSectionProps) {
  const { prayerTimes } = useAppContext();
  const { t } = useLanguage();

  const sunrise = prayerTimes.find((p) => p.name === "Sunrise");
  const maghrib = prayerTimes.find((p) => p.name === "Maghrib");
  const fajr = prayerTimes.find((p) => p.name === "Fajr");

  let midnightStr = "--:--";
  let lastThirdStr = "--:--";

  if (maghrib && fajr) {
    const maghribMin = parseTimeToMinutes(maghrib.time);
    let fajrMin = parseTimeToMinutes(fajr.time);

    if (fajrMin <= maghribMin) {
      fajrMin += 1440;
    }

    const nightDuration = fajrMin - maghribMin;

    const midnightMin = maghribMin + nightDuration / 2;
    const lastThirdMin = maghribMin + (2 * nightDuration) / 3;

    midnightStr = formatMinutesToTime(midnightMin);
    lastThirdStr = formatMinutesToTime(lastThirdMin);
  }

  return (
    <div className={classnames(style.root, className)}>
      {sunrise && (
        <div className={style.card}>
          <div className={style.iconBox}><Sunrise size={16} /></div>
          <div className={style.label}>{t("info.sunrise")}</div>
          <div className={style.value}>{formatMinutesToTime(parseTimeToMinutes(sunrise.time))}</div>
        </div>
      )}
      {maghrib && (
        <div className={style.card}>
          <div className={style.iconBox}><Sunset size={16} /></div>
          <div className={style.label}>{t("info.sunset")}</div>
          <div className={style.value}>{formatMinutesToTime(parseTimeToMinutes(maghrib.time))}</div>
        </div>
      )}
      <div className={style.card}>
        <div className={style.iconBox}><Clock size={16} /></div>
        <div className={style.label}>{t("info.midnight")}</div>
        <div className={style.value}>{midnightStr}</div>
      </div>
      <div className={style.card}>
        <div className={style.iconBox}><Sparkles size={16} /></div>
        <div className={style.label}>{t("info.lastThird")}</div>
        <div className={style.value}>{lastThirdStr}</div>
      </div>
    </div>
  );
}