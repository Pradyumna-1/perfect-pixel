import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Bell, ChevronLeft, ChevronRight, LogOut, Plus, Trash2 } from 'lucide-react';
import { useGallery } from '../context/GalleryContext';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';
const primaryButtonClass = 'inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-50';
const dangerButtonClass = 'inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50';
const quietButtonClass = 'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50';
const pageSizeClass = 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';
const pagerButtonClass = 'inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:border-blue-500 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-40';
const PAGE_SIZE_OPTIONS = [10, 20, 50];

const Admin = () => {
  const { mediaItems, addMedia, deleteMedia } = useGallery();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'image' | 'video'>('image');
  const [loading, setLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);

  const showToast = (message: string, toastType: 'success' | 'alert' = 'success') => {
    setToast({ message, type: toastType });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const maxSize = 85 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast('File size exceeds 85MB limit.', 'alert');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('title', title);
    formData.append('description', description);

    try {
      await addMedia(formData);
      setFile(null);
      setTitle('');
      setDescription('');
      setPage(1);
      showToast('Media uploaded successfully!');
    } catch {
      showToast('Failed to add media', 'alert');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setLoading(true);
    try {
      await deleteMedia(itemToDelete);
      showToast('Item deleted successfully!');
    } catch {
      showToast('Failed to delete media', 'alert');
    } finally {
      setLoading(false);
      setItemToDelete(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mediaList = Array.isArray(mediaItems) ? mediaItems : [];
  const totalPages = Math.max(1, Math.ceil(mediaList.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedMedia = mediaList.slice(startIndex, startIndex + pageSize);
  const showingFrom = mediaList.length === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(startIndex + pageSize, mediaList.length);

  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(next, 1), totalPages));
  };

  return (
    <div className="admin-page min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="mx-auto w-full max-w-6xl space-y-6 p-6 md:p-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Upload gallery media and manage site notifications.</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Link to="/admin/notifications" className={primaryButtonClass}>
              <Bell size={18} strokeWidth={2} aria-hidden="true" />
              Manage Notifications
            </Link>
            <button type="button" onClick={handleLogout} className={dangerButtonClass}>
              <LogOut size={18} strokeWidth={2} aria-hidden="true" />
              Logout
            </button>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="font-display text-xl font-semibold text-slate-900">Add New Media</h2>
            <p className="mt-1 text-sm text-slate-500">Images and videos are shown in the public gallery.</p>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-slate-700">Media type</span>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'image' | 'video')}
                  className={inputClass}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-slate-700">File</span>
                <input
                  type="file"
                  accept={type === 'image' ? 'image/*' : 'video/*'}
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  className={`${inputClass} file:mr-3 file:rounded-full file:border-0 file:bg-blue-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-600`}
                />
              </label>
            </div>
            <label className="grid gap-2">
              <span className="text-xs font-semibold text-slate-700">Title</span>
              <input
                type="text"
                placeholder="Title (Optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-semibold text-slate-700">Description</span>
              <textarea
                placeholder="Description (Optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`${inputClass} min-h-28 resize-y`}
              />
            </label>
            <div className="flex justify-start">
              <button type="submit" disabled={loading || !file} className={primaryButtonClass}>
                <Plus size={18} strokeWidth={2} aria-hidden="true" />
                {loading ? 'Uploading...' : 'Upload Media'}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-900">Gallery Media</h2>
              <p className="mt-1 text-sm text-slate-500">Currently published gallery items.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="admin-gallery-page-size" className="text-xs font-semibold text-slate-700">
                No. per page
              </label>
              <select
                id="admin-gallery-page-size"
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
                Showing {showingFrom}–{showingTo} of {mediaList.length}
              </span>
            </div>
          </div>
          {mediaList.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              No media yet. Upload an image or video above.
            </div>
          ) : (
            <div className="grid gap-3">
              {pagedMedia.map((item) => (
                <article key={item._id} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
                  <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.title || 'Gallery'} className="h-full w-full object-cover" />
                    ) : (
                      <video src={item.url} controls className="h-full w-full object-cover" aria-label={item.title || 'Gallery video'} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-slate-900">{item.title || 'Untitled'}</h3>
                    <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {item.type}
                    </span>
                    {item.description && <p className="mt-2 text-sm text-slate-500">{item.description}</p>}
                  </div>
                  <div className="flex shrink-0 justify-end">
                    <button
                      type="button"
                      onClick={() => setItemToDelete(item._id)}
                      aria-label={`Delete ${item.title || 'media'}`}
                      className="inline-grid h-9 w-9 place-items-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                    >
                      <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
          {mediaList.length > 0 && (
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
              aria-labelledby="delete-media-title"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-500">
                <AlertCircle size={32} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h2 id="delete-media-title" className="font-display text-xl font-semibold text-slate-900">Delete item?</h2>
              <p className="mt-2 text-sm text-slate-500">This action cannot be undone. The media will be removed from the gallery.</p>
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

export default Admin;
