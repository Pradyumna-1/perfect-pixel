import { createContext, useContext } from 'react';

export type NotificationCategory = 'job' | 'notice' | 'result' | 'admit_card' | 'exam' | 'other';

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
    'job', 'notice', 'result', 'admit_card', 'exam', 'other',
];

export const CATEGORY_LABELS: Record<NotificationCategory, string> = {
    job: 'Job Notification',
    notice: 'Notice',
    result: 'Result',
    admit_card: 'Admit Card',
    exam: 'Exam',
    other: 'Other',
};

export const formatDate = (value?: string | null) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const getDownloadUrl = (url: string | null) => {
    if (!url) return '';
    if (!url.includes('cloudinary.com')) return url;
    return url.replace('/upload/', '/upload/fl_attachment/');
};

export interface AppNotification {
    _id: string;
    title: string;
    category: NotificationCategory;
    description: string;
    deadline: string | null;
    attachmentUrl: string | null;
    attachmentName: string | null;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationContextType {
    notifications: AppNotification[];
    allNotifications: AppNotification[];
    loading: boolean;
    fetchNotifications: () => Promise<void>;
    fetchAllNotifications: () => Promise<void>;
    getNotification: (id: string) => Promise<AppNotification>;
    addNotification: (formData: FormData) => Promise<AppNotification>;
    updateNotification: (id: string, formData: FormData) => Promise<AppNotification>;
    deleteNotification: (id: string) => Promise<void>;
    refreshAll: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
