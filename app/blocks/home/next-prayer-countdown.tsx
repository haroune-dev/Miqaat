import { Clock } from "lucide-react";
import classnames from "classnames";
import { useAppContext } from "~/context/app-context";
import { useCountdown } from "~/hooks/use-countdown";
import { useLanguage } from "~/i18n/language-context";
import type { TranslationKey } from "~/i18n/translations";
import style from "./next-prayer-countdown.module.css";
import { formatTime } from "~/utils/time-utils";


export interface NextPrayerCountdownProps {
  className?: string;
}


export function NextPrayerCountdown({ className }: NextPrayerCountdownProps) {
  const { nextPrayer } = useAppContext();
  const { hours, minutes, seconds } = useCountdown(nextPrayer?.time ?? null);
  const { t } = useLanguage();

  if (!nextPrayer) return null;

  const prayerKey = `prayer.${nextPrayer.name}` as TranslationKey;
  const prayerName = t(prayerKey);

  return (
    <div className={classnames(style.root, "transition-all duration-300 hover:shadow-xl hover:-translate-y-1", className)}>
      <div className={style.header}>
        <Clock size={18} />
        <span className={style.headerLabel}>{t("home.nextPrayer")}</span>
      </div>

      <div className={style.content}>
        <div className={style.prayerName}>{prayerName}</div>
        <div className={style.countdownLabel}>{t("home.remainingTime")}</div>
        <div className={style.countdown} dir="ltr">
          {hours !== "00" && (
            <>
              <div className={style.unit}>
                <span className={style.digits}>{hours}</span>
                <span className={style.unitLabel}>{t("home.hours")}</span>
              </div>
              <span className={style.separator}>:</span>
            </>
          )}
          {(hours !== "00" || minutes !== "00") && (
            <>
              <div className={style.unit}>
                <span className={style.digits}>{minutes}</span>
                <span className={style.unitLabel}>{t("home.minutes")}</span>
              </div>
              <span className={style.separator}>:</span>
            </>
          )}
          <div className={style.unit}>
            <span className={style.digits}>{seconds}</span>
            <span className={style.unitLabel}>{t("home.seconds")}</span>
          </div>
        </div>
      </div>

      <div className={style.footer}>
        <div className={style.prayerTime}>
          <span>{t("home.startsAt")}</span>
          <strong>
            <span dir="ltr">{formatTime(nextPrayer.time)}</span>
          </strong>
        </div>
      </div>
    </div>
  );
}
