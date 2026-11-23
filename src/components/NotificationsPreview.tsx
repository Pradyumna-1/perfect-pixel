import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Bell } from 'lucide-react';
import { useNotifications } from '../context/notificationStore';
import NotificationTable from './NotificationTable';

const VISIBLE_COUNT = 6;

const NotificationsPreview = () => {
    const { notifications, loading } = useNotifications();
    const items = notifications.slice(0, VISIBLE_COUNT);

    return (
        <section id="notifications" className="py-20 bg-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-accent font-semibold tracking-wider uppercase mb-2 flex items-center justify-center gap-2">
                        <Bell size={18} /> Notice Board
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">Latest Notifications</h3>
                    <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
                        Job notifications, results, admit cards and important announcements.
                    </p>
                    <div className="w-20 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <NotificationTable items={items} loading={loading} />
                </motion.div>

                <div className="text-center mt-8">
                    <Link
                        to="/notifications"
                        className="inline-flex items-center gap-2 bg-accent hover:bg-accent/80 text-white font-bold py-3 px-8 rounded-full transition-colors"
                    >
                        Load More <ArrowRight size={18} />
                    </Link>
                    <p className="text-xs text-gray-500 mt-3">
                        View all notifications on the full notice board
                    </p>
                </div>
            </div>
        </section>
    );
};

export default NotificationsPreview;
