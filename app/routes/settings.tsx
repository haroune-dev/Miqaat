import { useState, useEffect } from "react";
import { useBlocker } from "react-router";
import { useLanguage } from "~/i18n/language-context";
import { useSettingsDraft } from "~/hooks/use-settings-draft";
import { Toast } from "~/components/toast/toast";

import { LocationSettings } from "../blocks/settings/location-settings";
import { TimeFormatToggle } from "../blocks/settings/time-format-toggle";
import { NotificationToggle } from "../blocks/settings/notification-toggle";
import { SettingsActions } from "../blocks/settings/settings-actions";
import { UnsavedChangesModal } from "../blocks/settings/unsaved-changes-modal";
import styles from "./settings.module.css";

export default function Settings() {
  const { t } = useLanguage();

  const {
    draftFormat,
    setDraftFormat,
    draftNotifications,
    setDraftNotifications,
    draftPrefs,
    draftLocation,
    setDraftLocation,
    setNotificationPreference,
    isDirty,
    save,
    discard,
    resetToDefaults,
  } = useSettingsDraft();

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (window.location.hash === "#location") {
      document.getElementById("location")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await save();
    setIsSaving(false);

    if (result.success) {
      setToast({ message: t("settings.saved") || "Settings saved successfully", type: "success" });
      return true;
    } else {
      setToast({ message: result.error || "Failed to save settings", type: "error" });
      return false;
    }
  };

  const handleReset = () => {
    resetToDefaults();
    setToast({ message: t("settings.reset.success") || "Settings reset to defaults", type: "success" });
  };

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  );

  return (
    <>
      <main className={styles.root}>
        <h1 className={styles.pageTitle}>{t("settings.title")}</h1>

        <div className={styles.grid}>
          <div className={styles.topSection}>
            <div className={styles.locationArea}>
              <LocationSettings
                draftLocation={draftLocation}
                onLocationChange={setDraftLocation}
              />
            </div>
            <div className={styles.timeFormatArea}>
              <TimeFormatToggle value={draftFormat} onChange={setDraftFormat} />
            </div>
          </div>

          <div className={styles.bottomSection}>
            <NotificationToggle
              value={draftNotifications}
              onChange={setDraftNotifications}
              preferences={draftPrefs}
              onPreferenceChange={setNotificationPreference}
            />
          </div>
        </div>

        <div className={styles.actionsBox}>
          <SettingsActions
            onSave={handleSave}
            onReset={handleReset}
            isDirty={isDirty}
            isSaving={isSaving}
          />
        </div>

        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </main>

      {blocker.state === "blocked" ? (
        <UnsavedChangesModal
          onSave={async () => {
            const success = await handleSave();
            if (success) {
              blocker.proceed();
            }
          }}
          onDiscard={() => {
            discard();
            blocker.proceed();
          }}
          onCancel={() => {
            blocker.reset();
          }}
        />
      ) : null}
    </>
  );
}
