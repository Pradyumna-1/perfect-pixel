import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  LogOut,
  Paperclip,
  Pencil,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import {
  CATEGORY_LABELS,
  formatDate,
  getCategoryLabel,
  isPredefinedCategory,
  NOTIFICATION_CATEGORIES,
  useNotifications,
  type NotificationCategory,
} from '../context/notificationStore';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';
const primaryButtonClass = 'inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-50';
const dangerButtonClass = 'inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50';
const quietButtonClass = 'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50';
const pageSizeClass = 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';
const pagerButtonClass = 'inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:border-blue-500 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-40';
const PAGE_SIZE_OPTIONS = [10, 20, 50];

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
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [removeAttachment, setRemoveAttachment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
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

  const showToast = (message: string, toastType: 'success' | 'alert' = 'success') => {
    setToast({ message, type: toastType });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('job');
    setCustomCategory('');
    setDescription('');
    setDeadline('');
    setIsPublished(true);
    setFile(null);
    setRemoveAttachment(false);
  };

  const handleEdit = (item: (typeof allNotifications)[number]) => {
    setEditingId(item._id);
    setTitle(item.title);
    setCategory(isPredefinedCategory(item.category) ? item.category : 'other');
    setCustomCategory(isPredefinedCategory(item.category) ? '' : item.category);
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
    if (category === 'other' && !customCategory.trim()) {
      showToast('Enter a custom category.', 'alert');
      return;
    }
    if (file && file.size > 85 * 1024 * 1024) {
      showToast('File size exceeds 85MB limit.', 'alert');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('category', category);
    if (category === 'other') formData.append('customCategory', customCategory.trim().slice(0, 30));
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
      setPage(1);
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

  const totalPages = Math.max(1, Math.ceil(allNotifications.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedNotifications = allNotifications.slice(startIndex, startIndex + pageSize);
  const showingFrom = allNotifications.length === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(startIndex + pageSize, allNotifications.length);

  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(next, 1), totalPages));
  };

  const currentAttachment = allNotifications.find((item) => item._id === editingId)?.attachmentUrl;

  return (
    <div className="admin-page min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="mx-auto w-full max-w-6xl space-y-6 p-6 md:p-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link to="/admin" className="mb-2 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-500">
              <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
              Back to Dashboard
            </Link>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900">Manage Notifications</h1>
            <p className="mt-1 text-sm text-slate-500">Create, edit and publish job notifications and announcements.</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button type="button" onClick={handleLogout} className={dangerButtonClass}>
              <LogOut size={18} strokeWidth={2} aria-hidden="true" />
              Logout
            </button>
          </div>
        </header>

        <section id="notification-form" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-xl font-semibold text-slate-900">
              {editingId ? 'Edit Notification' : 'Add New Notification'}
            </h2>
            {editingId && (
              <button type="button" onClick={resetForm} className={quietButtonClass}>
                Cancel edit
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="grid gap-2">
              <span className="text-xs font-semibold text-slate-700">Notification title</span>
              <input
                type="text"
                placeholder="Notification title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-slate-700">Category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NotificationCategory)}
                  className={inputClass}
                >
                  {NOTIFICATION_CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {CATEGORY_LABELS[item]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-slate-700">Application deadline</span>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className={inputClass}
                  aria-label="Application deadline"
                />
              </label>
            </div>
            {category === 'other' && (
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-slate-700">Custom category</span>
                <input
                  type="text"
                  placeholder="e.g. Scholarship"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value.slice(0, 30))}
                  className={inputClass}
                  maxLength={30}
                />
              </label>
            )}
            <label className="grid gap-2">
              <span className="text-xs font-semibold text-slate-700">Full details</span>
              <textarea
                placeholder="Full details / description *"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={`${inputClass} min-h-36 resize-y`}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <span className="text-xs font-semibold text-slate-700">Attachment</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,image/*"
                  onChange={(e) => {
                    setFile(e.target.files ? e.target.files[0] : null);
                    setRemoveAttachment(false);
                  }}
                  className={`${inputClass} file:mr-3 file:rounded-full file:border-0 file:bg-blue-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-600`}
                />
                {currentAttachment && (
                  <div className="flex flex-wrap items-center gap-4">
                    <a href={currentAttachment} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600">
                      <Paperclip size={14} strokeWidth={2} aria-hidden="true" />
                      Current attachment
                    </a>
                    <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={removeAttachment}
                        onChange={(e) => setRemoveAttachment(e.target.checked)}
                        className="h-4 w-4 accent-red-500"
                      />
                      Remove
                    </label>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <span className="text-xs font-semibold text-slate-700">Visibility</span>
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 accent-blue-500"
                  />
                  {isPublished ? (
                    <>
                      <Eye size={16} strokeWidth={2} aria-hidden="true" className="text-blue-500" />
                      Published (visible to public)
                    </>
                  ) : (
                    <>
                      <EyeOff size={16} strokeWidth={2} aria-hidden="true" className="text-slate-400" />
                      Draft (hidden from public)
                    </>
                  )}
                </label>
              </div>
            </div>
            <div className="flex justify-start">
              <button type="submit" disabled={loading} className={primaryButtonClass}>
                {editingId ? <Save size={18} strokeWidth={2} aria-hidden="true" /> : <Plus size={18} strokeWidth={2} aria-hidden="true" />}
                {loading
                  ? editingId ? 'Saving...' : 'Publishing...'
                  : editingId ? 'Save Changes' : 'Publish Notification'}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-900">All Notifications</h2>
              <p className="mt-1 text-sm text-slate-500">Notices currently stored for the site.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="admin-notification-page-size" className="text-xs font-semibold text-slate-700">
                No. per page
              </label>
              <select
                id="admin-notification-page-size"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className={pageSizeClass}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                Showing {showingFrom}–{showingTo} of {allNotifications.length}
              </span>
            </div>
          </div>
          {listLoading ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              Loading notifications...
            </div>
          ) : allNotifications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              No notifications yet. Publish your first one above.
            </div>
          ) : (
            <div className="grid gap-3">
              {pagedNotifications.map((item) => (
                <article key={item._id} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                        {getCategoryLabel(item.category)}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.isPublished ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        {item.isPublished ? 'Published' : 'Draft'}
                      </span>
                      {item.attachmentUrl && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                          <Paperclip size={12} strokeWidth={2} aria-hidden="true" />
                          Attachment
                        </span>
                      )}
                    </div>
                    <h3 className="truncate text-sm font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(item.createdAt)}
                      {item.deadline && ` · Deadline ${formatDate(item.deadline)}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button type="button" onClick={() => handleEdit(item)} className={quietButtonClass}>
                      <Pencil size={15} strokeWidth={2} aria-hidden="true" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemToDelete(item._id)}
                      aria-label="Delete notification"
                      className="inline-grid h-9 w-9 place-items-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                    >
                      <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
          {!listLoading && allNotifications.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => goToPage(1)} disabled={currentPage === 1} className={pagerButtonClass}>
                  First
                </button>
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className={`${pagerButtonClass} w-9 px-0`}
                >
                  <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
                </button>
                <span className="min-w-8 text-center text-sm font-semibold text-slate-900">{currentPage}</span>
                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className={`${pagerButtonClass} w-9 px-0`}
                >
                  <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} className={pagerButtonClass}>
                  Last
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {itemToDelete && (
          <motion.div
            className="fixed inset-0 z-[100] grid place-items-center bg-slate-900/60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setItemToDelete(null)}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-notification-title"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-500">
                <AlertCircle size={32} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h2 id="delete-notification-title" className="font-display text-xl font-semibold text-slate-900">Delete notification?</h2>
              <p className="mt-2 text-sm text-slate-500">This will permanently remove the post and its attachment. This action cannot be undone.</p>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setItemToDelete(null)} className={`${quietButtonClass} flex-1`}>
                  Cancel
                </button>
                <button type="button" onClick={confirmDelete} disabled={loading} className={`${dangerButtonClass} flex-1`}>
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            tone={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminNotifications;
