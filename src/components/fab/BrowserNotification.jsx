import React, { useEffect } from "react";
import api from "../../assets/api";

function BrowserNotification({ userId }) {
  useEffect(() => {
    if (!userId) return;

    if (window.Notification && Notification.permission !== "granted") {
      window.Notification.requestPermission();
    }

    const fetchNotifications = async () => {
      try {
        const res = await api.get(`/api/notifications/${userId}/`);
        const data = res.data;

        if (Array.isArray(data) && data.length > 0) {
          const latest = data[0];

          const stored = JSON.parse(
            localStorage.getItem("shownNotifications") || "[]"
          );

          const exists = stored.some(
            (n) =>
              n.title === latest.title && n.created_at === latest.created_at
          );

          if (!exists) {
            if (window.Notification && Notification.permission === "granted") {
              new window.Notification(latest.title || "New Notification", {
                body: latest.message || "You have a new notification!",
                icon: "/logo192.png",
              });
            }

            const updated = [
              ...stored,
              { title: latest.title, created_at: latest.created_at },
            ];
            localStorage.setItem("shownNotifications", JSON.stringify(updated));
            console.log("Notifications", updated);
          } else {
            console.log("Notifications (unchanged)", stored);
          }
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, [userId]);

  return null;
}

export default BrowserNotification;
