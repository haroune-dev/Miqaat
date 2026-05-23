import { Navigation, Loader } from "lucide-react";
import classnames from "classnames";
import { useLanguage } from "~/i18n/language-context";
import style from "./gps-location-button.module.css";

export interface GPSLocationButtonProps {
  className?: string;
  isDetecting: boolean;
  isSuccess: boolean;
  onDetect: () => void;
  onClear?: () => void;
}

export function GPSLocationButton({
  className,
  isDetecting,
  isSuccess,
  onDetect,
}: GPSLocationButtonProps) {
  const { t } = useLanguage();

  return (
    <div className={classnames(style.root, className)}>
      <button
        type="button"
        className={classnames(
          style.btn,
          isDetecting && style.btnLoading,
          isSuccess && style.btnSuccess,
        )}
        onClick={onDetect}
        disabled={isDetecting}
      >
        {isDetecting ? (
          <Loader size={20} className={style.spinner} aria-hidden="true" />
        ) : (
          <Navigation size={20} aria-hidden="true" />
        )}
        <span>
          {isDetecting ? t("location.gps.detecting") : t("location.gps.detect")}
        </span>
      </button>
    </div>
  );
}
