const express = require('express');
const router = express.Router();

const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register admin (first time only)
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne();
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = new Admin({ email, password, name });
        await admin.save();

        const token = admin.generateAuthToken();

        res.status(201).json({
            message: 'Admin created successfully',
            token,
            admin: { id: admin._id, email: admin.email, name: admin.name }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login admin
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if locked
        if (admin.lockUntil && admin.lockUntil > Date.now()) {
            const waitSeconds = Math.ceil((admin.lockUntil - Date.now()) / 1000);
            return res.status(403).json({ message: `Account locked. Try again in ${waitSeconds} seconds.` });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            // Increment logic
            admin.loginAttempts = (admin.loginAttempts || 0) + 1;

            // Check if max attempts reached (3)
            if (admin.loginAttempts >= 3) {
                admin.lockUntil = Date.now() + 30 * 1000; // Lock for 30 seconds
                admin.loginAttempts = 0; // Reset attempts after locking
                await admin.save();
                return res.status(403).json({ message: 'Account locked for 30 seconds due to too many failed attempts.' });
            }

            await admin.save();
            return res.status(400).json({ message: `Invalid credentials. Attempt ${admin.loginAttempts} of 3.` });
        }

        // Login successful - Reset lock info
        admin.loginAttempts = 0;
        admin.lockUntil = undefined;
        admin.lastLogin = new Date();
        await admin.save();

        const token = admin.generateAuthToken();

        res.json({
            message: 'Login successful',
            token,
            admin: { id: admin._id, email: admin.email, name: admin.name }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/auth/me
// @desc    Get current admin
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/auth/change-password
// @desc    Change admin password
router.put('/change-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const admin = await Admin.findById(req.admin.id);
        const isMatch = await admin.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        admin.password = newPassword;
        await admin.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using secret code
router.post('/reset-password', async (req, res) => {
    try {
        const { email, secretCode, newPassword } = req.body;
        const SECRET_CODE = '41534153';

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (secretCode !== SECRET_CODE) {
            return res.status(400).json({ message: 'Invalid secret code' });
        }

        admin.password = newPassword;
        admin.loginAttempts = 0;
        admin.lockUntil = undefined;
        await admin.save();

        res.json({ message: 'Password reset successfully. Please login.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
