import { useState, useEffect, useCallback, useMemo } from "react";
import type { Location } from "~/data/prayer-data";
import { DEFAULT_LOCATION } from "~/data/default-location";
import { useAppContext } from "~/context/app-context";

function locationsEqual(a: Location, b: Location): boolean {
  return a.cityId === b.cityId;
}

/**
 * Hook to manage draft settings state before persisting to global context/localStorage.
 */
export function useSettingsDraft() {
  const context = useAppContext();

  const [draftFormat, setDraftFormat] = useState(context.timeFormat);
  const [draftNotifications, setDraftNotifications] = useState(context.notificationsEnabled);
  const [draftPrefs, setDraftPrefs] = useState(context.notificationPreferences);
  const [draftLocation, setDraftLocation] = useState(context.location);

  useEffect(() => {
    setDraftFormat(context.timeFormat);
    setDraftNotifications(context.notificationsEnabled);
    setDraftPrefs(context.notificationPreferences);
    setDraftLocation(context.location);
  }, [
    context.timeFormat,
    context.notificationsEnabled,
    context.notificationPreferences,
    context.location,
  ]);

  const isDirty = useMemo(() => {
    const isFormatDirty = draftFormat !== context.timeFormat;
    const isNotifDirty = draftNotifications !== context.notificationsEnabled;
    const isPrefsDirty =
      JSON.stringify(draftPrefs) !== JSON.stringify(context.notificationPreferences);
    const isLocationDirty = !locationsEqual(draftLocation, context.location);

    return isFormatDirty || isNotifDirty || isPrefsDirty || isLocationDirty;
  }, [draftFormat, draftNotifications, draftPrefs, draftLocation, context]);

  const save = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      context.setTimeFormat(draftFormat);
      context.setNotificationsEnabled(draftNotifications);

      Object.entries(draftPrefs).forEach(([prayer, enabled]) => {
        if (context.notificationPreferences[prayer] !== enabled) {
          context.setNotificationPreference(prayer, enabled);
        }
      });

      if (!locationsEqual(draftLocation, context.location)) {
        context.setLocation(draftLocation);
      }

      return { success: true };
    } catch (error) {
      console.error("Failed to save settings:", error);
      return { success: false, error: "Critical error: Could not save settings to storage." };
    }
  };

  const discard = useCallback(() => {
    setDraftFormat(context.timeFormat);
    setDraftNotifications(context.notificationsEnabled);
    setDraftPrefs(context.notificationPreferences);
    setDraftLocation(context.location);
  }, [context]);

  const resetToDefaults = useCallback(() => {
    setDraftFormat("12h");
    setDraftNotifications(false);
    setDraftPrefs({});
    setDraftLocation(DEFAULT_LOCATION);
  }, []);

  const setNotificationPreference = useCallback((prayerName: string, enabled: boolean) => {
    setDraftPrefs((prev) => ({ ...prev, [prayerName]: enabled }));
  }, []);

  return {
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
  };
}
