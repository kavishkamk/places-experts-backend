const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title : { type: String , required: [true, "title required"] },
    description: { type: String, minLength: [5, "min lenght shoud be 5"] },
    imageUrl: { type: String, required: [true, "uri required"] },
    address: { type: String, required: [true, "address required"] },
    location: {
        lat: { type: Number, required: [true, "lat required"] },
        lng: { type: Number, required: [true, "lng required"] }
    },
    creator: { type: mongoose.Types.ObjectId, required: [true, "creator required"], ref: "User" }
});

module.exports = mongoose.model("Place", placeSchema);