import { useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

export default function Notification({ message, type = 'success', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const icons = {
    success: <FaCheckCircle />,
    error: <FaExclamationCircle />,
    info: <FaExclamationCircle />,
    warning: <FaExclamationCircle />
  };

  const colors = {
    success: 'var(--success)',
    error: 'var(--danger)',
    info: 'var(--info)',
    warning: 'var(--warning)'
  };

  return (
    <div className={`notification notification-${type} ${visible ? 'slide-in' : 'slide-out'}`}>
      <div className="notification-icon" style={{ color: colors[type] || colors.success }}>
        {icons[type] || icons.success}
      </div>
      <div className="notification-content">
        <p>{message}</p>
      </div>
      <button className="notification-close" onClick={() => {
        setVisible(false);
        if (onClose) setTimeout(onClose, 300);
      }}>
        <FaTimes />
      </button>
    </div>
  );
}