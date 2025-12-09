const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/profile
// @desc    Get profile
router.get('/', async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) {
            profile = await Profile.create({});
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/profile
// @desc    Update profile
router.put('/', authMiddleware, async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) {
            profile = new Profile(req.body);
        } else {
            Object.assign(profile, req.body);
        }
        await profile.save();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/profile/image
// @desc    Upload profile image
router.post('/image', authMiddleware, (req, res, next) => {
    upload.single('profileImage')(req, res, (err) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(500).json({ message: `Upload error: ${err.message}`, error: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        console.log('Upload Request Headers:', req.headers['content-type']);
        console.log('Upload Request File:', req.file);
        console.log('Upload Request Body:', req.body);

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        let profile = await Profile.findOne();
        if (!profile) {
            profile = new Profile({});
        }

        profile.profileImage = `/uploads/profile/${req.file.filename}`;
        await profile.save();

        res.json({
            message: 'Image uploaded successfully',
            imageUrl: profile.profileImage
        });
    } catch (error) {
        console.error('Profile Image Upload Error:', error);
        res.status(500).json({ message: `Server error: ${error.message}`, error: error.message });
    }
});

// @route   POST /api/profile/resume
// @desc    Upload resume
router.post('/resume', authMiddleware, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        let profile = await Profile.findOne();
        if (!profile) {
            profile = new Profile({});
        }

        profile.resumeUrl = `/uploads/resume/${req.file.filename}`;
        await profile.save();

        res.json({
            message: 'Resume uploaded successfully',
            resumeUrl: profile.resumeUrl
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/profile/image
// @desc    Remove profile image
router.delete('/image', authMiddleware, async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Clear profile image
        profile.profileImage = null;
        await profile.save();

        res.json({ message: 'Profile image removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/profile/resume
// @desc    Remove resume
router.delete('/resume', authMiddleware, async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Clear resume
        profile.resumeUrl = null;
        await profile.save();

        res.json({ message: 'Resume removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
