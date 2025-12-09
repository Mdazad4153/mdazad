const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/projects
// @desc    Get all projects
router.get('/', async (req, res) => {
    try {
        const { featured } = req.query;
        const query = { isVisible: true };
        if (featured === 'true') query.featured = true;

        const projects = await Project.find(query).sort('-createdAt');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/projects/all
// @desc    Get all projects (admin)
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find().sort('-createdAt');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/projects/:id
// @desc    Get single project
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/projects
// @desc    Add project
router.post('/', authMiddleware, upload.single('projectImage'), async (req, res) => {
    try {
        const projectData = { ...req.body };
        if (req.file) {
            projectData.image = `/uploads/projects/${req.file.filename}`;
        }
        if (projectData.technologies && typeof projectData.technologies === 'string') {
            projectData.technologies = projectData.technologies.split(',').map(t => t.trim());
        }

        const project = new Project(projectData);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/projects/:id
// @desc    Update project
router.put('/:id', authMiddleware, upload.single('projectImage'), async (req, res) => {
    try {
        const projectData = { ...req.body };
        if (req.file) {
            projectData.image = `/uploads/projects/${req.file.filename}`;
        }
        if (projectData.technologies && typeof projectData.technologies === 'string') {
            projectData.technologies = projectData.technologies.split(',').map(t => t.trim());
        }

        const project = await Project.findByIdAndUpdate(req.params.id, projectData, { new: true });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
