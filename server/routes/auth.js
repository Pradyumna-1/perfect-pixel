import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import axios from "axios";
import pool from "../config/db.js";

const router = express.Router();

// Diagnostic: Test Resend API Configuration (unchanged from your original)
router.get("/test-email", async (req, res) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is missing from environment");
    }

    const response = await axios.post(
      "https://api.resend.com/emails",
      {
        from: "Test <onboarding@resend.dev>",
        to: process.env.EMAIL_USER || "delivered@resend.dev",
        subject: "Test Diagnostic - Resend",
        html: "<strong>Resend is working perfectly!</strong>",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, message: "Resend API is working!", data: response.data });
  } catch (error) {
    console.error("Resend Verification Failed:", error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: "Resend configuration invalid",
      error: error.response ? error.response.data : error.message,
    });
  }
});

// Admin seeding now lives in db/init.js (run once with `node db/init.js`)
// instead of running on every server boot — safer with a real SQL DB.

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username OR email OR phone
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $1 OR phone = $1",
      [username]
    );
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "24h" });
    return res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  try {
    let { identifier } = req.body;
    if (!identifier) return res.status(400).json({ message: "Identifier is required" });

    identifier = identifier.trim();

    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR phone = $1 OR username = $1",
      [identifier]
    );
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found with that email or phone" });
    }

    const isEmail = identifier.includes("@");

    if (isEmail) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      const expire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await pool.query(
        "UPDATE users SET reset_password_token = $1, reset_password_expire = $2 WHERE id = $3",
        [hashedToken, expire, user.id]
      );

      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      const resetUrl = `${clientUrl.replace(/\/$/, "")}/reset-password/${resetToken}`;

      try {
        const resendResponse = await axios.post(
          "https://api.resend.com/emails",
          {
            from: "Perfect Pixel <onboarding@resend.dev>",
            to: user.email,
            subject: "🔒 Reset Your Password - Perfect Pixel",
            html: `
                        <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #fca311; text-align: center;">Reset Password</h2>
                            <p>We received a request to reset your password. Click the button below to continue:</p>
                            <div style="text-align: center; margin: 30px;">
                                <a href="${resetUrl}" style="background-color: #fca311; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                            </div>
                            <p style="color: #999; font-size: 12px;">If you didn't request this, ignore this email.</p>
                            <p style="color: #999; font-size: 10px;">Link: ${resetUrl}</p>
                        </div>
                    `,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Resend Response:", resendResponse.data);
        return res.json({ message: "A secure reset link has been sent to your email." });
      } catch (emailError) {
        console.error("Resend API Error:", emailError.response ? emailError.response.data : emailError.message);
        return res.status(503).json({
          message: "Email delivery failed via Resend. Please ensure your RESEND_API_KEY is valid.",
        });
      }
    } else {
      // --- PHONE FLOW (OTP) ---
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
      const expire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await pool.query(
        "UPDATE users SET reset_password_token = $1, reset_password_expire = $2 WHERE id = $3",
        [hashedOtp, expire, user.id]
      );

      return res.json({
        message: "A security code has been generated. Please check your messages.",
        method: "otp",
        phone: user.phone,
      });
    }
  } catch (error) {
    console.error("Forgot Password error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

// Reset Password via OTP Route
router.post("/reset-password-otp", async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const { rows } = await pool.query(
      `SELECT * FROM users
       WHERE (email = $1 OR phone = $1)
         AND reset_password_token = $2
         AND reset_password_expire > NOW()`,
      [phone, hashedOtp]
    );
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expire = NULL WHERE id = $2",
      [hashedPassword, user.id]
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset Password via Link Route
router.post("/reset-password/:token", async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const { rows } = await pool.query(
      "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expire > NOW()",
      [resetPasswordToken]
    );
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await pool.query(
      "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expire = NULL WHERE id = $2",
      [hashedPassword, user.id]
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset Password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
