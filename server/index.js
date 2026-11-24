import 'dotenv/config';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import express from 'express';
// import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import galleryRoutes from './routes/gallery.js';
import notificationRoutes, { ensureNotificationSchema } from './routes/notifications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// --- PRODUCTION SETUP ---
// (Not required for API-only deployment on Render)


// Database Connection
// mongoose.connection.on('connected', () => console.log('Mongoose connected'));
// mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
// mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// mongoose.connect(process.env.MONGODB_URI)
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((err) => console.error('MongoDB connection error:', err));

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
