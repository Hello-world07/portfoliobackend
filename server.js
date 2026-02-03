import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Resend } from "resend";

dotenv.config();
const app = express();

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend-domain.com"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.options("*", cors());
app.use(express.json());

// Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// CONTACT ROUTE
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.RECEIVER_EMAIL,
      subject: "New Portfolio Message",
      html: `
        <h2>You received a new message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Resend Error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running with Resend Email API!");
});

// Render port
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
