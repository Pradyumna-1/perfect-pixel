# Deployment Guide

This project is set up to be deployed as two separate services:
1. **Frontend**: The React app (Vite) deployed on **Vercel**.
2. **Backend**: The Node.js/Express server deployed on **Render**.

## Prerequisites
- A GitHub account.
- Accounts on [Vercel](https://vercel.com) and [Render](https://render.com).
- Push this code to a new GitHub repository.

---

## Part 1: Deploy Backend (Render)

1. **Create a New Web Service**:
   - Go to your Render Dashboard.
   - Click **New +** -> **Web Service**.
   - Connect your GitHub repository.

2. **Configure the Service**:
   - **Name**: `perfect-pixel-api` (or similar).
   - **Root Directory**: `server` (Important!).
   - **Runtime**: `Node`.
   - **Build Command**: `npm install`.
   - **Start Command**: `node index.js`.

3. **Environment Variables**:
   - Scroll down to "Environment Variables" and add the following keys from your `server/.env` file:
     - `MONGODB_URI`: (Your MongoDB connection string)
     - `JWT_SECRET`: (Your secret key)
     - `CLOUDINARY_CLOUD_NAME`: (Your Cloudinary name)
     - `CLOUDINARY_API_KEY`: (Your Cloudinary key)
     - `CLOUDINARY_API_SECRET`: (Your Cloudinary secret)
     - `PORT`: `5000` (or leave blank, Render sets this automatically, but your code uses `process.env.PORT`).

4. **Deploy**:
   - Click **Create Web Service**.
   - Wait for the deployment to finish.
   - **Copy the URL** of your deployed backend (e.g., `https://perfect-pixel-api.onrender.com`).

---

## Part 2: Deploy Frontend (Vercel)

1. **Create a New Project**:
   - Go to your Vercel Dashboard.
   - Click **Add New...** -> **Project**.
   - Import your GitHub repository.

2. **Configure the Project**:
   - **Framework Preset**: Vite (should be detected automatically).
   - **Root Directory**: `./` (default).
   - **Build Command**: `npm run build` (default).
   - **Output Directory**: `dist` (default).

3. **Environment Variables**:
   - Expand the "Environment Variables" section.
   - Add the following key:
     - `VITE_API_URL`: Paste the **Backend URL** you copied from Render (e.g., `https://perfect-pixel-api.onrender.com/api`).
     - **Note**: Make sure to append `/api` if your backend routes start with it (which they do).

4. **Deploy**:
   - Click **Deploy**.
   - Wait for the build to complete.

---

## Part 3: Final Check

1. Open your Vercel deployment URL.
2. Try to log in or view the gallery.
3. If you see data, everything is working!

### Troubleshooting
- **CORS Issues**: If the frontend cannot talk to the backend, check the browser console. You might need to update `server/index.js` to explicitly allow the Vercel domain in the `cors()` configuration.
  - Currently, `app.use(cors())` allows *all* origins, so it should work out of the box.
