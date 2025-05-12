import React from 'react';
import { useNotification } from '../../hooks/useNotification';

const NotificationButtonsContainer = () => {
    
    const { showNotification } = useNotification();
  
    const handleShowNotification = (type, position) => {
        console.log('Attempting to show notification:', { type, position });
        let title, message;
        switch (type) {
          case "success": {
            title = "Success! Success! Success!";
            message = "Guy is proud! Guy is proud Guy is proud";
            break;
          }
          case "error": {
            title = "Error!";
            message = "Know pain";
            break;
          }
          case "info": {
            title = "Info:";
            message = "It's a 106cm";
            break;
          }
          case "warning": {
            title = "Warning";
            message = "Orochimaru is here";
            break;
          }
          default: {
            title = "Success!";
            message = "Your data is saved!";
            break;
          }
        }
        const notificationId = showNotification({ 
          title, 
          message, 
          type, 
          position, 
          duration: 1500 
        });
        console.log('Notification created with ID:', notificationId);
    };
    return (
        <div className="App">
        <h1>Building a Shadow Clone Notification system for your react app</h1>
        <div className="card">
          <button
            onClick={() => {
              handleShowNotification("success", "top-right");
            }}
          >
            top-right
          </button>
          <button
            onClick={() => {
              handleShowNotification("warning", "top-left");
            }}
          >
            top-left
          </button>
          <button
            onClick={() => {
              handleShowNotification("error", "bottom-left");
            }}
          >
            bottom-left
          </button>
          <button
            onClick={() => {
              handleShowNotification("info", "bottom-right");
            }}
          >
            bottom-right
          </button>
        </div>
        <div className="card">
          <button
            onClick={() => {
              handleShowNotification("info", "center");
            }}
          >
            center
          </button>
          <button
            onClick={() => {
              handleShowNotification("success", "right");
            }}
          >
            right
          </button>
          <button
            onClick={() => {
              handleShowNotification("error", "bottom");
            }}
          >
            bottom
          </button>
          <button
            onClick={() => {
              handleShowNotification("warning", "top");
            }}
          >
            top
          </button>
          <button
            onClick={() => {
              handleShowNotification("info", "left");
            }}
          >
            left
          </button>
        </div>
      </div>
    );
};
export default NotificationButtonsContainer;