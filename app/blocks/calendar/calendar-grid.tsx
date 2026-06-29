import { useRef, useState, useEffect } from "react";
import classnames from "classnames";
import type { DayPrayerTimes } from "~/services/api";
import { useLanguage } from "~/i18n/language-context";
import type { TranslationKey } from "~/i18n/translations";
import style from "./calendar-grid.module.css";
import { formatTime } from "~/utils/time-utils";


export interface CalendarGridProps {
  className?: string;
  data: DayPrayerTimes[];
}

const PRAYER_COLUMNS = ["Fajr", "Sunrise", "Duha", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;


export function CalendarGrid({ className, data }: CalendarGridProps) {
  const { t, locale } = useLanguage();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showRightIndicator, setShowRightIndicator] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const hasOverflow = scrollWidth > clientWidth;

      if (!hasOverflow) {
        setShowRightIndicator(false);
        return;
      }

      const maxScroll = scrollWidth - clientWidth;
      const currentScroll = Math.abs(scrollLeft);
      const isAtEnd = currentScroll >= maxScroll - 15;

      setShowRightIndicator(!isAtEnd);
    };

    el.addEventListener("scroll", handleScroll);
    handleScroll();

    const resizeObserver = new ResizeObserver(() => {
      handleScroll();
    });
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [data, locale]);

  return (
    <div className={classnames(style.root, className)}>
      <div className={style.indicatorWrapper}>
        {showRightIndicator && (
          <div className={style.scrollShadow} />
        )}
        <div className={style.cardContainer}>
          <div ref={wrapperRef} className={style.tableWrapper}>
          <table className={style.table} dir={locale === "ar" ? "rtl" : "ltr"}>
            <thead>
              <tr className={style.headerRow}>
                <th className={classnames(style.th, style.dayTh)}>{t("calendar.day")}</th>
                {PRAYER_COLUMNS.map((name) => {
                  const key = `prayer.${name}` as TranslationKey;
                  return (
                    <th key={name} className={style.th}>
                      {t(key)}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className={style.tbody}>
              {data.map((row) => {
                const isToday = row.date === todayStr;
                return (
                  <tr
                    key={row.date}
                    className={classnames(style.row, isToday && style.rowToday)}
                  >
                    <td className={classnames(style.td, style.dayCell)}>
                      <div className={style.dayInfo}>
                        <span className={style.dayName}>
                          {new Date(row.date).toLocaleDateString(locale === "ar" ? "ar-DZ" : "en-US", { weekday: "long" })}
                        </span>
                        <span className={style.dateText}>
                          {new Date(row.date).toLocaleDateString(locale === "ar" ? "ar-DZ" : "en-US", { day: "numeric", month: "long" })}
                        </span>
                      </div>
                      {isToday && <span className={style.todayBadge}>{t("calendar.today")}</span>}
                    </td>
                    {PRAYER_COLUMNS.map((name) => {
                      const prayer = row.times.find((p) => p.name === name);
                      return (
                        <td key={name} className={style.td}>
                          {prayer ? formatTime(prayer.time) : "—"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
}
