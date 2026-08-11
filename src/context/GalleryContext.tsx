import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

export interface MediaItem {
    _id: string;
    type: 'image' | 'video';
    url: string;
    title?: string;
    description?: string;
}

interface GalleryContextType {
    mediaItems: MediaItem[];
    loading: boolean;
    addMedia: (formData: FormData) => Promise<void>;
    deleteMedia: (id: string) => Promise<void>;
    fetchMedia: () => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMedia = async () => {
        try {
            const response = await api.get('/gallery');
            if (Array.isArray(response.data)) {
                setMediaItems(response.data);
            } else {
                console.error('Expected array from /gallery API, got:', response.data);
                setMediaItems([]);
            }
        } catch (error) {
            console.error('Error fetching media:', error);
            setMediaItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const addMedia = async (formData: FormData) => {
        try {
            const response = await api.post('/gallery', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMediaItems((prev) => [response.data, ...prev]);
        } catch (error) {
            console.error('Error adding media:', error);
            throw error;
        }
    };

    const deleteMedia = async (id: string) => {
        try {
            await api.delete(`/gallery/${id}`);
            setMediaItems((prev) => prev.filter((item) => item._id !== id));
        } catch (error) {
            console.error('Error deleting media:', error);
            throw error;
        }
    };

    return (
        <GalleryContext.Provider value={{ mediaItems, loading, addMedia, deleteMedia, fetchMedia }}>
            {children}
        </GalleryContext.Provider>
    );
};

export const useGallery = () => {
    const context = useContext(GalleryContext);
    if (!context) {
        throw new Error('useGallery must be used within a GalleryProvider');
    }
    return context;
};
