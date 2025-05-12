import { useCallback, useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { v4 as uuidv4 } from "uuid";

export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    console.warn('useNotification must be used within a NotificationProvider');
    return {
      showNotification: () => console.warn('Notification system not initialized'),
    };
  }

  const {
    addNotification,
    removeNotification,
    notifications,
    setNotifications,
  } = context;

  const prepareToRemoveNotification = (id) => {
    if (!setNotifications) return;
    
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, isLeaving: true } : notif
      )
    );

    setTimeout(() => {
      if (removeNotification) {
        removeNotification(id);
      }
    }, 400);
  };

  const showNotification = useCallback((options) => {
    try {
      if (!addNotification) {
        console.warn('Notification system not properly initialized');
        return;
      }

      const id = uuidv4();
      const {
        type,
        title,
        message,
        duration = 2000,
        onClick,
        href,
        target,
        shouldTruncate = true,
      } = options;

      if (!message) {
        console.warn('Notification message is required');
        return;
      }

      if (onClick && typeof onClick !== 'function') {
        console.warn('onClick must be a function');
        return;
      }

      const timer = setTimeout(() => {
        prepareToRemoveNotification(id);
      }, duration);

      addNotification({
        ...options,
        id,
        isLeaving: false,
      });

      return id; // Return ID so notification can be programmatically removed
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }, [addNotification]);

  return { showNotification };
};
