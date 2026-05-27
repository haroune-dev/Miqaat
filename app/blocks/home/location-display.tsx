
import { MapPin, Navigation } from "lucide-react";
import classnames from "classnames";
import { useAppContext } from "~/context/app-context";
import { useLanguage } from "~/i18n/language-context";
import style from "./location-display.module.css";

export interface LocationDisplayProps {
  className?: string;
  onOpenModal: () => void;
}

export function LocationDisplay({ className, onOpenModal }: LocationDisplayProps) {
  const { location } = useAppContext();
  const { t, locale } = useLanguage();

  const city = locale === "ar" ? location.cityAr || location.city : location.city;
  const country = locale === "ar" ? location.countryAr || location.country : location.country;

  return (
    <div className={classnames(style.root, className)}>
      <div className={style.locationLink}>
        <div className={style.icon} aria-hidden="true">
          <MapPin size={22} strokeWidth={2.25} />
        </div>
        <div className={style.text}>
          <span className={style.label}>{t("location.current")}</span>
          <span className={style.city}>{city}</span>
          <span className={style.country}>{country}</span>
        </div>
      </div>

      <span className={style.divider} aria-hidden="true" />

      <button onClick={onOpenModal} className={style.changeBtn}>
        <span className={style.changeIcon} aria-hidden="true">
          <Navigation size={16} strokeWidth={2.25} />
        </span>
        <span className={style.changeLabel}>{t("location.change")}</span>
      </button>
    </div>
  );
}
