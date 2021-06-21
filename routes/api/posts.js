const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");
const Post = require("../../models/Post");

// @route POST api/posts/save
// @desc Save post
// @access public
router.post("/save", (req, res) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).json({ message: "No token provided!" });
    }

    jwt.verify(token, keys.secretOrKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized!" });
        }
        Post.findOne({ id: req.body.id }).then((post) => {
            if (post) {
                return res.status(400).json({ message: "Post already exists" });
            } else {
                const newPost = new Post({
                    id: req.body.id,
                    comments: req.body.comments,
                });
                newPost
                    .save()
                    .then((post) => res.json(post))
                    .catch((err) => console.log(err));
            }
        });
    });
});

// @route GET api/posts/find
// @desc Find post
// @access public
router.get("/find", (req, res) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).json({ message: "No token provided!" });
    }

    jwt.verify(token, keys.secretOrKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized!" });
        } else {
            Post.findOne({ id: req.query.id }).then((post) => {
                if (post) {
                    return res.status(200).json({ ...post._doc });
                } else {
                    return res.status(404).json({ message: "Post not found" });
                }
            });
        }
    });
});

// @route GET api/posts/findlatest
// @desc Find latest post
// @access public
router.get("/findlatest", (req, res) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).json({ message: "No token provided!" });
    }

    jwt.verify(token, keys.secretOrKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized!" });
        } else {
            Post.findOne()
                .sort({ _id: -1 })
                .limit(1)
                .then((post) => {
                    if (post) {
                        return res.status(200).json({ ...post._doc });
                    } else {
                        return res.status(404).json({ message: "No post is stored yet" });
                    }
                });
        }
    });
});

// @route GET api/posts/all
// @desc Get all posts
// @access public
router.get("/", (req, res) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).json({ message: "No token provided!" });
    }

    jwt.verify(token, keys.secretOrKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized!" });
        } else {
            Post.find({}, (err, posts) => {
                var postMap = {};

                posts.forEach((post) => {
                    postMap[post._id] = {
                        id: post.id,
                        comments: post.comments
                    }
                })
                res.send(postMap)
            })
            // .then((post) => {
            //     if (post) {
            //         return res.status(200).json({ ...post._doc });
            //     } else {
            //         return res.status(404).json({ message: "Post not found" });
            //     }
            // });
        }
    });
});

module.exports = router;
