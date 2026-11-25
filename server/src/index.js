import 'dotenv/config';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import galleryRoutes from './routes/gallery.js';
import notificationRoutes, { ensureNotificationSchema } from './routes/notifications.js';

const app = express();

// Health check — ping this from a free uptime monitor to stop Render's
// free tier from putting the server to sleep after 15 min of no traffic
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({
    origin: '*', // More permissive for production, or refine with process.env.CLIENT_URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/notifications', notificationRoutes);



// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

ensureNotificationSchema()
    .then(() => console.log('Notification schema ready'))
    .catch((err) => console.error('Notification schema setup failed:', err.message));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
