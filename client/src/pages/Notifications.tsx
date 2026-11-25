import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { getCategoryLabel, useNotifications } from '../stores/notification-store';
import NotificationTable from '../components/NotificationTable';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const Notifications = () => {
    const { notifications, loading } = useNotifications();
    const [search, setSearch] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return notifications;
        return notifications.filter((item) =>
            item.title.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term) ||
            getCategoryLabel(item.category).toLowerCase().includes(term)
        );
    }, [notifications, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);
    const showingFrom = filtered.length === 0 ? 0 : startIndex + 1;
    const showingTo = Math.min(startIndex + pageSize, filtered.length);

    const goToPage = (next: number) => {
        setPage(Math.min(Math.max(next, 1), totalPages));
    };

    return (
        <div className="min-h-screen bg-paper pt-16 text-ink">
            <section className="relative overflow-hidden border-b border-rule bg-paper-2">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(47,127,209,0.12),transparent_55%)]" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold tracking-wider uppercase mb-3">
                            <Bell size={16} /> Notice Board
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-ink">
                            Notifications &amp; Announcements
                        </h1>
                        <p className="text-ink-2 mt-4 max-w-2xl text-base md:text-lg">
                            All job notifications, results, admit cards and important notices in one place.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between mb-6">
                    <div className="relative w-full lg:max-w-md">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search notifications by title, details or category..."
                            className="w-full bg-white border border-rule rounded-full pl-11 pr-10 py-3 text-sm text-ink placeholder:text-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setPage(1);
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <label htmlFor="notification-page-size" className="text-sm font-medium text-ink-2">
                            No. per page
                        </label>
                        <select
                            id="notification-page-size"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(1);
                            }}
                            className="rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                        >
                            {PAGE_SIZE_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-muted">
                            Showing {showingFrom}–{showingTo} of {filtered.length} notifications
                        </p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <NotificationTable
                        items={paginated}
                        startIndex={startIndex}
                        loading={loading}
                        emptyMessage={search ? 'No notifications match your search.' : undefined}
                    />
                </motion.div>

                {!loading && filtered.length > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted">
                            Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => goToPage(1)}
                                disabled={currentPage === 1}
                                className="rounded-lg border border-rule bg-white px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                First
                            </button>
                            <button
                                type="button"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                aria-label="Previous page"
                                className="inline-grid h-9 w-9 place-items-center rounded-lg border border-rule bg-white text-ink-2 transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="min-w-16 text-center text-sm font-semibold text-ink">
                                {currentPage}
                            </span>
                            <button
                                type="button"
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                aria-label="Next page"
                                className="inline-grid h-9 w-9 place-items-center rounded-lg border border-rule bg-white text-ink-2 transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight size={18} />
                            </button>
                            <button
                                type="button"
                                onClick={() => goToPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="rounded-lg border border-rule bg-white px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Last
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Notifications;
