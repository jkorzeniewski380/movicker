const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    favourites: {
        type: Array,
        default: []
    }
});

const User = new mongoose.model("User", usersSchema);

module.exports = User;