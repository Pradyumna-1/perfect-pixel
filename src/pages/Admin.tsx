import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGallery } from '../context/GalleryContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, LogOut, Plus, AlertCircle, CheckCircle2, X } from 'lucide-react';

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
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);

    const showToast = (message: string, type: 'success' | 'alert' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        // Validate file size (85MB)
        const MAX_SIZE = 85 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
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
            showToast('Media uploaded successfully!');
        } catch (error) {
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
        } catch (error) {
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

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>

                {/* Add Media Form */}
                <div className="bg-gray-800 p-6 rounded-xl mb-8">
                    <h2 className="text-xl font-semibold mb-4">Add New Media</h2>
                    <form onSubmit={handleAdd} className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as 'image' | 'video')}
                                className="bg-gray-700 border border-gray-600 rounded p-2 outline-none focus:border-accent"
                            >
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                            </select>
                            <input
                                type="file"
                                accept={type === 'image' ? 'image/*' : 'video/*'}
                                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                className="flex-1 bg-gray-700 border border-gray-600 rounded p-2 outline-none focus:border-accent text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent/80"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Title (Optional)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded p-2 outline-none focus:border-accent"
                        />
                        <textarea
                            placeholder="Description (Optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded p-2 outline-none focus:border-accent h-24 resize-none"
                        />
                        <button
                            type="submit"
                            disabled={loading || !file}
                            className="bg-accent hover:bg-accent/80 px-6 py-2 rounded font-bold flex items-center gap-2 justify-center disabled:opacity-50 self-start"
                        >
                            <Plus size={20} /> {loading ? 'Uploading...' : 'Upload Media'}
                        </button>
                    </form>
                </div>

                {/* Media List */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.isArray(mediaItems) && mediaItems.map((item) => (
                        <div key={item._id} className="relative group bg-gray-800 rounded-lg overflow-hidden">
                            <div className="aspect-video">
                                {item.type === 'image' ? (
                                    <img src={item.url} alt={item.title || "Gallery"} className="w-full h-full object-cover" />
                                ) : (
                                    <video src={item.url} className="w-full h-full object-cover" controls />
                                )}
                            </div>
                            <div className="p-4 flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-white truncate">{item.title || 'Untitled'}</h3>
                                        <p className="text-xs text-gray-400 capitalize">{item.type}</p>
                                    </div>
                                    <button
                                        onClick={() => setItemToDelete(item._id)}
                                        className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                                {item.description && (
                                    <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Confirmation Modal */}
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
                            <h3 className="text-xl font-bold mb-2">Delete Item?</h3>
                            <p className="text-gray-400 mb-8">This action cannot be undone. Are you sure you want to delete this item?</p>
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

            {/* Slim Minimalist Toaster */}
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
                        <button onClick={() => setToast(null)} className="ml-1 p-0.5 hover:bg-white/10 rounded-full transition-colors text-gray-400">
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Admin;
