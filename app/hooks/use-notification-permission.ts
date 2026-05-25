import { useState, useEffect, useCallback } from "react";

export type PermissionStatus = NotificationPermission | "unsupported";

/**
 * Hook to manage and request browser notification permissions.
 * Provides a clean interface for UI components to handle different permission states.
 */
export function useNotificationPermission() {
  const [permission, setPermission] = useState<PermissionStatus>("default");

  const updatePermission = useCallback(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
  }, []);

  useEffect(() => {
    updatePermission();

    window.addEventListener("focus", updatePermission);
    document.addEventListener("visibilitychange", updatePermission);

    let permissionHandle: globalThis.PermissionStatus | null = null;

    if (typeof navigator !== "undefined" && navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "notifications" as PermissionName })
        .then((status) => {
          permissionHandle = status;
          status.onchange = () => updatePermission();
        })
        .catch(() => {
          /* Permissions API unavailable for notifications */
        });
    }

    return () => {
      window.removeEventListener("focus", updatePermission);
      document.removeEventListener("visibilitychange", updatePermission);
      if (permissionHandle) {
        permissionHandle.onchange = null;
      }
    };
  }, [updatePermission]);

  /** Request permission from this site (shows browser prompt when allowed). */
  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "unsupported" as const;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  return {
    permission,
    isGranted: permission === "granted",
    isDenied: permission === "denied",
    isUnsupported: permission === "unsupported",
    isDefault: permission === "default",
    requestPermission,
    refresh: updatePermission,
  };
}
