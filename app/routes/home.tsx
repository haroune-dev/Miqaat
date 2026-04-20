import { useAppContext } from "~/context/app-context";
import { LoadingSkeleton } from "~/components/loading-skeleton/loading-skeleton";
import { LocationDisplay } from "../blocks/home/location-display";
import { CurrentTimeCard } from "../blocks/home/current-time-card";
import { CurrentPrayerHighlight } from "../blocks/home/current-prayer-highlight";
import { NextPrayerCountdown } from "../blocks/home/next-prayer-countdown";
import { PrayerTimesGrid } from "../blocks/home/prayer-times-grid";
import { AdditionalInfoSection } from "../blocks/home/additional-info-section";
import styles from "./home.module.css";

export default function Home() {
  const { isLoading, error } = useAppContext();

  return (
    <main className={styles.root}>
      <LocationDisplay />
      <CurrentTimeCard />
      {isLoading ? (
        <LoadingSkeleton rows={6} />
      ) : error ? (
        <div className={styles.error} role="alert">{error}</div>
      ) : (
        <>
          <CurrentPrayerHighlight />
          <NextPrayerCountdown />
          <PrayerTimesGrid />
          <AdditionalInfoSection />
        </>
      )}
    </main>
  );
}
