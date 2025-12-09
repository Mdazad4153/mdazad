const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/auth');

// Email transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// @route   POST /api/contact
// @desc    Submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const contact = new Contact({ name, email, phone, subject, message });
        await contact.save();

        // Try to send email notification (optional)
        try {
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const transporter = createTransporter();
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_USER,
                    subject: `New Contact: ${subject}`,
                    html: `
            <h3>New Contact Message</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `
                });
            }
        } catch (emailError) {
            console.log('Email notification failed:', emailError.message);
        }

        res.status(201).json({ message: 'Message sent successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/contact
// @desc    Get all contacts (admin)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const contacts = await Contact.find().sort('-createdAt');
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/contact/unread
// @desc    Get unread contacts count
router.get('/unread', authMiddleware, async (req, res) => {
    try {
        const count = await Contact.countDocuments({ isRead: false });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/contact/:id/read
// @desc    Mark contact as read
router.put('/:id/read', authMiddleware, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/contact/:id/reply
// @desc    Reply to contact
router.post('/:id/reply', authMiddleware, async (req, res) => {
    try {
        const { replyMessage } = req.body;
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Send reply email
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = createTransporter();
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: contact.email,
                subject: `Re: ${contact.subject}`,
                html: `
          <p>Dear ${contact.name},</p>
          <p>${replyMessage}</p>
          <br>
          <p>Best regards,</p>
          <p>Md Azad</p>
        `
            });
        }

        contact.isReplied = true;
        contact.replyMessage = replyMessage;
        contact.repliedAt = new Date();
        await contact.save();

        res.json({ message: 'Reply sent successfully', contact });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
