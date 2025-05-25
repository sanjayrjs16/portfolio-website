import { createPortal } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import NotificationContainer from './NotificationContainer';

const NotificationPortal = ({ position, notifications, removeNotification }) => {
  const [mounted, setMounted] = useState(false);
  const portalRef = useRef(null);

  useEffect(() => {
    // Create portal container if it doesn't exist
    if (!portalRef.current) {
      portalRef.current = document.createElement('div');
      portalRef.current.className = `notification-portal ${position}`;
      portalRef.current.style.position = 'fixed';
      portalRef.current.style.zIndex = '9999';
      portalRef.current.style.pointerEvents = 'none';
    }

    // Find or create notification root
    let portalRoot = document.getElementById('notification-root');
    if (!portalRoot) {
      portalRoot = document.createElement('div');
      portalRoot.id = 'notification-root';
      portalRoot.style.position = 'fixed';
      portalRoot.style.top = '0';
      portalRoot.style.left = '0';
      portalRoot.style.width = '100%';
      portalRoot.style.height = '100%';
      portalRoot.style.pointerEvents = 'none';
      portalRoot.style.zIndex = '9999';
      document.body.appendChild(portalRoot);
    }

    // Append portal container to root
    portalRoot.appendChild(portalRef.current);
    setMounted(true);

    return () => {
      if (portalRef.current && portalRef.current.parentNode) {
        portalRef.current.parentNode.removeChild(portalRef.current);
      }
    };
  }, [position]);

  if (!mounted || !portalRef.current) return null;

  return createPortal(
    <NotificationContainer
      position={position}
      notifications={notifications}
      removeNotification={removeNotification}
    />,
    portalRef.current
  );
};

export default NotificationPortal; 