import React, { createContext, useState } from "react";
import NotificationContainer from "../components/Notification/NotificationContainer";
import NotificationPortal from "../components/Notification/NotificationPortal";

const defaultContext = {
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
  setNotifications: () => {},
};

export const NotificationContext = createContext(defaultContext);

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    console.log('Adding notification:', notification);
    setNotifications((prevNotificaitons) => {
      const newNotifications = [...prevNotificaitons, notification];
      console.log('New notifications state:', newNotifications);
      return newNotifications;
    });
  };

  const removeNotification = (id) => {
    console.log('Removing notification:', id);
    setNotifications((prevNotifications) => {
      const newNotifications = prevNotifications.filter((notification) => notification.id != id);
      console.log('Notifications after removal:', newNotifications);
      return newNotifications;
    });
  };

  console.log('Current notifications:', notifications);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        setNotifications,
      }}
    >
      {children}
      {[
        "top-left",
        "top-right",
        "bottom-right",
        "bottom-left",
        "left",
        "right",
        "center",
        "top",
        "bottom",
      ].map((position) => (
        <NotificationPortal
          key={position}
          notifications={notifications.filter(
            (notification) => notification.position === position
          )}
          position={position}
          removeNotification={removeNotification}
        />
      ))}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
