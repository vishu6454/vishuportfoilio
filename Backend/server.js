const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ✅ CORS (Frontend Render URL) */
app.use(
  cors({
    origin: [
      "https://vishuportfoilio.onrender.com", // frontend
    ],
    methods: ["POST"],
  })
);

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
    console.log("✅ SMTP Ready");
  }
});

/* ✅ CONTACT API */
app.post("/api/contact", async (req, res) => {
  const { user_name, user_email, subject, message } = req.body;

  if (!user_name || !user_email || !message) {
    return res
      .status(400)
      .json({ success: false, msg: "All fields required" });
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: user_email,
      subject: subject || "New Portfolio Message",
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${user_name}</p>
        <p><b>Email:</b> ${user_email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    });

    res.json({ success: true, msg: "Message Sent Successfully" });
  } catch (error) {
    console.error("❌ Mail Error:", error);
    res.status(500).json({ success: false, msg: "Mail Failed" });
  }
});

/* ✅ PORT FOR RENDER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
