import { useCallback, useEffect } from "react";
import { MapPin } from "lucide-react";
import classnames from "classnames";
import type { Location, Wilaya } from "~/data/prayer-data";
import { useLanguage } from "~/i18n/language-context";
import { useLocationSelection } from "~/hooks/use-location-selection";
import { GPSLocationButton } from "../location-selection/gps-location-button";
import { WilayaSelector } from "../location-selection/wilaya-baladiya-selector";
import { Toast } from "~/components/toast/toast";
import style from "./location-settings.module.css";

export interface LocationSettingsProps {
  className?: string;
  draftLocation: Location;
  onLocationChange: (location: Location) => void;
}

function wilayaToLocation(wilaya: Wilaya): Location {
  return {
    city: wilaya.name,
    cityAr: wilaya.nameAr,
    country: "Algeria",
    countryAr: "الجزائر",
    timezone: "Africa/Algiers",
    latitude: wilaya.latitude,
    longitude: wilaya.longitude,
    cityId: wilaya.cityId,
  };
}

export function LocationSettings({
  className,
  draftLocation,
  onLocationChange,
}: LocationSettingsProps) {
  const { t, locale } = useLanguage();
  const locationState = useLocationSelection(draftLocation.cityId);

  const city =
    locale === "ar" ? draftLocation.cityAr || draftLocation.city : draftLocation.city;
  const country =
    locale === "ar"
      ? draftLocation.countryAr || draftLocation.country
      : draftLocation.country;

  const handleWilayaChange = useCallback(
    (wilaya: Wilaya) => {
      locationState.selectWilaya(wilaya);
      onLocationChange(wilayaToLocation(wilaya));
    },
    [locationState, onLocationChange],
  );

  const handleGPSDetect = useCallback(() => {
    locationState.detectGPSLocation();
  }, [locationState]);

  useEffect(() => {
    const loc = locationState.getSelectedLocation();
    if (!loc || loc.cityId === draftLocation.cityId) return;
    onLocationChange(loc);
  }, [locationState.selectedWilaya, draftLocation.cityId, onLocationChange, locationState.getSelectedLocation]);

  return (
    <section
      id="location"
      className={classnames(style.root, className)}
      aria-labelledby="settings-location-title"
    >
      <h2 id="settings-location-title" className={style.sectionTitle}>
        {t("settings.location")}
      </h2>
      <p className={style.sectionDesc}>{t("settings.location.desc")}</p>

      <div className={style.currentLocation}>
        <div className={style.currentIcon} aria-hidden="true">
          <MapPin size={20} />
        </div>
        <div className={style.currentText}>
          <span className={style.currentLabel}>{t("settings.location.current")}</span>
          <span className={style.currentCity}>{city}</span>
          <span className={style.currentCountry}>{country}</span>
        </div>
      </div>

      <div className={style.body}>
        <GPSLocationButton
          isDetecting={locationState.isDetectingGPS}
          isSuccess={false}
          onDetect={handleGPSDetect}
          onClear={locationState.clearSelection}
        />

        <div className={style.divider} role="separator">
          {t("location.or")}
        </div>

        <WilayaSelector
          wilayas={locationState.wilayas}
          selectedWilaya={locationState.selectedWilaya}
          isLoadingWilayas={locationState.isLoadingWilayas}
          onWilayaChange={handleWilayaChange}
          onConfirm={() => {}}
          canConfirm={locationState.selectedWilaya !== null}
          fetchError={locationState.fetchError}
          onRetry={locationState.retryFetch}
          onClear={locationState.clearSelection}
          hideConfirm
        />
      </div>

      {locationState.gpsError && (
        <Toast
          message={locationState.gpsError}
          title={t("location.gps.error.title")}
          type="error"
          onClose={locationState.clearGpsError}
        />
      )}
    </section>
  );
}
