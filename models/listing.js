const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const  listningSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: Object,
        default: "https://unsplash.com/photos/brown-wooden-table-and-chairs-on-brown-wooden-deck-near-body-of-water-during-daytime-TAgGZWz6Qg8",
        set: (v) => v === "" ? "https://unsplash.com/photos/brown-wooden-table-and-chairs-on-brown-wooden-deck-near-body-of-water-during-daytime-TAgGZWz6Qg8" : v
    },
    price: Number,
    location: String, 
    country: String
})

const Listing = mongoose.model("Listing", listningSchema);
module.exports = Listing;