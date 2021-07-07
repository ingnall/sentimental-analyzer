const express = require("express"),
  bodyParser = require("body-parser");
var cors = require('cors');
const mongoose = require("mongoose");
const passport = require("passport");
const user = require("./routes/api/user");
const posts = require("./routes/api/posts");
const app = express();

app.use(cors());
// Bodyparser middleware
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/user", user);
app.use("/api/posts", posts);

const port = 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
