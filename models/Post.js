const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const PostSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    comments: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
module.exports = Post = mongoose.model("posts", PostSchema);