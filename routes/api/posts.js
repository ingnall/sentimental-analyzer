const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const Post = require("../../models/Post");

// @route POST api/posts/save
// @desc Save post
// @access public
router.post("/save", (req, res) => {
    if (req.body.loginWithFB) {
        Post.findOne({ id: req.body.id, userId: req.body.userId }).then((post) => {
            if (post) {
                return res.status(400).json({ message: "Post already exists" });
            } else {
                const newPost = new Post({
                    id: req.body.id,
                    userId: req.body.userId,
                    comments: req.body.comments,
                });
                newPost
                    .save()
                    .then((post) => res.json(post))
                    .catch((err) => console.log(err));
            }
        });
    } else {
        let token = req.headers["x-access-token"];

        if (!token) {
            return res.status(403).json({ message: "No token provided!" });
        }

        jwt.verify(token, keys.secretOrKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized!" });
            }
            Post.findOne({ id: req.body.id, userId: req.body.userId }).then((post) => {
                if (post) {
                    return res.status(400).json({ message: "Post already exists" });
                } else {
                    const newPost = new Post({
                        id: req.body.id,
                        userId: req.body.userId,
                        comments: req.body.comments,
                    });
                    newPost
                        .save()
                        .then((post) => res.json(post))
                        .catch((err) => console.log(err));
                }
            });
        });
    }
});

// @route GET api/posts/find
// @desc Find post
// @access public
router.get("/find", (req, res) => {
    if (req.query.loginWithFB === "true") {
        const id = (req.query.id).replace('loginWithFB=true', '\b');
        const userId = req.query.userId;
        Post.findOne({ id, userId }).then((post) => {
            if (post) {
                return res.status(200).json({ ...post._doc });
            } else {
                return res.status(404).json({ message: "Post not found" });
            }
        });
    } else {
        const id = (req.query.id).replace('loginWithFB=false', '\b');
        const userId = req.query.userId;
        let token = req.headers["x-access-token"];

        if (!token) {
            return res.status(403).json({ message: "No token provided!" });
        }

        jwt.verify(token, keys.secretOrKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized!" });
            } else {
                Post.findOne({ id, userId }).then((post) => {
                    if (post) {
                        return res.status(200).json({ ...post._doc });
                    } else {
                        return res.status(404).json({ message: "Post not found" });
                    }
                });
            }
        });
    }
});

// router.get('/find-from-extension', (req, res) => {
//     if (req.query.id) {
//         Post.findOne({ id: req.query.id }).then((post) => {
//             if (post) {
//                 return res.status(200).json({ ...post._doc });
//             } else {
//                 return res.status(404).json({ message: "Post not found" });
//             }
//         });
//     }
// });

// @route GET api/posts/findlatest
// @desc Find latest post
// @access public
router.get("/findlatest", (req, res) => {
    if (req.query.loginWithFB === "true") {
        Post.findOne({ userId: req.query.userId })
            .sort({ _id: -1 })
            .limit(1)
            .then((post) => {
                if (post) {
                    return res.status(200).json({ ...post._doc });
                } else {
                    return res.status(404).json({ message: "No post is stored yet" });
                }
            });
    } else {
        let token = req.headers["x-access-token"];

        if (!token) {
            return res.status(403).json({ message: "No token provided!" });
        }

        jwt.verify(token, keys.secretOrKey, (err) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized!" });
            } else {
                Post.findOne({ userId: req.query.userId })
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
    }
});

// @route GET api/posts/all
// @desc Get all posts
// @access public
router.get("/", (req, res) => {
    if (req.query.loginWithFB === "true") {
        Post.find({ userId: req.query.userId }, (err, posts) => {
            var postMap = {};

            posts.forEach((post) => {
                postMap[post._id] = {
                    id: post.id,
                    comments: post.comments
                }
            });
            res.send(postMap);
        });
    } else {
        let token = req.headers["x-access-token"];

        if (!token) {
            return res.status(403).json({ message: "No token provided!" });
        }

        jwt.verify(token, keys.secretOrKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized!" });
            } else {
                Post.find({ userId: req.query.userId }, (err, posts) => {
                    var postMap = {};

                    posts.forEach((post) => {
                        postMap[post._id] = {
                            id: post.id,
                            comments: post.comments
                        }
                    });
                    res.send(postMap);
                });
            }
        });
    }
});

module.exports = router;
