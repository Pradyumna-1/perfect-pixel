import { motion, AnimatePresence } from 'framer-motion';
import { useGallery, type MediaItem } from '../context/GalleryContext';
import { useState } from 'react';
import { X } from 'lucide-react';

const Gallery = () => {
    const { mediaItems, loading } = useGallery();
    const [visibleCount, setVisibleCount] = useState(6);
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

    const loadMore = () => {
        setVisibleCount((prev) => prev + 6);
    };

    if (loading) {
        return <div className="py-20 text-center text-white">Loading Gallery...</div>;
    }

    // Helper to generate optimized Cloudinary URLs
    const getOptimizedUrl = (url: string, width: number) => {
        if (!url || !url.includes('cloudinary.com')) return url;
        // Insert transformation params before /v\d+/ or /upload/
        // Example: .../upload/v123... -> .../upload/w_600,q_auto,f_auto/v123...
        const parts = url.split('/upload/');
        if (parts.length < 2) return url;
        return `${parts[0]}/upload/w_${width},q_auto,f_auto/${parts[1]}`;
    };

    return (
        <section id="gallery" className="py-20 bg-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-accent font-semibold tracking-wider uppercase mb-2">Portfolio</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">Captured Moments</h3>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                        A glimpse into our photography and videography work. We make your memories timeless.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.isArray(mediaItems) && mediaItems.slice(0, visibleCount).map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative group overflow-hidden rounded-xl aspect-[4/3]"
                        >
                            {item.type === 'image' ? (
                                <img
                                    src={getOptimizedUrl(item.url, 600)}
                                    alt={item.title || "Gallery"}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <video
                                    src={getOptimizedUrl(item.url, 700)}
                                    className="w-full h-full object-cover"
                                    muted
                                    loop
                                    playsInline
                                    autoPlay
                                    preload="metadata"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                                {item.title && (
                                    <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                                )}
                                {item.description && (
                                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">{item.description}</p>
                                )}
                                <button
                                    onClick={() => setSelectedItem(item)}
                                    className="text-accent font-semibold border border-accent px-4 py-2 rounded-full hover:bg-accent hover:text-white transition-colors"
                                >
                                    View Project
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {visibleCount < mediaItems.length && (
                    <div className="text-center mt-12">
                        <button
                            onClick={loadMore}
                            className="bg-accent hover:bg-accent/80 text-white font-bold py-3 px-8 rounded-full transition-colors"
                        >
                            Load More
                        </button>
                    </div>
                )}

                {/* Lightbox Modal */}
                <AnimatePresence>
                    {selectedItem && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                            onClick={() => setSelectedItem(null)}
                        >
                            <button
                                className="absolute top-4 right-4 text-white hover:text-accent transition-colors"
                                onClick={() => setSelectedItem(null)}
                            >
                                <X size={32} />
                            </button>
                            <div
                                className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {selectedItem.type === 'image' ? (
                                    <img
                                        src={getOptimizedUrl(selectedItem.url, 1200)} // Request higher res for lightbox
                                        alt={selectedItem.title || "Gallery"}
                                        className="max-w-full max-h-[90vh] object-contain rounded-lg"
                                    />
                                ) : (
                                    <video
                                        src={getOptimizedUrl(selectedItem.url, 1200)}
                                        className="max-w-full max-h-[90vh] rounded-lg"
                                        controls
                                        autoPlay
                                    />
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Gallery;
