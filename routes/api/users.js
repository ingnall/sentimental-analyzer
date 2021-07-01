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

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  console.log(req.body);
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        loginWithFB: false,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    } else if (user.loginWithFB) {
      res.json({ message: "Login with facebook." });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Sign token
        var token = jwt.sign(
          {
            id: user.id,
            name: user.name,
          },
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          }
        );

        res.status(200).json({
          success: true,
          userId: user._id,
          accessToken: token,
        });
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// @route POST api/users/facebook-login
// @desc Login with facebook
// @access Public
router.post("/facebook-login", (req, res) => {
  const email = req.body.email;
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: "facebook account",
        loginWithFB: true,
      });
      newUser.save().then((user) => res.json(user))
        .catch((err) => console.log(err));
    } else {
      res.status(200).json({
        success: true,
        userId: user._id,
      })
    }
  });
})

router.get("/", (req, res) => {
  if (req.query.loginWithFB === "true") {
    User.find({}, function (err, users) {
      var userMap = {};
      users.forEach(function (user) {
        userMap[user._id] = user;
      });
      res.send(userMap);
    });
  } else {
    let token = req.headers['x-access-token'];

    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, keys.secretOrKey, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      } else {
        req.userId = decoded.id;

        User.find({}, function (err, users) {
          var userMap = {};

          users.forEach(function (user) {
            userMap[user._id] = user;
          });
          res.send(userMap);
        });
      }
    });
  }
});

module.exports = router;
