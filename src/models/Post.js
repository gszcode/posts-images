const { Schema, model } = require('mongoose');

const PostSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    timestam: {
        type: Date,
        default: Date
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = model('Post', PostSchema);