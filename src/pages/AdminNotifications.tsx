import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    LogOut,
    Paperclip,
    Pencil,
    Plus,
    Save,
    Trash2,
    X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
    CATEGORY_LABELS,
    formatDate,
    NOTIFICATION_CATEGORIES,
    useNotifications,
    type NotificationCategory,
} from '../context/notificationStore';

const AdminNotifications = () => {
    const {
        allNotifications,
        fetchAllNotifications,
        addNotification,
        updateNotification,
        deleteNotification,
    } = useNotifications();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<NotificationCategory>('job');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [isPublished, setIsPublished] = useState(true);
    const [file, setFile] = useState<File | null>(null);
    const [removeAttachment, setRemoveAttachment] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(true);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);

    useEffect(() => {
        let active = true;
        fetchAllNotifications().finally(() => {
            if (active) setListLoading(false);
        });
        return () => {
            active = false;
        };
    }, [fetchAllNotifications]);

    const showToast = (message: string, type: 'success' | 'alert' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setCategory('job');
        setDescription('');
        setDeadline('');
        setIsPublished(true);
        setFile(null);
        setRemoveAttachment(false);
    };

    const handleEdit = (item: (typeof allNotifications)[number]) => {
        setEditingId(item._id);
        setTitle(item.title);
        setCategory(item.category);
        setDescription(item.description);
        setDeadline(item.deadline || '');
        setIsPublished(item.isPublished);
        setFile(null);
        setRemoveAttachment(false);
        document.getElementById('notification-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            showToast('Title and description are required.', 'alert');
            return;
        }

        if (file && file.size > 85 * 1024 * 1024) {
            showToast('File size exceeds 85MB limit.', 'alert');
            return;
        }

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('category', category);
        formData.append('description', description.trim());
        formData.append('deadline', deadline);
        formData.append('isPublished', String(isPublished));
        if (file) formData.append('file', file);
        if (removeAttachment) formData.append('removeAttachment', 'true');

        setLoading(true);
        try {
            if (editingId) {
                await updateNotification(editingId, formData);
                showToast('Notification updated successfully!');
            } else {
                await addNotification(formData);
                showToast('Notification published successfully!');
            }
            resetForm();
            await fetchAllNotifications();
        } catch {
            showToast(editingId ? 'Failed to update notification' : 'Failed to publish notification', 'alert');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setLoading(true);
        try {
            await deleteNotification(itemToDelete);
            showToast('Notification deleted successfully!');
            if (itemToDelete === editingId) resetForm();
        } catch {
            showToast('Failed to delete notification', 'alert');
        } finally {
            setLoading(false);
            setItemToDelete(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const currentAttachment = allNotifications.find((item) => item._id === editingId)?.attachmentUrl;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
                    <div>
                        <Link
                            to="/admin"
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-accent transition-colors mb-2"
                        >
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Paperclip className="text-accent" size={28} /> Manage Notifications
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Create, edit and publish job notifications and announcements.
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>

                <div id="notification-form" className="bg-gray-800 p-6 rounded-xl mb-10 scroll-mt-24">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-semibold">
                            {editingId ? 'Edit Notification' : 'Add New Notification'}
                        </h2>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Notification title *"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 outline-none focus:border-accent"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as NotificationCategory)}
                                className="bg-gray-700 border border-gray-600 rounded p-2.5 outline-none focus:border-accent"
                            >
                                {NOTIFICATION_CATEGORIES.map((item) => (
                                    <option key={item} value={item}>
                                        {CATEGORY_LABELS[item]}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="bg-gray-700 border border-gray-600 rounded p-2.5 outline-none focus:border-accent"
                                aria-label="Application deadline"
                            />
                        </div>

                        <textarea
                            placeholder="Full details / description *"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 outline-none focus:border-accent h-36 resize-y"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Attachment (PDF, Word or image, max 85MB)
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.txt,image/*"
                                    onChange={(e) => {
                                        setFile(e.target.files ? e.target.files[0] : null);
                                        setRemoveAttachment(false);
                                    }}
                                    className="w-full text-sm bg-gray-700 border border-gray-600 rounded p-2 outline-none focus:border-accent text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-white hover:file:bg-accent/80"
                                />
                                {currentAttachment && (
                                    <div className="flex items-center gap-3 mt-2 text-sm">
                                        <a
                                            href={currentAttachment}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent hover:underline truncate"
                                        >
                                            Current attachment
                                        </a>
                                        <label className="flex items-center gap-1.5 text-gray-400 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={removeAttachment}
                                                onChange={(e) => setRemoveAttachment(e.target.checked)}
                                                className="accent-red-500"
                                            />
                                            Remove
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col justify-end pb-1">
                                <label className="flex items-center gap-2.5 text-sm text-gray-300 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isPublished}
                                        onChange={(e) => setIsPublished(e.target.checked)}
                                        className="accent-accent w-4 h-4"
                                    />
                                    {isPublished ? (
                                        <span className="flex items-center gap-1.5">
                                            <Eye size={16} className="text-emerald-400" /> Published (visible to public)
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5">
                                            <EyeOff size={16} className="text-gray-500" /> Draft (hidden from public)
                                        </span>
                                    )}
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-accent hover:bg-accent/80 px-6 py-2.5 rounded font-bold flex items-center gap-2 justify-center disabled:opacity-50 self-start"
                        >
                            {editingId ? <Save size={20} /> : <Plus size={20} />}
                            {loading
                                ? editingId ? 'Saving...' : 'Publishing...'
                                : editingId ? 'Save Changes' : 'Publish Notification'}
                        </button>
                    </form>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl">
                    <h2 className="text-xl font-semibold mb-5">
                        All Notifications <span className="text-gray-500 text-base">({allNotifications.length})</span>
                    </h2>

                    {listLoading ? (
                        <div className="py-12 text-center text-gray-400">Loading notifications...</div>
                    ) : allNotifications.length === 0 ? (
                        <div className="py-12 text-center text-gray-400">
                            No notifications yet. Publish your first one above.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {allNotifications.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                            <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-xs font-semibold">
                                                {CATEGORY_LABELS[item.category] || item.category}
                                            </span>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.isPublished
                                                    ? 'bg-emerald-500/15 text-emerald-400'
                                                    : 'bg-gray-600/30 text-gray-400'
                                                    }`}
                                            >
                                                {item.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                            {item.attachmentUrl && (
                                                <Paperclip size={14} className="text-gray-500" />
                                            )}
                                        </div>
                                        <h3 className="text-white font-semibold truncate">{item.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatDate(item.createdAt)}
                                            {item.deadline && ` · Deadline ${formatDate(item.deadline)}`}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-600 hover:border-accent hover:text-accent transition-colors text-sm"
                                        >
                                            <Pencil size={15} /> Edit
                                        </button>
                                        <button
                                            onClick={() => setItemToDelete(item._id)}
                                            className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors"
                                            aria-label="Delete notification"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {itemToDelete && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setItemToDelete(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center"
                        >
                            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Delete Notification?</h3>
                            <p className="text-gray-400 mb-8">
                                This will permanently remove the post and its attachment. This action cannot be undone.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setItemToDelete(null)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors font-bold disabled:opacity-50"
                                >
                                    {loading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={`fixed top-6 left-1/2 z-[200] px-5 py-2 rounded-full shadow-2xl flex items-center gap-3 border backdrop-blur-md ${toast.type === 'success'
                            ? 'bg-black/80 border-green-500/50 text-white'
                            : 'bg-black/80 border-red-500/50 text-white'
                            }`}
                    >
                        {toast.type === 'success' ? (
                            <CheckCircle2 size={18} className="text-green-400" />
                        ) : (
                            <AlertCircle size={18} className="text-red-400" />
                        )}
                        <span className="text-sm font-medium tracking-tight whitespace-nowrap">{toast.message}</span>
                        <button
                            onClick={() => setToast(null)}
                            className="ml-1 p-0.5 hover:bg-white/10 rounded-full transition-colors text-gray-400"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminNotifications;
