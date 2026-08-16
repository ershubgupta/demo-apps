"use client";

import { useEffect, useState } from "react";

import { fetchNotifications, type NotificationsResponse } from "./notificationApi";

export type PollingMode = "broken" | "fixed";

const notificationPollingIntervals = new Set<number>();

function clearNotificationPollingIntervals() {
  notificationPollingIntervals.forEach((intervalId) => {
    window.clearInterval(intervalId);
  });
  notificationPollingIntervals.clear();
}

type UseNotificationsPollingOptions = {
  enabled: boolean;
  mode: PollingMode;
};

type UseNotificationsPollingResult = {
  data: NotificationsResponse | null;
  error: string | null;
  isLoading: boolean;
};

export function useNotificationsPolling({
  enabled,
  mode,
}: UseNotificationsPollingOptions): UseNotificationsPollingResult {
  const [data, setData] = useState<NotificationsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === "fixed") {
      clearNotificationPollingIntervals();
    }
  }, [mode]);

  useEffect(() => {
    if (!enabled) {
      if (mode === "fixed") {
        clearNotificationPollingIntervals();
      }

      return;
    }

    if (mode === "fixed") {
      clearNotificationPollingIntervals();
    }

    let canUpdateState = true;

    async function loadNotifications() {
      if (canUpdateState) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const result = await fetchNotifications();

        if (canUpdateState) {
          setData(result);
        }
      } catch (requestError) {
        if (canUpdateState) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Notifications request failed"
          );
        }
      } finally {
        if (canUpdateState) {
          setIsLoading(false);
        }
      }
    }

    void loadNotifications();

    const intervalId = window.setInterval(function notificationsPollingInterval() {
      void loadNotifications();
    }, 3000);
    notificationPollingIntervals.add(intervalId);

    if (mode === "fixed") {
      return () => {
        canUpdateState = false;
        window.clearInterval(intervalId);
        notificationPollingIntervals.delete(intervalId);
      };
    }

    return () => {
      canUpdateState = false;
      // Intentionally broken for the DevTools debugging workflow.
      // The interval is not cleared when polling is disabled.
      void intervalId;
    };
  }, [enabled, mode]);

  return { data, error, isLoading };
}