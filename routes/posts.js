const router = require('express').Router();
const Post = require('../models/Posts');
const jwt = require('jsonwebtoken');

// MIDDLEWARE: Verify Token
// This ensures only logged-in users can create/edit/delete posts
const verify = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json("Access Denied");

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json("Invalid Token");
    }
};

// 1. CREATE POST (Protected)
router.post('/', verify, async (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        author: req.user._id // Taken from the JWT token
    });
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 2. GET ALL POSTS (Public)
router.get('/', async (req, res) => {
    try {
        // .populate('author', 'username') brings in the author's name instead of just the ID
        const posts = await Post.find().populate('author', 'username');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 3. UPDATE POST (Protected & Owner Only)
router.put('/:id', verify, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.author.toString() === req.user._id) {
            const updatedPost = await Post.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );
            res.status(200).json(updatedPost);
        } else {
            res.status(401).json("You can only update your own posts!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// 4. DELETE POST (Protected & Owner Only)
router.delete('/:id', verify, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.author.toString() === req.user._id) {
            await post.deleteOne();
            res.status(200).json("Post has been deleted.");
        } else {
            res.status(401).json("You can only delete your own posts!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;