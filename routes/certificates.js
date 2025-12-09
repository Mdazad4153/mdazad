const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const auth = require('../middleware/auth');

// Get all certificates (public)
router.get('/', async (req, res) => {
    try {
        const certificates = await Certificate.find().sort({ order: 1, date: -1 });
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all certificates (admin)
router.get('/all', auth, async (req, res) => {
    try {
        const certificates = await Certificate.find().sort({ order: 1 });
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create certificate
router.post('/', auth, async (req, res) => {
    try {
        const certificate = new Certificate(req.body);
        await certificate.save();
        res.status(201).json(certificate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update certificate
router.put('/:id', auth, async (req, res) => {
    try {
        const certificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
        res.json(certificate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete certificate
router.delete('/:id', auth, async (req, res) => {
    try {
        const certificate = await Certificate.findByIdAndDelete(req.params.id);
        if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
        res.json({ message: 'Certificate deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
