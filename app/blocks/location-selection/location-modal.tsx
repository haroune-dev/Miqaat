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
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
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

export function LocationModal({ isOpen, onClose, buttonRef }: LocationModalProps) {
  const { t } = useLanguage();
  const { location, setLocation } = useAppContext();
  const locationState = useLocationSelection(location.cityId);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isAutoHeight, setIsAutoHeight] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    setShowContent(false);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    closeTimerRef.current = setTimeout(() => {
      setOriginRect(null);
    }, 400);
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

  useEffect(() => {
    if (isOpen) {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      const rect = buttonRef?.current?.getBoundingClientRect();
      if (rect) {
        setOriginRect(rect);
        rafRef.current = requestAnimationFrame(() => setIsExpanded(true));
      }
      const showTimer = setTimeout(() => setShowContent(true), 30); 
      const autoHeightTimer = setTimeout(() => setIsAutoHeight(true), 405);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(autoHeightTimer);
        cancelAnimationFrame(rafRef.current);
      };
    } else {
      setIsExpanded(false);
      setIsAutoHeight(false);
    }
  }, [isOpen, buttonRef]);

  if (!mounted) return null;
  if (!originRect) return null;

  const modalWidth = Math.min(480, (window.innerWidth || 480) - 32);
  const modalHeight = Math.min((window.innerHeight || 600) * 0.9, 380);
  const centerX = ((window.innerWidth || 480) - modalWidth) / 2;
  const centerY = ((window.innerHeight || 600) - modalHeight) / 2;

  const morphStyle = isExpanded
    ? {
        width: modalWidth,
        height: modalHeight,
        left: centerX,
        top: centerY,
        borderRadius: "var(--radius-xl)",
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
      }
    : {
        width: (originRect?.width || 40) + "px",
        height: (originRect?.height || 40) + "px",
        left: (originRect?.left || 0) + "px",
        top: (originRect?.top || 0) + "px",
        borderRadius: "50%",
        backgroundColor: "transparent",
        borderColor: "transparent",
        boxShadow: "none",
      };

  return createPortal(
    <>
      <div className={classnames(style.backdrop, isExpanded && style.backdropVisible)} onClick={handleClose} />
      <div
        className={style.morphContainer}
        style={morphStyle}
        onClick={(e) => {
          if (!isExpanded) return;
          if (!(e.target as HTMLElement).closest("[data-morph-content]")) {
            handleClose();
          }
        }}
      >
      <div
        data-morph-content
        ref={null}
        className={classnames(style.content, showContent && style.contentVisible)}
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
    </div>
    </>,
    document.body,
  );
}
