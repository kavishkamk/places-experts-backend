const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: [true, "name required"] },
    email: { type: String, required: [true, "email required"], unique: true },
    password: { type: String, required: [true, "password required"], minLength: [6, "passwrod length should > 6"] },
    image: { type: String, required: [true, "image required"] },
    places: [{ type: mongoose.Types.ObjectId, required: [true, "places required"], ref: "Place" }]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);