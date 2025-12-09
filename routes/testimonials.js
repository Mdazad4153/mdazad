const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/testimonials
// @desc    Get all testimonials
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isVisible: true }).sort('order');
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/testimonials/all
// @desc    Get all testimonials (admin)
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort('order');
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/testimonials
// @desc    Add testimonial
router.post('/', authMiddleware, upload.single('testimonialImage'), async (req, res) => {
    try {
        const testimonialData = { ...req.body };
        if (req.file) {
            testimonialData.image = `/uploads/general/${req.file.filename}`;
        }

        const testimonial = new Testimonial(testimonialData);
        await testimonial.save();
        res.status(201).json(testimonial);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/testimonials/:id
// @desc    Update testimonial
router.put('/:id', authMiddleware, upload.single('testimonialImage'), async (req, res) => {
    try {
        const testimonialData = { ...req.body };
        if (req.file) {
            testimonialData.image = `/uploads/general/${req.file.filename}`;
        }

        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, testimonialData, { new: true });
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.json(testimonial);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete testimonial
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
