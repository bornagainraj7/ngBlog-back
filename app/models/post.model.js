const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: 'This is a post Content!' },
    imagePath: { type: String, require: true },
});

module.exports = mongoose.model('Post', postSchema);