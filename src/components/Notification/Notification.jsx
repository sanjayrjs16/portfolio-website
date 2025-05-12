import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { NOTIFICATION_TYPES, NOTIFICATION_EMOJIS, SMOKE_DURATION } from "../../constants";
import "../../styles/notifications.css";

const Notification = ({ notification, removeNotification }) => {
  const [isSmokeVisible, setIsSmokeVisible] = useState(true);
  const [isScrollOpen, setIsScrollOpen] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const [contentWidth, setContentWidth] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const dimensionRef = useRef(null);
  
  const { 
    type, 
    title, 
    message, 
    id, 
    isLeaving, 
    onClick, 
    href,
    target = "_blank",
    shouldTruncate = true 
  } = notification;

  useEffect(() => {
    // Start scroll opening animation after a brief delay
    const scrollTimer = setTimeout(() => {
      setIsScrollOpen(true);
    }, 100);

    const smokeTimer = setTimeout(() => {
      setIsSmokeVisible(false);
    }, SMOKE_DURATION);

    return () => {
      clearTimeout(smokeTimer);
      clearTimeout(scrollTimer);
    };
  }, []);

  useLayoutEffect(() => {
    if (dimensionRef?.current) {
      setContentWidth(dimensionRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (isLeaving) {
      setIsScrollOpen(false);
      setIsSmokeVisible(true);
    }
  }, [isLeaving]);

  const handleNotificationClick = (e) => {
    if (e.target.closest('.close-btn')) return;
    
    try {
      if (href) {
        window.open(href, target);
      } else if (typeof onClick === 'function') {
        onClick(notification);
      }
    } catch (error) {
      console.warn('Error handling notification click:', error);
    }
  };

  const renderContent = () => (
    <div className="content">
      {title && (
        <h3 className="title" title={title}>
          {title}
        </h3>
      )}
      <p 
        className={`message ${!isExpanded ? 'truncate' : ''}`}
        onClick={() => shouldTruncate && setIsExpanded(!isExpanded)}
      >
        {message}
        {shouldTruncate && !isExpanded && message.length > 150 && (
          <span className="expand-btn">...more</span>
        )}
      </p>
    </div>
  );

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={dimensionRef}
        className={`
          notification 
          ${type} 
          ${onClick || href ? 'clickable' : ''} 
          ${isScrollOpen ? 'scroll-open' : 'scroll-closed'}
        `}
        style={{ visibility: isLeaving ? "hidden" : "visible" }}
        onClick={handleNotificationClick}
        role={onClick || href ? "button" : "alert"}
        tabIndex={onClick || href ? 0 : undefined}
      >
        <div className="scroll-handle-left" />
        <div className="scroll-handle-right" />
        
        <div className="emoji-section">
          <div className="emoji">
            {NOTIFICATION_EMOJIS[type]}
          </div>
        </div>
        
        <div className="content-section">
          <button
            className="close-btn"
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(id);
            }}
          >
            ×
          </button>
          {renderContent()}
        </div>
      </div>
      {isSmokeVisible && (
        <img
          alt="smoke effect"
          src={`smoke.webp?${cacheBuster}`}
          width={contentWidth}
          className="smoke"
        />
      )}
    </div>
  );
};

export default Notification;
