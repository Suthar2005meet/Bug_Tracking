import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthProvider';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { userId } = useContext(AuthContext);
  
  const [notifications, setNotifications] = useState([]);
  
  // Calculate unread count dynamically from the notifications array
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`/notification/all/${userId}`);
      setNotifications(prev => {
        const newData = res.data.data || [];
        // Prevent unnecessary state updates if data exactly matches
        if (JSON.stringify(prev) !== JSON.stringify(newData)) {
          return newData;
        }
        return prev;
      });
    } catch (err) {
      console.error("Fetch notifications error:", err);
    }
  }, [userId]);

  // unread count is calculated directly from notifications now

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/notification/${notificationId}/read`);
      setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`/notification/user/${userId}/read-all`);
      await fetchNotifications();
      return true; // Used by component for toast success
    } catch (err) {
      console.error(err);
      return false; // Used by component for toast error
    }
  };

  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    const poll = async () => {
      if (!userId || !isMounted) return;
      
      await fetchNotifications();

      if (isMounted) {
        // Auto refresh every 2 seconds securely without stacking
        timeoutId = setTimeout(poll, 2000);
      }
    };

    if (userId) {
      poll();
    } else {
      setNotifications([]);
    }

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [userId, fetchNotifications]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      fetchNotifications,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
