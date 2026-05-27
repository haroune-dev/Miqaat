import { NavLink, Link, useLocation } from "react-router";
import { Home, CalendarDays } from "lucide-react";
import classnames from "classnames";
import { useState, useEffect } from "react";
import { useColorScheme } from "@dazl/color-scheme/react";
import { useLanguage } from "~/i18n/language-context";
import { NotificationModal } from "~/blocks/notifications/notification-modal";
import style from "./navigation-header.module.css";

export interface NavigationHeaderProps {
  className?: string;
}

export function NavigationHeader({ className }: NavigationHeaderProps) {
  const { t } = useLanguage();
  const { resolvedScheme, setColorScheme } = useColorScheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className={classnames(style.root, className)} aria-label="Main navigation">
      <Link to="/" className={style.logo} aria-label="Prayer Times home">
        <img src="/logo.jpg" alt="Logo" className={style.logoIcon} style={{ objectFit: "cover", background: "transparent", padding: 0 }} />
        <span className={style.logoText}>
          {t("nav.logo.prayer")}
        </span>
      </Link>

      <div className={classnames(style.navWrapper, isMenuOpen && style.navWrapperOpen)}>
        <div className={style.nav}>
          <NavLink
            to="/"
            className={({ isActive }) => classnames(style.navLink, isActive && style.navLinkActive)}
            aria-label={t("nav.home")}
            end
          >
            <span className={style.navLinkIcon}>
              <Home size={22} />
            </span>
            <span className={style.navLinkTitle}>{t("nav.home")}</span>
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) => classnames(style.navLink, isActive && style.navLinkActive)}
            aria-label={t("nav.calendar")}
          >
            <span className={style.navLinkIcon}>
              <CalendarDays size={22} />
            </span>
            <span className={style.navLinkTitle}>{t("nav.calendar")}</span>
          </NavLink>
        </div>
      </div>

      <div className={style.actions}>
        <button
          className={style.bellBtn}
          onClick={() => setIsNotificationModalOpen(true)}
          aria-label={t("nav.notifications")}
        >
          <svg viewBox="0 0 448 512" className={style.bellIcon}><path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></svg>
        </button>

        <label className={style.switch} aria-label="Toggle dark mode">
          <input
            type="checkbox"
            checked={resolvedScheme === "dark"}
            onChange={(event) => setColorScheme(event.target.checked ? "dark" : "light")}
          />
          <span className={style.slider}>
            <span className={style.circle}>
              <span className={classnames(style.shine, style.shine1)}></span>
              <span className={classnames(style.shine, style.shine2)}></span>
              <span className={classnames(style.shine, style.shine3)}></span>
              <span className={classnames(style.shine, style.shine4)}></span>
              <span className={classnames(style.shine, style.shine5)}></span>
              <span className={classnames(style.shine, style.shine6)}></span>
              <span className={classnames(style.shine, style.shine7)}></span>
              <span className={classnames(style.shine, style.shine8)}></span>
              <span className={style.moon}></span>
            </span>
          </span>
        </label>

        <input
          className={style.toggleCheckbox}
          id="toggle"
          type="checkbox"
          checked={isMenuOpen}
          onChange={(event) => setIsMenuOpen(event.target.checked)}
        />
        <label className={style.hamburger} htmlFor="toggle" aria-label="Toggle menu">
          <div className={style.bar}></div>
          <div className={style.bar}></div>
          <div className={style.bar}></div>
        </label>
      </div>

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </nav>
  );
}
