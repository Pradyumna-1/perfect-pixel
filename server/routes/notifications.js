import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import multer from "multer";
import streamifier from "streamifier";
import pool from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const CATEGORIES = ["job", "notice", "result", "admit_card", "exam", "other"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 85 * 1024 * 1024 },
});

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.user = decoded;
    next();
  });
};

export async function ensureNotificationSchema() {
  const schema = fs.readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");
  await pool.query(schema);
}

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "perfectpixel-notifications",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

function toDateString(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function toNotification(row) {
  return {
    _id: String(row.id),
    title: row.title,
    category: row.category,
    description: row.description,
    deadline: toDateString(row.application_deadline),
    attachmentUrl: row.attachment_url,
    attachmentName: row.attachment_name,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function parseDeadline(value) {
  if (!value || value === "null") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function parsePublished(value, fallback = true) {
  if (value === undefined) return fallback;
  return value === true || value === "true" || value === "1";
}

function validateBody(req) {
  const title = String(req.body.title || "").trim();
  const description = String(req.body.description || "").trim();
  const selectedCategory = String(req.body.category || "notice");
  const customCategory = String(req.body.customCategory || "").trim().replace(/\s+/g, " ");

  if (!title) return { error: "Title is required" };
  if (!description) return { error: "Description is required" };
  if (!CATEGORIES.includes(selectedCategory)) return { error: "Invalid category" };
  if (selectedCategory === "other" && customCategory.length > 30) {
    return { error: "Custom category must be 30 characters or fewer" };
  }

  const category = selectedCategory === "other" && customCategory ? customCategory : selectedCategory;
  return { title, description, category };
}

router.get("/", async (req, res) => {
  try {
    const params = [];
    let query = "SELECT * FROM notifications WHERE is_published = TRUE";

    if (req.query.category && req.query.category !== "all") {
      params.push(String(req.query.category));
      query += ` AND category = $${params.length}`;
    }

    query += " ORDER BY created_at DESC";

    const limit = parseInt(req.query.limit, 10);
    if (Number.isFinite(limit) && limit > 0) {
      params.push(Math.min(limit, 100));
      query += ` LIMIT $${params.length}`;
    }

    const { rows } = await pool.query(query, params);
    res.json(rows.map(toNotification));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/manage", verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM notifications ORDER BY created_at DESC");
    res.json(rows.map(toNotification));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM notifications WHERE id = $1 AND is_published = TRUE",
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: "Notification not found" });
    res.json(toNotification(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const parsed = validateBody(req);
    if (parsed.error) return res.status(400).json({ message: parsed.error });

    let attachmentUrl = null;
    let publicId = null;
    let resourceType = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      attachmentUrl = result.secure_url;
      publicId = result.public_id;
      resourceType = result.resource_type;
    }

    const { rows } = await pool.query(
      `INSERT INTO notifications
         (title, category, description, application_deadline, attachment_url,
          attachment_public_id, attachment_resource_type, attachment_name, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        parsed.title,
        parsed.category,
        parsed.description,
        parseDeadline(req.body.deadline),
        attachmentUrl,
        publicId,
        resourceType,
        req.file ? req.file.originalname : null,
        parsePublished(req.body.isPublished),
      ]
    );

    res.status(201).json(toNotification(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const parsed = validateBody(req);
    if (parsed.error) return res.status(400).json({ message: parsed.error });

    const existing = (await pool.query("SELECT * FROM notifications WHERE id = $1", [req.params.id])).rows[0];
    if (!existing) return res.status(404).json({ message: "Notification not found" });

    let attachmentUrl = existing.attachment_url;
    let publicId = existing.attachment_public_id;
    let resourceType = existing.attachment_resource_type;
    let attachmentName = existing.attachment_name;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      attachmentUrl = result.secure_url;
      publicId = result.public_id;
      resourceType = result.resource_type;
      attachmentName = req.file.originalname;

      if (existing.attachment_public_id) {
        await cloudinary.uploader
          .destroy(existing.attachment_public_id, {
            resource_type: existing.attachment_resource_type || "image",
          })
          .catch(() => {});
      }
    } else if (req.body.removeAttachment === "true") {
      if (existing.attachment_public_id) {
        await cloudinary.uploader
          .destroy(existing.attachment_public_id, {
            resource_type: existing.attachment_resource_type || "image",
          })
          .catch(() => {});
      }
      attachmentUrl = null;
      publicId = null;
      resourceType = null;
      attachmentName = null;
    }

    const { rows } = await pool.query(
      `UPDATE notifications
         SET title = $1, category = $2, description = $3, application_deadline = $4,
             attachment_url = $5, attachment_public_id = $6,
             attachment_resource_type = $7, attachment_name = $8,
             is_published = $9, updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [
        parsed.title,
        parsed.category,
        parsed.description,
        parseDeadline(req.body.deadline),
        attachmentUrl,
        publicId,
        resourceType,
        attachmentName,
        parsePublished(req.body.isPublished, existing.is_published),
        req.params.id,
      ]
    );

    res.json(toNotification(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const existing = (await pool.query("SELECT * FROM notifications WHERE id = $1", [req.params.id])).rows[0];
    if (!existing) return res.status(404).json({ message: "Notification not found" });

    if (existing.attachment_public_id) {
      await cloudinary.uploader
        .destroy(existing.attachment_public_id, {
          resource_type: existing.attachment_resource_type || "image",
        })
        .catch(() => {});
    }

    await pool.query("DELETE FROM notifications WHERE id = $1", [req.params.id]);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
