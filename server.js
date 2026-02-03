import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
app.use(express.json());

// ---------------------------------------------
// CORS (LOCAL + LIVE)
// ---------------------------------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://pranithkonda.online",
      "https://www.pranithkonda.online",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.options("*", cors());

// ---------------------------------------------
// RESEND
// ---------------------------------------------
const resend = new Resend(process.env.RESEND_API_KEY);

// ---------------------------------------------
// CONTACT ROUTE
// ---------------------------------------------
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.RECEIVER_EMAIL,
      subject: "New Portfolio Message",
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: "Email sending failed" });
    }

    return res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------------------------------------
app.get("/", (req, res) => {
  res.send("Backend is running! 🚀");
});

// ---------------------------------------------
// REQUIRED FOR RENDER
// ---------------------------------------------
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
