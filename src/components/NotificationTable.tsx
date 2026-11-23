import { Link } from 'react-router-dom';
import { CalendarDays, Clock3, Paperclip } from 'lucide-react';
import { CATEGORY_LABELS, formatDate, type AppNotification } from '../context/notificationStore';

interface NotificationTableProps {
    items: AppNotification[];
    loading?: boolean;
    emptyMessage?: string;
}

const NotificationTable = ({
    items,
    loading = false,
    emptyMessage = 'No notifications published yet.',
}: NotificationTableProps) => {
    const isClosed = (deadline: string | null) =>
        !!deadline && new Date(deadline).getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime();

    return (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-primary/60">
            <table className="w-full min-w-[680px] text-left">
                <thead>
                    <tr className="bg-white/5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        <th className="px-5 py-4 w-20">Sl. No.</th>
                        <th className="px-5 py-4">Notification Details</th>
                        <th className="px-5 py-4 w-44 whitespace-nowrap">Published On</th>
                        <th className="px-5 py-4 w-28 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {loading ? (
                        <tr>
                            <td colSpan={4} className="px-5 py-16 text-center text-gray-400">
                                Loading notifications...
                            </td>
                        </tr>
                    ) : items.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-5 py-16 text-center text-gray-400">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        items.map((item, index) => (
                            <tr key={item._id} className="hover:bg-white/[0.03] transition-colors align-top">
                                <td className="px-5 py-5 text-accent font-bold">
                                    {String(index + 1).padStart(2, '0')}
                                </td>
                                <td className="px-5 py-5">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className="px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-[11px] font-semibold border border-accent/30">
                                            {CATEGORY_LABELS[item.category] || item.category}
                                        </span>
                                        {item.deadline && (
                                            <span
                                                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${isClosed(item.deadline)
                                                    ? 'text-red-400 border-red-400/30 bg-red-400/10'
                                                    : 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
                                                    }`}
                                            >
                                                <Clock3 size={11} />
                                                {isClosed(item.deadline)
                                                    ? 'Closed'
                                                    : `Last date: ${formatDate(item.deadline)}`}
                                            </span>
                                        )}
                                        {item.attachmentUrl && (
                                            <span className="flex items-center gap-1 text-[11px] text-gray-500">
                                                <Paperclip size={12} /> Attachment
                                            </span>
                                        )}
                                    </div>
                                    <Link
                                        to={`/notifications/${item._id}`}
                                        className="text-base md:text-lg font-bold text-white hover:text-accent transition-colors"
                                    >
                                        {item.title}
                                    </Link>
                                    <p className="text-sm text-gray-400 leading-relaxed mt-1.5 line-clamp-2">
                                        {item.description}
                                    </p>
                                </td>
                                <td className="px-5 py-5">
                                    <span className="flex items-center gap-1.5 text-sm text-gray-400 whitespace-nowrap">
                                        <CalendarDays size={14} /> {formatDate(item.createdAt)}
                                    </span>
                                </td>
                                <td className="px-5 py-5 text-right">
                                    <Link
                                        to={`/notifications/${item._id}`}
                                        className="inline-block px-3 py-1.5 rounded-lg border border-accent/40 text-accent text-xs font-semibold hover:bg-accent hover:text-white transition-colors"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default NotificationTable;
