import { useState, useRef } from "react";
import { useAppContext } from "~/context/app-context";
import { useLanguage } from "~/i18n/language-context";
import { LoadingSkeleton } from "~/components/loading-skeleton/loading-skeleton";
import { LocationDisplay } from "../blocks/home/location-display";
import { CurrentTimeCard } from "../blocks/home/current-time-card";
import { CurrentPrayerHighlight } from "../blocks/home/current-prayer-highlight";
import { NextPrayerCountdown } from "../blocks/home/next-prayer-countdown";
import { PrayerTimesGrid } from "../blocks/home/prayer-times-grid";
import { AdditionalInfoSection } from "../blocks/home/additional-info-section";
import { LocationModal } from "../blocks/location-selection/location-modal";
import styles from "./home.module.css";

export default function Home() {
  const { isLoading, error, refreshPrayerTimes } = useAppContext();
  const { t } = useLanguage();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const locationBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <main className={styles.root}>
      <LocationDisplay isModalOpen={isLocationModalOpen} onOpenModal={() => setIsLocationModalOpen(true)} buttonRef={locationBtnRef} />
      <CurrentTimeCard />
      {isLoading ? (
        <LoadingSkeleton rows={6} />
      ) : error ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
          <button
            className={styles.retryBtn}
            onClick={() => refreshPrayerTimes()}
          >
            {t("error.retry")}
          </button>
        </div>
      ) : (
        <>
          <div className={styles.topGrid}>
            <CurrentPrayerHighlight />
            <NextPrayerCountdown />
          </div>
          <PrayerTimesGrid />
          <AdditionalInfoSection />
        </>
      )}

      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
        buttonRef={locationBtnRef}
      />
    </main>
  );
}
