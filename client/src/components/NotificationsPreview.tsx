import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Bell } from 'lucide-react';
import { useNotifications } from '../stores/notification-store';
import NotificationTable from './NotificationTable';

const VISIBLE_COUNT = 6;

const NotificationsPreview = () => {
    const { notifications, loading } = useNotifications();
    const items = notifications.slice(0, VISIBLE_COUNT);

    return (
        <section id="notifications" className="relative overflow-hidden py-12 md:py-16 bg-paper-2">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(47,127,209,0.10),transparent_55%)]" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-7">
                    <h2 className="text-accent text-xs font-semibold tracking-wider uppercase mb-2 flex items-center justify-center gap-2">
                        <Bell size={16} /> Notice Board
                    </h2>
                    <h3 className="text-xl md:text-2xl font-semibold text-ink">Latest Notifications</h3>
                    <p className="text-gray-400 text-xs md:text-sm mt-2 max-w-xl mx-auto">
                        Job notifications, results, admit cards and important announcements.
                    </p>
                    <div className="w-16 h-0.5 bg-accent mx-auto mt-3 rounded-full"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <NotificationTable items={items} loading={loading} compact />
                </motion.div>

                <div className="text-center mt-6">
                    <Link
                        to="/notifications"
                        className="inline-flex items-center gap-2 bg-accent hover:bg-accent/80 text-white text-sm font-semibold py-2 px-6 rounded-full transition-colors"
                    >
                        Load More <ArrowRight size={16} />
                    </Link>
                    <p className="text-[11px] text-gray-500 mt-2">
                        View all notifications on the full notice board
                    </p>
                </div>
            </div>
        </section>
    );
};

export default NotificationsPreview;
