const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/services
// @desc    Get all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find({ isVisible: true }).sort('order');
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/services/all
// @desc    Get all services (admin)
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const services = await Service.find().sort('order');
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/services
// @desc    Add service
router.post('/', authMiddleware, async (req, res) => {
    try {
        const serviceData = { ...req.body };
        if (serviceData.features && typeof serviceData.features === 'string') {
            serviceData.features = serviceData.features.split(',').map(f => f.trim());
        }

        const service = new Service(serviceData);
        await service.save();
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/services/:id
// @desc    Update service
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const serviceData = { ...req.body };
        if (serviceData.features && typeof serviceData.features === 'string') {
            serviceData.features = serviceData.features.split(',').map(f => f.trim());
        }

        const service = await Service.findByIdAndUpdate(req.params.id, serviceData, { new: true });
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/services/:id
// @desc    Delete service
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
