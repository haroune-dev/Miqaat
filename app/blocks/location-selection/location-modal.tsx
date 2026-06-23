import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const { t } = useLanguage();
  const { location, setLocation } = useAppContext();
  const locationState = useLocationSelection(location.cityId);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    return () => {
      previousFocusRef.current?.focus({ preventScroll: true });
      previousFocusRef.current = null;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const handleWilayaChange = useCallback(
    (wilaya: Wilaya) => {
      locationState.selectWilaya(wilaya);
      setLocation(wilayaToLocation(wilaya));
      handleClose();
    },
    [locationState, setLocation, handleClose],
  );

  const handleGPSDetect = useCallback(() => {
    locationState.detectGPSLocation();
  }, [locationState]);

  useEffect(() => {
    const loc = locationState.getSelectedLocation();
    if (!loc || loc.cityId === location.cityId) return;
    setLocation(loc);
    handleClose();
  }, [locationState.selectedWilaya, location.cityId, setLocation, locationState.getSelectedLocation, handleClose]);


  if (!mounted) return null;

  return createPortal(
    <div
      className={classnames(style.overlay, isOpen && style.open)}
      onClick={handleClose}
    >
      <div
        className={classnames(style.modal, isOpen && style.open)}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-modal-title"
      >
        <button
          className={style.closeBtn}
          onClick={handleClose}
          aria-label={t("common.cancel")}
        >
          <X size={20} />
        </button>

        <div className={style.header}>
          <h2 id="location-modal-title" className={style.title}>
            {t("settings.location")}
          </h2>
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
    </div>,
    document.body,
  );
}
