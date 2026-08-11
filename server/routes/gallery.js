// Gallery Route — Cloudinary for file storage (unchanged), PostgreSQL for metadata
// (replaces the Mongoose "Media" model / Firestore version)

import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import streamifier from "streamifier";
import pool from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Keep files in memory, then stream them to Cloudinary (same end result as before)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 85 * 1024 * 1024 }, // matches the 85MB limit already enforced in Admin.tsx
});

// Same auth pattern as your original code: token sent directly in the
// Authorization header (no "Bearer " prefix), matching src/api.ts
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.user = decoded;
    next();
  });
};

function uploadToCloudinary(buffer, resourceType) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "perfectpixel-gallery", resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

function toMediaItem(row) {
  // Shaped to match the MediaItem type the frontend already expects (_id, type, url, title, description)
  return {
    _id: String(row.id),
    type: row.type,
    url: row.url,
    title: row.title,
    description: row.description,
    createdAt: row.created_at,
  };
}

// GET all media
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM media ORDER BY created_at DESC");
    res.json(rows.map(toMediaItem));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Add new media (Protected)
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const { type, title, description } = req.body;
    let url = req.body.url || "";
    let publicId = null;

    if (req.file) {
      const resourceType = type === "video" ? "video" : "image";
      const result = await uploadToCloudinary(req.file.buffer, resourceType);
      url = result.secure_url;
      publicId = result.public_id;
    }

    const { rows } = await pool.query(
      `INSERT INTO media (type, url, cloudinary_public_id, title, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [type, url, publicId, title || "", description || ""]
    );

    res.status(201).json(toMediaItem(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE media — remove Postgres row and delete the asset from Cloudinary
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM media WHERE id = $1", [req.params.id]);
    const item = rows[0];
    if (!item) return res.status(404).json({ message: "Media not found" });

    if (item.cloudinary_public_id) {
      await cloudinary.uploader
        .destroy(item.cloudinary_public_id, {
          resource_type: item.type === "video" ? "video" : "image",
        })
        .catch(() => {}); // don't fail the request if Cloudinary cleanup fails
    }

    await pool.query("DELETE FROM media WHERE id = $1", [req.params.id]);
    res.json({ message: "Media deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
