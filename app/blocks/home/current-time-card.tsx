import { useState, useEffect } from "react";
import classnames from "classnames";
import { useClock } from "~/hooks/use-clock";
import { useLanguage } from "~/i18n/language-context";
import { fetchHijriDate, type HijriDateInfo } from "~/services/api";
import style from "./current-time-card.module.css";

export interface CurrentTimeCardProps {
  className?: string;
}

export function CurrentTimeCard({ className }: CurrentTimeCardProps) {
  const { locale } = useLanguage();
  const clock = useClock(locale);
  const [hijriInfo, setHijriInfo] = useState<HijriDateInfo | null>(null);

  useEffect(() => {
    fetchHijriDate().then(setHijriInfo).catch(() => {});
  }, []);

  const hijriDate = locale === "ar" && hijriInfo
    ? hijriInfo.formattedAr
    : clock.hijriDate;

  return (
    <div className={classnames(style.root, "transition-all duration-300 hover:shadow-xl hover:-translate-y-1", className)}>
      <div className={style.timeWrapper}>
        <div
          className={style.time}
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: "6px",
            direction: "ltr"
          }}
        >
          <span dir="ltr">{clock.timeOnly}</span>
        </div>
        <div className={style.hijri}>{hijriDate}</div>
      </div>
      <div className={style.diamond} />
    </div>
  );
}
