import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api-client';
import { NotificationContext, type AppNotification } from './notification-store';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [allNotifications, setAllNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await api.get('/notifications');
            setNotifications(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAllNotifications = useCallback(async () => {
        try {
            const response = await api.get('/notifications/manage');
            setAllNotifications(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setAllNotifications([]);
        }
    }, []);

    const refreshAll = useCallback(async () => {
        await Promise.all([fetchNotifications(), fetchAllNotifications()]);
    }, [fetchNotifications, fetchAllNotifications]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
        void fetchNotifications();
    }, [fetchNotifications]);

    const getNotification = async (id: string): Promise<AppNotification> => {
        const response = await api.get(`/notifications/${id}`);
        return response.data;
    };

    const addNotification = async (formData: FormData): Promise<AppNotification> => {
        const response = await api.post('/notifications', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        setNotifications((prev) => [response.data, ...prev]);
        setAllNotifications((prev) => [response.data, ...prev]);
        return response.data;
    };

    const updateNotification = async (id: string, formData: FormData): Promise<AppNotification> => {
        const response = await api.put(`/notifications/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        setNotifications((prev) => prev.map((item) => (item._id === id ? response.data : item)));
        setAllNotifications((prev) => prev.map((item) => (item._id === id ? response.data : item)));
        return response.data;
    };

    const deleteNotification = async (id: string): Promise<void> => {
        await api.delete(`/notifications/${id}`);
        setNotifications((prev) => prev.filter((item) => item._id !== id));
        setAllNotifications((prev) => prev.filter((item) => item._id !== id));
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                allNotifications,
                loading,
                fetchNotifications,
                fetchAllNotifications,
                getNotification,
                addNotification,
                updateNotification,
                deleteNotification,
                refreshAll,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
