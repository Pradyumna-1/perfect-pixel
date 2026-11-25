# Deployment Guide

The project deploys as two services: the Vite frontend in `client/` on **Vercel**
and the Express API in `server/` on **Render**.

## Backend (Render)

1. Create a **Web Service** connected to the repository.
2. Set **Root Directory** to `server`.
3. Build command: `npm install`. Start command: `npm start` (runs `node src/index.js`).
4. Set environment variables (see `server/.env.example`):
   - `DATABASE_URL` or `PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD`, and `PG_SSL` if needed
   - `JWT_SECRET`, `PORT`, `CLIENT_URL`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `RESEND_API_KEY`, `EMAIL_USER`
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL`, `ADMIN_PHONE`
5. Initialize DB once against production: `npm run db:init` from `server/` (or `node scripts/init-db.js`).
6. Verify with `GET /api/health` returning `{"ok":true}`.

## Frontend (Vercel)

1. Import the repository and set **Root Directory** to `client`.
2. Vite preset: build command `npm run build`, output directory `dist`.
3. Add `VITE_API_URL` pointing to the Render API including `/api`, e.g. `https://your-api.onrender.com/api`.
4. Deploy. `client/vercel.json` rewrites routes to `index.html` for SPA routing.

## Keep-alive

`.github/workflows/keep-alive.yml` pings the Render `/api/health` endpoint every
10 minutes. Update the URL there if the hostname changes.
