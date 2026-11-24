import { Link } from 'react-router-dom';
import { CalendarDays, Clock3, Paperclip } from 'lucide-react';
import { formatDate, getCategoryLabel, type AppNotification } from '../context/notificationStore';

interface NotificationTableProps {
    items: AppNotification[];
    loading?: boolean;
    emptyMessage?: string;
    startIndex?: number;
    compact?: boolean;
}

const NotificationTable = ({
    items,
    loading = false,
    emptyMessage = 'No notifications published yet.',
    startIndex = 0,
    compact = false,
}: NotificationTableProps) => {
    const isClosed = (deadline: string | null) =>
        !!deadline && new Date(deadline).getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    const shellClass = compact
        ? 'overflow-x-auto rounded-[20px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.62),rgba(231,241,252,0.42))] shadow-[0_24px_60px_-34px_rgba(15,23,42,0.45)] backdrop-blur-md'
        : 'overflow-x-auto rounded-2xl border border-rule bg-white shadow-card';
    const headRowClass = compact
        ? 'bg-white/35 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-2'
        : 'bg-paper-2 text-xs font-semibold uppercase tracking-wider text-muted';
    const dividerClass = compact ? 'divide-y divide-white/45' : 'divide-y divide-rule';
    const rowClass = compact
        ? 'hover:bg-white/40 transition-colors align-top'
        : 'hover:bg-paper-2/60 transition-colors align-top';
    const headCellClass = compact ? 'px-4 py-3' : 'px-5 py-4';
    const bodyCellClass = compact ? 'px-4 py-3' : 'px-5 py-5';
    const emptyCellClass = compact ? 'px-4 py-9' : 'px-5 py-16';

    return (
        <div className={shellClass}>
            <table className={`w-full ${compact ? 'min-w-[600px]' : 'min-w-[680px]'} text-left`}>
                <thead>
                    <tr className={headRowClass}>
                        <th className={`${headCellClass} w-20`}>Sl. No.</th>
                        <th className={headCellClass}>Notification Details</th>
                        <th className={`${headCellClass} w-44 whitespace-nowrap`}>Published On</th>
                        <th className={`${headCellClass} w-28 text-right`}>Action</th>
                    </tr>
                </thead>
                <tbody className={dividerClass}>
                    {loading ? (
                        <tr>
                            <td colSpan={4} className={`${emptyCellClass} text-center text-muted`}>
                                Loading notifications...
                            </td>
                        </tr>
                    ) : items.length === 0 ? (
                        <tr>
                            <td colSpan={4} className={`${emptyCellClass} text-center text-muted`}>
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        items.map((item, index) => (
                            <tr key={item._id} className={rowClass}>
                                <td className={`${bodyCellClass} ${compact ? 'text-xs md:text-sm' : 'text-sm'} font-bold tracking-wide text-accent`}>
                                    {String(startIndex + index + 1).padStart(2, '0')}
                                </td>
                                <td className={bodyCellClass}>
                                    <div className={`flex flex-wrap items-center gap-2 ${compact ? 'mb-1.5' : 'mb-2'}`}>
                                        <span className={`px-2.5 py-1 rounded-full ${compact ? 'bg-white/70 text-[11px]' : 'bg-[var(--color-accent-soft)] text-[11px]'} font-semibold text-accent border border-accent/30`}>
                                            {getCategoryLabel(item.category)}
                                        </span>
                                        {item.deadline && (
                                            <span
                                                className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${compact ? 'text-[11px]' : 'text-[11px]'} font-medium border ${isClosed(item.deadline)
                                                    ? 'text-red-600 border-red-200 bg-red-50'
                                                    : 'text-blue-700 border-blue-200 bg-blue-50'
                                                    }`}
                                            >
                                                <Clock3 size={11} />
                                                {isClosed(item.deadline)
                                                    ? 'Closed'
                                                    : `Last date: ${formatDate(item.deadline)}`}
                                            </span>
                                        )}
                                        {item.attachmentUrl && (
                                            <span className={`flex items-center gap-1 ${compact ? 'text-[11px]' : 'text-[11px]'} text-muted`}>
                                                <Paperclip size={12} /> Attachment
                                            </span>
                                        )}
                                    </div>
                                    <Link
                                        to={`/notifications/${item._id}`}
                                        className={`${compact ? 'text-xs md:text-sm' : 'text-base md:text-lg'} font-semibold text-ink hover:text-accent transition-colors`}
                                    >
                                        {item.title}
                                    </Link>
                                    <p className={`${compact ? 'text-xs leading-snug mt-1' : 'text-sm leading-relaxed mt-1.5'} text-ink-2 line-clamp-2`}>
                                        {item.description}
                                    </p>
                                </td>
                                <td className={bodyCellClass}>
                                    <span className={`flex items-center gap-1.5 ${compact ? 'text-xs' : 'text-sm'} text-ink-2 whitespace-nowrap`}>
                                        <CalendarDays size={14} /> {formatDate(item.createdAt)}
                                    </span>
                                </td>
                                <td className={`${bodyCellClass} text-right`}>
                                    <Link
                                        to={`/notifications/${item._id}`}
                                        className={`inline-block rounded-lg border font-semibold transition-all ${
                                            compact
                                                ? 'px-3.5 py-1.5 text-xs bg-[#2f7fd1] text-white border-[#2f7fd1] shadow-sm hover:bg-transparent hover:text-[#2f7fd1] hover:shadow-none'
                                                : 'px-3 py-1.5 text-xs text-accent border-accent/40 hover:bg-accent hover:text-white'
                                        }`}
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
