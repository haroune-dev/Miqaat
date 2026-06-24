import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Bell, BellOff, X, Loader } from "lucide-react";
import classnames from "classnames";
import { useAppContext } from "~/context/app-context";
import { useLanguage } from "~/i18n/language-context";
import { useNotificationPermission } from "~/hooks/use-notification-permission";
import type { TranslationKey } from "~/i18n/translations";
import { formatTime } from "~/utils/time-utils";
import style from "./notification-modal.module.css";

export interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export function NotificationModal({ isOpen, onClose, buttonRef }: NotificationModalProps) {
  const {
    notificationsEnabled,
    notificationPreferences,
    setNotificationsEnabled,
    setNotificationPreference,
    prayerTimes,
  } = useAppContext();
  const { t } = useLanguage();
  const { permission, isGranted, isDenied, isDefault, isUnsupported, requestPermission } =
    useNotificationPermission();
  const [isRequesting, setIsRequesting] = useState(false);
  const [showDeniedGuide, setShowDeniedGuide] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const previousFocusRef = useRef<HTMLElement | null>(null);
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

  const allPrayersEnabled = PRAYERS.every((p) => notificationPreferences[p] !== false);
  const masterIsActive = notificationsEnabled && allPrayersEnabled;

  useEffect(() => {
    if (notificationsEnabled) {
      const anyEnabled = PRAYERS.some((p) => notificationPreferences[p] !== false);
      if (!anyEnabled) {
        setNotificationsEnabled(false);
      }
    }
  }, [notificationPreferences, notificationsEnabled, setNotificationsEnabled]);

  const handleMasterToggle = useCallback(async () => {
    if (masterIsActive) {
      setNotificationsEnabled(false);
      PRAYERS.forEach((p) => setNotificationPreference(p, false));
    } else {
      if (isUnsupported) return;
      if (!isGranted) {
        setIsRequesting(true);
        const result = await requestPermission();
        setIsRequesting(false);
        if (result !== "granted") {
          setShowDeniedGuide(true);
          return;
        }
      }
      setShowDeniedGuide(false);
      setNotificationsEnabled(true);
      PRAYERS.forEach((p) => setNotificationPreference(p, true));
    }
  }, [masterIsActive, isGranted, isUnsupported, requestPermission, setNotificationsEnabled, setNotificationPreference]);

  const needsPermission = isDenied || isDefault;

  const getPrayerTime = (name: string): string | null => {
    const prayer = prayerTimes.find((p) => p.name === name);
    return prayer ? prayer.time : null;
  };

  useEffect(() => {
    if (isOpen) {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      const rect = buttonRef?.current?.getBoundingClientRect();
      if (rect) {
        setOriginRect(rect);
        rafRef.current = requestAnimationFrame(() => setIsExpanded(true));
      }
      const showTimer = setTimeout(() => setShowContent(true), 59);
      return () => {
        clearTimeout(showTimer);
        cancelAnimationFrame(rafRef.current);
      };
    } else {
      setIsExpanded(false);
    }
  }, [isOpen, buttonRef]);

  if (!mounted) return null;
  if (!originRect) return null;

  const modalWidth = Math.min(480, (window.innerWidth || 480) - 32);
  let targetHeight = 530;
  if (needsPermission) {
    targetHeight += 76;
    if (showDeniedGuide) {
      targetHeight += 50;
    }
  }
  const modalHeight = Math.min((window.innerHeight || 600) * 0.9, targetHeight);
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
          if (!(e.target as HTMLElement).closest('[data-morph-content]')) {
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
        aria-labelledby="notification-modal-title"
      >
        <button
          className={style.closeBtn}
          onClick={handleClose}
          aria-label={t("common.cancel")}
        >
          <X size={20} />
        </button>

        <div className={style.header}>
          <h2 id="notification-modal-title" className={style.title}>
            {t("notifications.modalTitle")}
          </h2>
          <p className={style.desc}>
            {isGranted
              ? t("settings.notifications.desc")
              : isUnsupported
                ? t("settings.notifications.unsupported")
                : t("settings.notifications.desc")}
          </p>
        </div>

        {needsPermission && (
          <div className={style.permissionSection}>
            <div className={style.permissionBar}>
              <BellOff size={18} style={{ flexShrink: 0, opacity: 0.7 }} />
              <p>
                {isDenied
                  ? t("notifications.browserBlocked")
                  : t("notifications.noPermission")}
              </p>
              <button
                className={style.permissionBtn}
                onClick={handleMasterToggle}
                disabled={isRequesting || isUnsupported}
              >
                {isRequesting ? (
                  <Loader size={14} className={style.spinner} />
                ) : isDenied ? (
                  t("notifications.allowBrowser")
                ) : (
                  t("notifications.requestPermission")
                )}
              </button>
            </div>
            {showDeniedGuide && (
              <p className={style.deniedGuide}>
                {t("settings.notifications.enableFailed")}
              </p>
            )}
          </div>
        )}

        <div className={style.masterToggle}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <Bell size={20} style={{ color: "var(--color-primary)" }} />
            <span className={style.masterLabel}>
              {t("notifications.masterToggle")}
            </span>
          </div>
          <button
            className={classnames(
              style.toggle,
              masterIsActive && style.toggleActive,
              (isUnsupported) && style.toggleDisabled,
            )}
            onClick={handleMasterToggle}
            disabled={isUnsupported}
            role="switch"
            aria-checked={masterIsActive}
            aria-label={t("notifications.masterToggle")}
          />
        </div>

        <div className={style.prayersList}>
          {PRAYERS.map((prayer) => {
            const isEnabled =
              notificationsEnabled && notificationPreferences[prayer] !== false;
            const prayerTime = getPrayerTime(prayer);
            return (
              <div key={prayer} className={style.prayerRow}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <span className={style.prayerName}>
                    {t(`prayer.${prayer}` as TranslationKey)}
                  </span>
                  {prayerTime && (
                    <span className={style.prayerTime} dir="ltr">
                      {formatTime(prayerTime)}
                    </span>
                  )}
                </div>
                <button
                  className={classnames(
                    style.toggle,
                    isEnabled && style.toggleActive,
                    isUnsupported && style.toggleDisabled,
                  )}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!notificationsEnabled) {
                      if (isUnsupported) return;
                      if (!isGranted) {
                        setIsRequesting(true);
                        const result = await requestPermission();
                        setIsRequesting(false);
                        if (result !== "granted") {
                          setShowDeniedGuide(true);
                          return;
                        }
                      }
                      setShowDeniedGuide(false);
                      setNotificationsEnabled(true);
                      PRAYERS.forEach((p) => {
                        setNotificationPreference(p, p === prayer);
                      });
                    } else {
                      setNotificationPreference(
                        prayer,
                        notificationPreferences[prayer] !== false ? false : true,
                      );
                    }
                  }}
                  disabled={isUnsupported}
                  role="switch"
                  aria-checked={isEnabled}
                  aria-label={t(`prayer.${prayer}` as TranslationKey)}
                />
              </div>
            );
          })}
        </div>

      </div>
    </div>
    </>,
    document.body,
  );
}
