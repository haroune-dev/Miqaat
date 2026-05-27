import { useCallback, useEffect, useState } from "react";
import { MapPin, X } from "lucide-react";
import classnames from "classnames";
import type { Location, Wilaya } from "~/data/prayer-data";
import { useLanguage } from "~/i18n/language-context";
import { useLocationSelection } from "~/hooks/use-location-selection";
import { useAppContext } from "~/context/app-context";
import { GPSLocationButton } from "./gps-location-button";
import { WilayaSelector } from "./wilaya-baladiya-selector";
import { Toast } from "~/components/toast/toast";
import style from "./location-modal.module.css";

export interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const { t, locale } = useLanguage();
  const { location, setLocation } = useAppContext();
  const locationState = useLocationSelection(location.cityId);

  // Close when pressing Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleWilayaChange = useCallback(
    (wilaya: Wilaya) => {
      locationState.selectWilaya(wilaya);
      setLocation(wilayaToLocation(wilaya));
      onClose();
    },
    [locationState, setLocation, onClose],
  );

  const handleGPSDetect = useCallback(() => {
    locationState.detectGPSLocation();
  }, [locationState]);

  // When GPS location is successfully detected and we have a new location
  useEffect(() => {
    const loc = locationState.getSelectedLocation();
    if (!loc || loc.cityId === location.cityId) return;
    setLocation(loc);
    onClose();
  }, [locationState.selectedWilaya, location.cityId, setLocation, locationState.getSelectedLocation, onClose]);


  const city = locale === "ar" ? location.cityAr || location.city : location.city;
  const country = locale === "ar" ? location.countryAr || location.country : location.country;

  return (
    <div 
      className={classnames(style.overlay, { [style.open]: isOpen })} 
      aria-hidden={!isOpen}
      onClick={onClose}
    >
      <div 
        className={classnames(style.modal, { [style.open]: isOpen })}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-modal-title"
      >
        <button 
          className={style.closeBtn} 
          onClick={onClose}
          aria-label={t("common.cancel")}
        >
          <X size={20} />
        </button>

        <div className={style.header}>
          <h2 id="location-modal-title" className={style.title}>
            {t("settings.location")}
          </h2>
          <p className={style.desc}>{t("settings.location.desc")}</p>
        </div>

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
      </div>
    </div>
  );
}
