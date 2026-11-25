import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    Download,
    ExternalLink,
    FileText,
    Paperclip,
} from 'lucide-react';
import api from '../services/api-client';
import {
    formatDate,
    getCategoryLabel,
    getDownloadUrl,
    useNotifications,
    type AppNotification,
} from '../stores/notification-store';

const NotificationDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { notifications } = useNotifications();
    const [notification, setNotification] = useState<AppNotification | null>(null);
    const [loadedId, setLoadedId] = useState<string | undefined>(undefined);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        api
            .get(`/notifications/${id}`)
            .then((response) => {
                if (active) {
                    setNotification(response.data);
                    setError('');
                    setLoadedId(id);
                }
            })
            .catch(() => {
                if (active) {
                    setError('This notification is not available.');
                    setLoadedId(id);
                }
            });

        return () => {
            active = false;
        };
    }, [id]);

    const loading = loadedId !== id;

    const isClosed = (deadline: string | null) => {
        if (!deadline) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(deadline).getTime() < today.getTime();
    };

    const related = notifications
        .filter((item) => item._id !== id)
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-paper pt-16 text-ink">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link
                    to="/notifications"
                    className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-accent transition-colors mb-8"
                >
                    <ArrowLeft size={16} /> Back to Notifications
                </Link>

                {loading ? (
                    <div className="py-20 text-center text-muted">Loading notification...</div>
                ) : error || !notification ? (
                    <div className="text-center py-20 border border-dashed border-rule rounded-2xl bg-white">
                        <FileText size={40} className="mx-auto text-muted mb-4" />
                        <h2 className="text-xl font-semibold text-ink mb-2">
                            {error || 'Notification not found'}
                        </h2>
                        <Link to="/notifications" className="text-accent text-sm font-semibold">
                            Browse all notifications
                        </Link>
                    </div>
                ) : (
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white border border-rule rounded-2xl p-6 md:p-10 shadow-card"
                    >
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                            <span className="px-3 py-1 rounded-full bg-[var(--color-accent-soft)] text-accent text-xs font-semibold border border-accent/30">
                                {getCategoryLabel(notification.category)}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-ink-2">
                                <CalendarDays size={14} /> Published {formatDate(notification.createdAt)}
                            </span>
                            {notification.updatedAt && notification.updatedAt !== notification.createdAt && (
                                <span className="flex items-center gap-1.5 text-xs text-muted">
                                    <Clock3 size={14} /> Updated {formatDate(notification.updatedAt)}
                                </span>
                            )}
                        </div>

                        <h1 className="text-2xl md:text-4xl font-bold text-ink leading-tight">
                            {notification.title}
                        </h1>

                        {notification.deadline && (
                            <div
                                className={`mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium ${isClosed(notification.deadline)
                                    ? 'text-red-600 border-red-200 bg-red-50'
                                    : 'text-blue-700 border-blue-200 bg-blue-50'
                                    }`}
                            >
                                <Clock3 size={16} />
                                {isClosed(notification.deadline)
                                    ? `Applications closed on ${formatDate(notification.deadline)}`
                                    : `Last date to apply: ${formatDate(notification.deadline)}`}
                            </div>
                        )}

                        <div className="mt-8 pt-8 border-t border-rule">
                            <h2 className="text-lg font-semibold text-ink mb-4">Details</h2>
                            <div className="text-ink-2 leading-relaxed whitespace-pre-wrap">
                                {notification.description}
                            </div>
                        </div>

                        {notification.attachmentUrl && (
                            <div className="mt-8 pt-8 border-t border-rule">
                                <h2 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                                    <Paperclip size={18} className="text-accent" /> Attachment
                                </h2>
                                <a
                                    href={getDownloadUrl(notification.attachmentUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={notification.attachmentName || undefined}
                                    className="inline-flex items-center gap-3 bg-[var(--color-accent-soft)] border border-accent/30 hover:bg-accent/20 rounded-xl px-5 py-4 transition-colors"
                                >
                                    <FileText size={22} className="text-accent" />
                                    <span className="text-ink font-medium">
                                        {notification.attachmentName || 'Download attachment'}
                                    </span>
                                    <Download size={18} className="text-accent ml-2" />
                                    <ExternalLink size={14} className="text-muted" />
                                </a>
                            </div>
                        )}
                    </motion.article>
                )}

                {related.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-lg font-semibold text-ink mb-4">More Updates</h3>
                        <div className="space-y-3">
                            {related.map((item) => (
                                <Link
                                    key={item._id}
                                    to={`/notifications/${item._id}`}
                                    className="flex items-center justify-between gap-4 bg-white border border-rule hover:border-accent rounded-xl px-5 py-4 transition-colors"
                                >
                                    <div className="min-w-0">
                                        <span className="text-xs text-accent">
                                            {getCategoryLabel(item.category)}
                                        </span>
                                        <p className="text-ink font-medium truncate">{item.title}</p>
                                    </div>
                                    <span className="text-xs text-muted shrink-0">
                                        {formatDate(item.createdAt)}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationDetail;
