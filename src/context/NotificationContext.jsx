import React, { createContext, useState, useCallback } from "react";
import NotificationPortal from "../components/Notification/NotificationPortal";

const defaultContext = {
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
};

export const NotificationContext = createContext(defaultContext);

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    const newNotification = {
      ...notification,
      id,
      position: notification.position || 'top-right'
    };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
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
          position={position}
          notifications={notifications.filter(
            (notification) => notification.position === position
          )}
          removeNotification={removeNotification}
        />
      ))}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
