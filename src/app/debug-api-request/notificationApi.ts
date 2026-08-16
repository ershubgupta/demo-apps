export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  unread: boolean;
};

export type NotificationsResponse = {
  unreadCount: number;
  requestedAt: string;
  notifications: NotificationItem[];
};

export async function fetchNotifications(): Promise<NotificationsResponse> {
  const response = await fetch("/api/notifications", {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Notifications request failed with ${response.status}`);
  }

  return response.json() as Promise<NotificationsResponse>;
}