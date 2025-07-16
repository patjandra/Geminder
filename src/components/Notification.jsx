import { useState, useEffect } from 'react';

export default function Notification({ message, isVisible, onClose, color = 'green' }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Auto-hide after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = color === 'red' ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg pointer-events-auto`}>
        <p className="font-semibold">{message}</p>
      </div>
    </div>
  );
} 