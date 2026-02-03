import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// --------------------------------------------------
//  FIX CORS COMPLETELY FOR LOCAL + PRODUCTION
// --------------------------------------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",        // local frontend
      "https://your-frontend-domain.com" // replace with actual domain after deploying frontend
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.options("*", cors()); // IMPORTANT: allow preflight

app.use(express.json());

// --------------------------------------------------
//  CONTACT ROUTE
// --------------------------------------------------
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
      subject: "New Portfolio Message",
      html: `
        <h3>You received a new message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// --------------------------------------------------
app.get("/", (req, res) => {
  res.send("Backend is working fine!");
});

// --------------------------------------------------
//  RENDER PORT FIX — MUST ONLY USE process.env.PORT
// --------------------------------------------------
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
