import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ FIX 1: Allow preflight OPTIONS requests
app.options("*", cors());

// ✅ FIX 2: CORS for frontend (localhost + vercel)
app.use(cors({
  origin: ["http://localhost:5173", "https://pranith-konda.vercel.app"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// Required for parsing JSON
app.use(express.json());

// ---- CONTACT ROUTE ----
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.RECEIVER_EMAIL,
      subject: "New Message from Portfolio",
      html: `
        <h3>You received a new message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    res.json({ success: true, message: "Message sent successfully!" });

  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Simple check route
app.get("/", (req, res) => {
  res.send("Backend is working fine!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
