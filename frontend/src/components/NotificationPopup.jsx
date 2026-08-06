import { useEffect, useState } from 'react';

const NotificationPopup = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleShowNotification = (event) => {
      const detail = event?.detail;
      if (!detail || !detail.message) return;

      const id = `${Date.now()}-${Math.random()}`;
      const notification = {
        id,
        type: detail.type === 'success' ? 'success' : 'error',
        message: detail.message
      };

      setNotifications((prev) => [notification, ...prev].slice(0, 4));

      setTimeout(() => {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
      }, 4500);
    };

    window.addEventListener('showNotification', handleShowNotification);
    return () => window.removeEventListener('showNotification', handleShowNotification);
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  if (!notifications.length) {
    return null;
  }

  return (
    <div className="notification-popup-container">
      {notifications.map(({ id, type, message }) => (
        <div key={id} className={`notification-popup ${type}`}>
          <div className="notification-details">
            <span className="notification-title">{type === 'success' ? 'Success' : 'Error'}</span>
            <p>{message}</p>
          </div>
          <button className="notification-close" onClick={() => removeNotification(id)} aria-label="Close notification">×</button>
        </div>
      ))}
    </div>
  );
};

export default NotificationPopup;
