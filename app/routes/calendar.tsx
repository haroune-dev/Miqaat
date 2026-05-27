import { useState, useEffect, useCallback } from "react";
import { useAppContext } from "~/context/app-context";
import { useLanguage } from "~/i18n/language-context";
import { fetchMonthlyPrayerTimes, type DayPrayerTimes } from "~/services/api";
import { CalendarGrid } from "../blocks/calendar/calendar-grid";
import { LoadingSkeleton } from "~/components/loading-skeleton/loading-skeleton";
import styles from "./calendar.module.css";

type ViewMode = "weekly" | "monthly";

function getWeekRange(date: Date): { start: number; end: number } {
  const dayOfWeek = date.getDay(); // 0=Sun
  const dateNum = date.getDate();
  const start = dateNum - dayOfWeek;
  const end = start + 6;
  return { start, end };
}

export default function Calendar() {
  const { location } = useAppContext();
  const { t, locale } = useLanguage();
  const [monthData, setMonthData] = useState<DayPrayerTimes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchMonthlyPrayerTimes(
      location.cityId,
      currentDate.getFullYear(),
      currentDate.getMonth(),
    ).then((data) => {
      if (!cancelled) {
        setMonthData(data);
        setIsLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setError(t("calendar.error") ?? "Failed to load calendar data.");
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [location, currentDate.getFullYear(), currentDate.getMonth(), retryCount, t]);

  const monthName = currentDate.toLocaleDateString(
    locale === "ar" ? "ar-DZ" : "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  const handlePrev = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === "weekly") {
        d.setDate(d.getDate() - 7);
      } else {
        d.setMonth(d.getMonth() - 1);
      }
      return d;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === "weekly") {
        d.setDate(d.getDate() + 7);
      } else {
        d.setMonth(d.getMonth() + 1);
      }
      return d;
    });
  };

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Filter data based on view mode
  const displayData = viewMode === "weekly"
    ? (() => {
      const { start, end } = getWeekRange(currentDate);
      return monthData.filter((d) => d.day >= start && d.day <= end);
    })()
    : monthData;

  const title = viewMode === "weekly" ? t("calendar.weekTitle") : t("calendar.monthlyTitle");

  return (
    <main className={styles.root}>
      <h1 className={styles.pageTitle}>{title}</h1>

      {/* View mode toggle + Print */}
      <div className={styles.toolbar}>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleBtn} ${viewMode === "weekly" ? styles.toggleBtnActive : ""}`}
            onClick={() => setViewMode("weekly")}
          >
            {t("calendar.weekly")}
          </button>
          <button
            className={`${styles.toggleBtn} ${viewMode === "monthly" ? styles.toggleBtnActive : ""}`}
            onClick={() => setViewMode("monthly")}
          >
            {t("calendar.monthly")}
          </button>
        </div>
        <button className={styles.printBtn} onClick={handlePrint} aria-label="Print">
          <span className={styles.printer} aria-hidden="true">
            <span className={styles.paper}>
              <svg viewBox="0 0 8 8" className={styles.printerSvg}>
                <path
                  fill="#0077FF"
                  d="M6.28951 1.3867C6.91292 0.809799 7.00842 0 7.00842 0C7.00842 0 6.45246 0.602112 5.54326 0.602112C4.82505 0.602112 4.27655 0.596787 4.07703 0.595012L3.99644 0.594302C1.94904 0.594302 0.290039 2.25224 0.290039 4.29715C0.290039 6.34206 1.94975 8 3.99644 8C6.04312 8 7.70284 6.34206 7.70284 4.29715C7.70347 3.73662 7.57647 3.18331 7.33147 2.67916C7.08647 2.17502 6.7299 1.73327 6.2888 1.38741L6.28951 1.3867ZM3.99679 6.532C2.76133 6.532 1.75875 5.53084 1.75875 4.29609C1.75875 3.06133 2.76097 2.06018 3.99679 2.06018C4.06423 2.06014 4.13163 2.06311 4.1988 2.06905L4.2414 2.07367C4.25028 2.07438 4.26057 2.0758 4.27406 2.07651C4.81533 2.1436 5.31342 2.40616 5.67465 2.81479C6.03589 3.22342 6.23536 3.74997 6.23554 4.29538C6.23554 5.53084 5.23439 6.532 3.9975 6.532H3.99679Z"
                />
                <path
                  fill="#0055BB"
                  d="M6.756 1.82386C6.19293 2.09 5.58359 2.24445 4.96173 2.27864C4.74513 2.17453 4.51296 2.10653 4.27441 2.07734C4.4718 2.09225 5.16906 2.07947 5.90892 1.66374C6.04642 1.58672 6.1743 1.49364 6.28986 1.38647C6.45751 1.51849 6.61346 1.6647 6.756 1.8235V1.82386Z"
                />
              </svg>
            </span>
            <span className={styles.dot}></span>
            <span className={styles.output}>
              <span className={styles.paperOut}></span>
            </span>
          </span>
          <span>{t("calendar.print")}</span>
        </button>
      </div>

      <div className={styles.monthNav}>
        <button className={styles.monthBtn} onClick={handlePrev} aria-label="Previous">
          <div className={styles.buttonTop}>
            <span>‹</span>
          </div>
          <div className={styles.buttonBottom} />
          <div className={styles.buttonBase} />
        </button>
        <span className={styles.monthLabel}>{monthName}</span>
        <button className={styles.monthBtn} onClick={handleNext} aria-label="Next">
          <div className={styles.buttonTop}>
            <span>›</span>
          </div>
          <div className={styles.buttonBottom} />
          <div className={styles.buttonBase} />
        </button>
      </div>
      {isLoading ? (
        <LoadingSkeleton rows={10} />
      ) : error ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
          <button
            className={styles.retryBtn}
            onClick={() => setRetryCount(c => c + 1)}
          >
            {t("error.retry")}
          </button>
        </div>
      ) : (
        <CalendarGrid data={displayData} />
      )}
    </main>
  );
}
