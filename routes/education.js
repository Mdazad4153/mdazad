const express = require('express');
const router = express.Router();
const Education = require('../models/Education');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/education
// @desc    Get all education
router.get('/', async (req, res) => {
    try {
        const education = await Education.find({ isVisible: true }).sort('-startYear');
        res.json(education);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/education/all
// @desc    Get all education (admin)
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const education = await Education.find().sort('-startYear');
        res.json(education);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/education
// @desc    Add education
router.post('/', authMiddleware, async (req, res) => {
    try {
        const education = new Education(req.body);
        await education.save();
        res.status(201).json(education);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/education/:id
// @desc    Update education
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const education = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!education) {
            return res.status(404).json({ message: 'Education not found' });
        }
        res.json(education);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/education/:id
// @desc    Delete education
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const education = await Education.findByIdAndDelete(req.params.id);
        if (!education) {
            return res.status(404).json({ message: 'Education not found' });
        }
        res.json({ message: 'Education deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
