const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://vishuportfoilio.onrender.com"
  ],
  methods: ["POST"],
  credentials: true
}));

app.use(express.json());

/* ✅ GMAIL SMTP CONFIG */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ✅ VERIFY SMTP */
transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP Error:", err);
  } else {
    console.log("✅ SMTP Ready to Send Emails");
  }
});

/* ✅ CONTACT API */
app.post("/api/contact", async (req, res) => {
  const { user_name, user_email, subject, message } = req.body;

  if (!user_name || !user_email || !message) {
    return res.status(400).json({ success: false, msg: "Missing fields" });
  }

  try {
   await transporter.sendMail({
  from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`, // ✅ AAPKA MAIL
  to: process.env.EMAIL_USER, // ✅ AAPKA INBOX
  replyTo: user_email, // ✅ USER KA EMAIL (Reply ke liye)
  subject: subject || "New Contact Message",
  html: `
    <h2>New Contact Message</h2>
    <p><b>Name:</b> ${user_name}</p>
    <p><b>Email:</b> ${user_email}</p>
    <p><b>Message:</b></p>
    <p>${message}</p>
  `,
});

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Mail Send Error:", error);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
