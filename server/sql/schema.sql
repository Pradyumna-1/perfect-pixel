-- Replaces models/User.js and models/Media.js

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  reset_password_token VARCHAR(255),
  reset_password_expire TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  type VARCHAR(10) NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  cloudinary_public_id TEXT,
  title VARCHAR(255) DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  category VARCHAR(30) NOT NULL DEFAULT 'notice',
  description TEXT NOT NULL DEFAULT '',
  application_deadline DATE,
  attachment_url TEXT,
  attachment_public_id TEXT,
  attachment_resource_type VARCHAR(20),
  attachment_name VARCHAR(255),
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON notifications(category);
