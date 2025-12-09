const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/blog
// @desc    Get all published blogs
router.get('/', async (req, res) => {
    try {
        const { category, tag, limit } = req.query;
        const query = { isPublished: true, isVisible: true };
        if (category) query.category = category;
        if (tag) query.tags = tag;

        let blogsQuery = Blog.find(query).sort('-publishedAt');
        if (limit) blogsQuery = blogsQuery.limit(parseInt(limit));

        const blogs = await blogsQuery;
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/blog/all
// @desc    Get all blogs (admin)
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const blogs = await Blog.find().sort('-createdAt');
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/blog/:slug
// @desc    Get single blog
router.get('/:slug', async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Increment views
        blog.views += 1;
        await blog.save();

        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/blog
// @desc    Add blog
router.post('/', authMiddleware, upload.single('blogImage'), async (req, res) => {
    try {
        const blogData = { ...req.body };
        if (req.file) {
            blogData.coverImage = `/uploads/blog/${req.file.filename}`;
        }
        if (blogData.tags && typeof blogData.tags === 'string') {
            blogData.tags = blogData.tags.split(',').map(t => t.trim());
        }
        if (blogData.isPublished === 'true' || blogData.isPublished === true) {
            blogData.isPublished = true;
            blogData.publishedAt = new Date();
        }

        const blog = new Blog(blogData);
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/blog/:id
// @desc    Update blog
router.put('/:id', authMiddleware, upload.single('blogImage'), async (req, res) => {
    try {
        const blogData = { ...req.body };
        if (req.file) {
            blogData.coverImage = `/uploads/blog/${req.file.filename}`;
        }
        if (blogData.tags && typeof blogData.tags === 'string') {
            blogData.tags = blogData.tags.split(',').map(t => t.trim());
        }

        const existingBlog = await Blog.findById(req.params.id);
        if (!existingBlog.isPublished && (blogData.isPublished === 'true' || blogData.isPublished === true)) {
            blogData.publishedAt = new Date();
        }

        const blog = await Blog.findByIdAndUpdate(req.params.id, blogData, { new: true });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/blog/:id
// @desc    Delete blog
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/blog/:id/like
// @desc    Like a blog
router.post('/:id/like', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        blog.likes += 1;
        await blog.save();
        res.json({ likes: blog.likes });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
