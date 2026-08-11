const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Nodemailer transporter — Gmail App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  try {
    // Email sent TO admin
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Apex Pep Co Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_NOTIFY_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `[Contact Form] ${subject} — from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 24px; border-radius: 8px;">
          <div style="background: #c4222f; color: white; padding: 16px 24px; border-radius: 6px 6px 0 0;">
            <h2 style="margin:0; font-size: 1.2rem;">New Contact Form Submission</h2>
            <p style="margin:4px 0 0; font-size: 0.85rem; opacity: 0.85;">Apex Pep Co — apexpepco.com</p>
          </div>
          <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 6px 6px;">
            <table style="width:100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 0.85rem; color: #6b7280; width: 100px; vertical-align: top;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; font-size: 0.95rem; color: #111827;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 0.85rem; color: #6b7280; vertical-align: top;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; font-size: 0.95rem; color: #111827;"><a href="mailto:${email}" style="color: #c4222f;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 0.85rem; color: #6b7280; vertical-align: top;"><strong>Subject:</strong></td>
                <td style="padding: 8px 0; font-size: 0.95rem; color: #111827;">${subject}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p style="font-size: 0.85rem; color: #6b7280; margin: 0 0 8px 0;"><strong>Message:</strong></p>
            <p style="font-size: 0.95rem; color: #111827; white-space: pre-wrap; margin: 0;">${message}</p>
          </div>
          <p style="font-size: 0.75rem; color: #9ca3af; text-align: center; margin-top: 16px;">
            Reply directly to this email to respond to ${name}.
          </p>
        </div>
      `,
    });

    // Auto-reply TO customer
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Apex Pep Co" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `We received your message — Apex Pep Co`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 24px; border-radius: 8px;">
          <div style="background: #c4222f; color: white; padding: 16px 24px; border-radius: 6px 6px 0 0;">
            <h2 style="margin:0; font-size: 1.2rem;">Thanks for reaching out, ${name}!</h2>
          </div>
          <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 6px 6px;">
            <p style="color: #374151;">We've received your message and will get back to you within <strong>1–4 business hours</strong>.</p>
            <div style="background: #f3f4f6; border-radius: 6px; padding: 16px; margin: 16px 0;">
              <p style="margin: 0; font-size: 0.85rem; color: #6b7280;"><strong>Your message:</strong></p>
              <p style="margin: 8px 0 0; font-size: 0.9rem; color: #374151; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #6b7280; font-size: 0.85rem;">If your matter is urgent, you can also reach us on Telegram or via SMS.</p>
            <a href="https://apexpepco.com/shop" style="display:inline-block; margin-top:8px; background:#c4222f; color:white; padding: 10px 20px; border-radius:6px; text-decoration:none; font-weight:bold; font-size:0.9rem;">Browse Products</a>
          </div>
          <p style="font-size: 0.75rem; color: #9ca3af; text-align: center; margin-top: 16px;">
            Apex Pep Co — Research Use Only<br/>
            <a href="https://apexpepco.com" style="color: #c4222f;">apexpepco.com</a>
          </p>
        </div>
      `,
    });

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Contact email error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;
