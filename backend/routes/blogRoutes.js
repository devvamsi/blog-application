const express = require("express");
const Blog = require("../models/Blog");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ===============================
// CREATE BLOG
// ===============================

router.post("/create", authMiddleware, async (req, res) => {
    try {

        const { title, content, category } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const blog = await Blog.create({
            title,
            content,
            category,
            author: req.user.id
        });

        res.status(201).json({
            message: "Blog created successfully",
            blog
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// ===============================
// GET ALL BLOGS
// ===============================

router.get("/", async (req, res) => {
    try {

        const blogs = await Blog.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        res.json({
            blogs: blogs
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// ===============================
// UPDATE BLOG
// ===============================

router.put("/:id", authMiddleware, async (req, res) => {
    try {

        const { title, content, category } = req.body;

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        // Only owner can edit
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only edit your own blogs"
            });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.category = category || blog.category;

        await blog.save();

        res.json({
            message: "Blog updated successfully",
            blog
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// ===============================
// DELETE BLOG
// ===============================

router.delete("/:id", authMiddleware, async (req, res) => {
    try {

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        // Only owner can delete
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete your own blogs"
            });
        }

        await Blog.findByIdAndDelete(req.params.id);

        res.json({
            message: "Blog deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// ===============================
// EXPORT ROUTER
// ===============================

module.exports = router;