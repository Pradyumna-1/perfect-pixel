import { createContext, useContext } from 'react';

export interface MediaItem {
    _id: string;
    type: 'image' | 'video';
    url: string;
    title?: string;
    description?: string;
}

export interface GalleryContextType {
    mediaItems: MediaItem[];
    loading: boolean;
    addMedia: (formData: FormData) => Promise<void>;
    deleteMedia: (id: string) => Promise<void>;
    fetchMedia: () => Promise<void>;
}

export const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const useGallery = () => {
    const context = useContext(GalleryContext);
    if (!context) {
        throw new Error('useGallery must be used within a GalleryProvider');
    }
    return context;
};
