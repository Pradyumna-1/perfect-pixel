import React, { useEffect, useState } from 'react';
import api from '../services/api-client';
import { GalleryContext, type MediaItem } from './gallery-store';

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
        // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
        void fetchMedia();
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
