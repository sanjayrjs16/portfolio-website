import React from "react";
import Notification from "./Notification";
import "../../styles/notifications.css";

const NotificationContainer = ({
  position,
  notifications,
  removeNotification,
}) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className={`notification-container ${position}`}>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          removeNotification={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
