import { Link } from "react-router";
import { MapPin, Navigation } from "lucide-react";
import classnames from "classnames";
import { useAppContext } from "~/context/app-context";
import style from "./location-display.module.css";

export interface LocationDisplayProps {
  className?: string;
}

export function LocationDisplay({ className }: LocationDisplayProps) {
  const { location } = useAppContext();
  return (
    <div className={classnames(style.root, className)}>
      <div className={style.locationInfo}>
        <div className={style.icon}>
          <MapPin size={20} />
        </div>
        <div className={style.text}>
          <span className={style.city}>{location.city}</span>
          <span className={style.country}>{location.country}</span>
        </div>
      </div>
      <Link to="/location" className={style.changeBtn} aria-label="Change prayer location">
        <Navigation size={14} />
        Change Location
      </Link>
    </div>
  );
}
