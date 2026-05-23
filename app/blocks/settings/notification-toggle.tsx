import { Bell, BellOff, ChevronDown, ChevronUp, AlertCircle, Info, Loader } from "lucide-react";
import classnames from "classnames";
import { useState } from "react";
import { useLanguage } from "~/i18n/language-context";
import { useNotificationPermission } from "~/hooks/use-notification-permission";
import style from "./notification-toggle.module.css";
import type { PrayerName } from "~/data/prayer-data";

export interface NotificationToggleProps {
  className?: string;
  value: boolean;
  onChange: (enabled: boolean) => void;
  preferences?: Record<string, boolean>;
  onPreferenceChange?: (prayerName: string, enabled: boolean) => void;
}

const PRAYERS: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export function NotificationToggle({
  className,
  value,
  onChange,
  preferences = {},
  onPreferenceChange,
}: NotificationToggleProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [showEnableFailed, setShowEnableFailed] = useState(false);
  const { permission, isGranted, isDenied, isUnsupported, requestPermission, refresh } =
    useNotificationPermission();

  const handleEnableFromSite = async () => {
    if (isUnsupported) return;

    setIsRequesting(true);
    setShowEnableFailed(false);

    const result = await requestPermission();
    refresh();

    setIsRequesting(false);

    if (result === "granted") {
      onChange(true);
      setExpanded(true);
      return;
    }

    setShowEnableFailed(true);
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isUnsupported) return;

    if (!value) {
      if (!isGranted) {
        await handleEnableFromSite();
        return;
      }
    }

    onChange(!value);
    if (!value) {
      setExpanded(true);
    }
  };

  const toggleDisabled = isUnsupported || (isDenied && !isGranted);
  const toggleActive = value && isGranted;

  return (
    <div className={classnames(style.root, className)}>
      <div
        className={classnames(style.mainRow, value && isGranted && style.mainRowClickable)}
        onClick={() => value && isGranted && setExpanded(!expanded)}
      >
        <div className={style.header}>
          <div className={classnames(style.iconBox, isDenied && style.iconBoxError)}>
            {value && isGranted ? <Bell size={18} /> : <BellOff size={18} />}
          </div>
          <div className={style.info}>
            <div className={style.title}>{t("settings.notifications")}</div>
            <div className={style.desc}>
              {isDenied
                ? t("settings.notifications.denied")
                : isUnsupported
                  ? t("settings.notifications.unsupported")
                  : t("settings.notifications.desc")}
            </div>
          </div>
        </div>
        <div className={style.actions}>
          {value && isGranted && (
            <div className={style.chevron}>
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          )}
          <button
            className={classnames(
              style.toggle,
              toggleActive && style.toggleActive,
              toggleDisabled && style.toggleDisabled,
            )}
            onClick={handleToggle}
            disabled={isUnsupported}
            role="switch"
            aria-checked={toggleActive}
            aria-label={t("settings.notifications")}
          >
            <span className={style.toggleThumb} />
          </button>
        </div>
      </div>

      {(isDenied || permission === "default") && !isGranted && (
        <div className={style.blockedMessage}>
          <div className={style.blockedTitle}>
            <AlertCircle size={16} />
            {isDenied
              ? t("settings.notifications.blocked.title")
              : t("settings.notifications")}
          </div>
          <div className={style.blockedDesc}>
            {isDenied
              ? t("settings.notifications.blocked.guide")
              : t("settings.notifications.desc")}
          </div>
          <button
            type="button"
            className={style.enableBtn}
            onClick={handleEnableFromSite}
            disabled={isRequesting}
          >
            {isRequesting ? (
              <>
                <Loader size={18} className={style.spinner} aria-hidden="true" />
                {t("settings.notifications.enableRequesting")}
              </>
            ) : (
              t("settings.notifications.enableButton")
            )}
          </button>
          {showEnableFailed && (
            <p className={style.enableFailed} role="status">
              {t("settings.notifications.enableFailed")}
            </p>
          )}
        </div>
      )}

      {isUnsupported && (
        <div className={style.unsupportedMessage}>{t("settings.notifications.unsupported")}</div>
      )}

      {value && isGranted && (
        <div className={style.successMessage}>
          <div className={style.successContent}>
            <Info size={14} style={{ flexShrink: 0 }} />
            <span>{t("settings.notifications.scheduled")}</span>
          </div>
          <small>{t("settings.notifications.limitation")}</small>
        </div>
      )}

      {value && expanded && isGranted && onPreferenceChange && (
        <div className={style.prayersList}>
          {PRAYERS.map((prayer) => {
            const isEnabled = preferences[prayer] !== false;
            return (
              <div key={prayer} className={style.prayerRow}>
                <span className={style.prayerName}>{t(`prayer.${prayer}` as any)}</span>
                <button
                  className={classnames(
                    style.toggle,
                    style.smallToggle,
                    isEnabled && style.toggleActive,
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreferenceChange(prayer, !isEnabled);
                  }}
                  role="switch"
                  aria-checked={isEnabled}
                  aria-label={t(`prayer.${prayer}` as any)}
                >
                  <span className={style.toggleThumb} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
