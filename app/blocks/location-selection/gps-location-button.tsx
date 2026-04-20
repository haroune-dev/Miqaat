import { Navigation, Loader, CheckCircle } from "lucide-react";
import classnames from "classnames";
import style from "./gps-location-button.module.css";

export interface GPSLocationButtonProps {
  className?: string;
  isDetecting: boolean;
  isSuccess: boolean;
  onDetect: () => void;
}

export function GPSLocationButton({
  className,
  isDetecting,
  isSuccess,
  onDetect,
}: GPSLocationButtonProps) {
  return (
    <div className={classnames(style.root, className)}>
      <button
        className={classnames(
          style.btn,
          isDetecting && style.btnLoading,
          isSuccess && style.btnSuccess
        )}
        onClick={onDetect}
        disabled={isDetecting || isSuccess}
        aria-label="Detect my GPS location"
      >
        {isDetecting ? (
          <Loader size={20} className={style.spinner} />
        ) : isSuccess ? (
          <CheckCircle size={20} />
        ) : (
          <Navigation size={20} />
        )}
        {isDetecting
          ? "Detecting location..."
          : isSuccess
            ? "Location detected!"
            : "Use my GPS location"}
      </button>
    </div>
  );
}
