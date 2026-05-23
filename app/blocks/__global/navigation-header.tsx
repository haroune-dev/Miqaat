import { NavLink, Link, useLocation } from "react-router";
import { Settings, Home, CalendarDays, Menu, X, Languages } from "lucide-react";
import classnames from "classnames";
import { useState, useEffect } from "react";
import { useColorScheme } from "@dazl/color-scheme/react";
import { useLanguage } from "~/i18n/language-context";
import style from "./navigation-header.module.css";

export interface NavigationHeaderProps {
  className?: string;
}

export function NavigationHeader({ className }: NavigationHeaderProps) {
  const { t, locale, setLocale } = useLanguage();
  const { resolvedScheme, setColorScheme } = useColorScheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
          <NavLink
            to="/settings"
            className={({ isActive }) => classnames(style.navLink, isActive && style.navLinkActive)}
            aria-label={t("nav.settings")}
          >
            <span className={style.navLinkIcon}>
              <Settings size={22} />
            </span>
            <span className={style.navLinkTitle}>{t("nav.settings")}</span>
          </NavLink>
        </div>
      </div>

      <div className={style.actions}>
        <label className={style.languageSelectWrapper}>
          <Languages size={18} />
          <select
            className={style.languageSelect}
            value={locale}
            onChange={(event) => setLocale(event.target.value as "ar" | "en")}
            aria-label={locale === "ar" ? "اختيار اللغة" : "Choose language"}
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </label>

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

        <button
          className={style.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
