import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS FIX – allow your frontend (localhost + vercel domain)
app.use(cors({
  origin: ["http://localhost:5173", "https://your-vercel-domain.com"],
  methods: ["POST", "GET"],
  allowedHeaders: ["Content-Type"]
}));

// OR to allow everything temporarily (works 100%)
//
// app.use(cors());

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
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is working fine!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
