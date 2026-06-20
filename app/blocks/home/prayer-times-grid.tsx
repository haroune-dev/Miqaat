import classnames from "classnames";
import { useAppContext } from "~/context/app-context";
import { useLanguage } from "~/i18n/language-context";
import type { TranslationKey } from "~/i18n/translations";
import style from "./prayer-times-grid.module.css";
import { formatTime } from "~/utils/time-utils";
import { renderPrayerIcon } from "./prayer-icons";


export interface PrayerTimesGridProps {
  className?: string;
}

export function PrayerTimesGrid({ className }: PrayerTimesGridProps) {
  const { prayerTimes, currentPrayer } = useAppContext();
  const { t } = useLanguage();

  const mainPrayers = ["Fajr", "Duha", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const displayPrayers = prayerTimes.filter((p) => mainPrayers.includes(p.name));

  return (
    <div className={classnames(style.wrapper, className)}>
      <h2 className={style.sectionTitle}>{t("home.schedule")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full max-w-[1400px]">
        {displayPrayers.map((prayer) => {
          const isActive = prayer.isPrayer && currentPrayer?.name === prayer.name;
          const prayerKey = `prayer.${prayer.name}` as TranslationKey;

          return (
            <div
              key={prayer.name}
              className={classnames(
                "relative flex flex-col items-center justify-center p-4 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
                isActive
                  ? style.cardActive
                  : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
              )}
            >
              {isActive && (
                <div className={style.activeBadge}>
                  {t("home.now")}
                </div>
              )}
              <div className={style.iconWrapper}>
                {renderPrayerIcon(prayer.icon)}
              </div>
              <div className={style.prayerName}>
                {t(prayerKey)}
              </div>
              <div className={style.prayerTime}>
                <span dir="ltr">{formatTime(prayer.time)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
