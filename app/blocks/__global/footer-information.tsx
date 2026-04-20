import { Moon } from "lucide-react";
import classnames from "classnames";
import style from "./footer-information.module.css";

export interface FooterInformationProps {
  className?: string;
}

export function FooterInformation({ className }: FooterInformationProps) {
  const year = new Date().getFullYear();
  return (
    <div className={classnames(style.root, className)}>
      <div className={style.inner}>
        <div className={style.brand}>
          <Moon size={16} />
          Prayer<span className={style.brandAccent}>Times</span>
        </div>
        <div className={style.links}>
          <a href="#" className={style.link}>Privacy Policy</a>
          <span className={style.divider} aria-hidden>|</span>
          <a href="#" className={style.link}>Terms of Service</a>
          <span className={style.divider} aria-hidden>|</span>
          <a href="#" className={style.link}>About</a>
        </div>
        <p className={style.copy}>
          &copy; {year} PrayerTimes App. All rights reserved.
          <span className={style.version}>v1.0.0</span>
        </p>
      </div>
    </div>
  );
}
