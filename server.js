const express = require("express"),
  bodyParser = require("body-parser");
var cors = require('cors');
const mongoose = require("mongoose");
const passport = require("passport");
const user = require("./routes/api/user");
const users = require("./routes/api/users");
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
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/user", user);
app.use("/api/users", users);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
