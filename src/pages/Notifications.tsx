import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, X } from 'lucide-react';
import { CATEGORY_LABELS, useNotifications } from '../context/notificationStore';
import NotificationTable from '../components/NotificationTable';

const Notifications = () => {
    const { notifications, loading } = useNotifications();
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return notifications;
        return notifications.filter((item) =>
            item.title.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term) ||
            (CATEGORY_LABELS[item.category] || item.category).toLowerCase().includes(term)
        );
    }, [notifications, search]);

    return (
        <div className="min-h-screen bg-primary pt-16">
            <section className="relative overflow-hidden border-b border-white/10 bg-secondary/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.14),transparent_55%)]" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold tracking-wider uppercase mb-3">
                            <Bell size={16} /> Notice Board
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white">
                            Notifications &amp; Announcements
                        </h1>
                        <p className="text-gray-400 mt-4 max-w-2xl text-base md:text-lg">
                            All job notifications, results, admit cards and important notices in one place.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-6">
                    <div className="relative w-full sm:max-w-md">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search notifications by title, details or category..."
                            className="w-full bg-secondary/60 border border-white/10 rounded-full pl-11 pr-10 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-accent transition-colors"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <p className="text-sm text-gray-500 shrink-0">
                        Showing {filtered.length} of {notifications.length} notifications
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <NotificationTable
                        items={filtered}
                        loading={loading}
                        emptyMessage={search ? 'No notifications match your search.' : undefined}
                    />
                </motion.div>
            </section>
        </div>
    );
};

export default Notifications;
