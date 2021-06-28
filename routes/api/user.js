const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateSettingInput = require("../../validation/setting");
// Load User model
const User = require("../../models/User");

// @route POST api/user/setting
// @desc Update password
// @access Public
router.post('/setting', (req, res) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.body.loginWithFB) {
        console.log(req.body);
        // Form validation
        const { errors, isValid } = validateSettingInput(req.body);
        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) throw err;
                User.findByIdAndUpdate(req.body.userId, { 'password': hash }, (err, result) => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(result);
                    }
                })
            });
        });
    } else {
        let token = req.headers['x-access-token'];

        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }

        jwt.verify(token, keys.secretOrKey, (err) => {
            if (err) {
                return res.status(401).send({ message: "Unauthorized!" });
            } else {
                console.log(req.body);
                // Form validation
                const { errors, isValid } = validateSettingInput(req.body);
                // Check validation
                if (!isValid) {
                    return res.status(400).json(errors);
                }

                // Hash password before saving in database
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (err) throw err;
                        User.findByIdAndUpdate(req.body.userId, { 'password': hash }, (err, result) => {
                            if (err) {
                                res.send(err);
                            } else {
                                res.send(result);
                            }
                        })
                    });
                });
            }
        });
    }
});

// @route Get api/user/find
// @desc Find single user
// @access Public
router.get('/find', (req, res) => {
    if (typeof req.query.userId != "string") {
        res.status(400).json({ message: "Missing data." });
    } else if (req.query.loginWithFB === "true") {
        User.findById(req.query.userId, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
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
                User.findById(req.query.userId, (err, result) => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(result);
                    }
                });
            }
        });
    }
});

// @route Get api/user/update
// @desc Update single user
// @access Public
router.post('/update', (req, res) => {
    if (req.body.loginWithFB) {
        User.findByIdAndUpdate(req.body.userId, {
            'firstName': req.body.firstName,
            'lastName': req.body.lastName
        }, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
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
                User.findByIdAndUpdate(req.body.userId, {
                    'firstName': req.body.firstName,
                    'lastName': req.body.lastName,
                    'email': req.body.email
                }, (err, result) => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(result);
                    }
                });
            }
        });
    }
});

module.exports = router;