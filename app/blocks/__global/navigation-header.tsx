import { NavLink, Link } from "react-router";
import { Moon, Settings, MapPin } from "lucide-react";
import classnames from "classnames";
import style from "./navigation-header.module.css";

export interface NavigationHeaderProps {
  className?: string;
}

export function NavigationHeader({ className }: NavigationHeaderProps) {
  return (
    <nav className={classnames(style.root, className)} aria-label="Main navigation">
      <Link to="/" className={style.logo} aria-label="Prayer Times home">
        <span className={style.logoIcon}>
          <Moon size={18} />
        </span>
        <span className={style.logoText}>
          Prayer<span className={style.logoTextAccent}>Times</span>
        </span>
      </Link>

      <div className={style.nav}>
        <NavLink
          to="/location"
          className={({ isActive }) => classnames(style.navLink, isActive && style.navLinkActive)}
          aria-label="Change location"
        >
          <MapPin size={16} />
          Location
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => classnames(style.settingsBtn, isActive && style.navLinkActive)}
          aria-label="Open settings"
        >
          <Settings size={20} />
        </NavLink>
      </div>
    </nav>
  );
}
