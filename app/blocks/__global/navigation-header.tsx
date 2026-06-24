import { NavLink, Link, useLocation } from "react-router";
import { Home, CalendarDays } from "lucide-react";
import classnames from "classnames";
import { useState, useEffect, useRef, useCallback } from "react";
import { useColorScheme } from "@dazl/color-scheme/react";
import { useLanguage } from "~/i18n/language-context";
import { NotificationModal } from "~/blocks/notifications/notification-modal";
import style from "./navigation-header.module.css";

export interface NavigationHeaderProps {
  className?: string;
}

export function NavigationHeader({ className }: NavigationHeaderProps) {
  const { t, locale, setLocale } = useLanguage();
  const { resolvedScheme, setColorScheme } = useColorScheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [optimisticAr, setOptimisticAr] = useState(locale === "ar");
  const bellBtnRef = useRef<HTMLButtonElement>(null);
  const routerLocation = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [routerLocation]);

  useEffect(() => {
    setOptimisticAr(locale === "ar");
  }, [locale]);

  useEffect(() => {
    if (!isClosing) return;
    const timer = setTimeout(() => setIsClosing(false), 550);
    return () => clearTimeout(timer);
  }, [isClosing]);

  const closeMenu = useCallback(() => {
    setIsClosing(true);
    requestAnimationFrame(() => {
      setIsMenuOpen(false);
    });
  }, []);

  const knobRef = useRef<HTMLSpanElement>(null);

  const handleLangToggle = () => {
    const next = !optimisticAr;
    setOptimisticAr(next);
    setTimeout(() => {
      if (knobRef.current) {
        knobRef.current.style.setProperty("transition", "none", "important");
      }
      setLocale(next ? "ar" : "en");
      requestAnimationFrame(() => {
        if (knobRef.current) {
          knobRef.current.style.removeProperty("transition");
        }
      });
    }, 450);
  };

  return (
    <header className={classnames(style.root, className)} role="banner">
      <Link to="/" className={style.logo} aria-label="Prayer Times home">
        <img src="/logo.jpg" alt="Logo" className={style.logoIcon} style={{ objectFit: "cover", background: "transparent", padding: 0 }} />
        <span className={style.logoText}>
          {t("nav.logo.prayer")}
        </span>
      </Link>

      <button
        className={classnames(style.mobileBackdrop, isMenuOpen && style.mobileBackdropOpen)}
        type="button"
        aria-label="Close menu"
        tabIndex={isMenuOpen ? 0 : -1}
        onClick={closeMenu}
      />

      <div
        id="mobile-navigation-menu"
        className={classnames(style.navWrapper, isMenuOpen && style.navWrapperOpen, isClosing && style.navWrapperClosing)}
      >
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
          ref={bellBtnRef}
          className={style.bellBtn}
          onClick={() => setIsNotificationModalOpen(true)}
          aria-label={t("nav.notifications")}
        >
          <svg viewBox="0 0 448 512" className={style.bellIcon}><path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></svg>
          <span className={style.bellArrow} aria-hidden="true">⌄</span>
        </button>

        <label className={style.langSwitcher} aria-label={t("nav.language")}>
          <input
            type="checkbox"
            checked={optimisticAr}
            onChange={handleLangToggle}
          />
          <span className={style.langLabelAr}>العربية</span>
          <span className={style.langLabelEn}>English</span>
          <span ref={knobRef} className={style.langKnob}></span>
        </label>

        <button
          className={classnames(style.hamburger, isMenuOpen && style.hamburgerOpen, isClosing && style.hamburgerClosing)}
          type="button"
          aria-label="Toggle menu"
          aria-controls="mobile-navigation-menu"
          aria-expanded={isMenuOpen}
          onClick={() => {
            if (isMenuOpen) {
              closeMenu();
            } else {
              setIsMenuOpen(true);
            }
          }}
        >
          <div className={style.bar}></div>
          <div className={style.bar}></div>
        </button>
      </div>

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        buttonRef={bellBtnRef}
      />
    </header>
  );
}
