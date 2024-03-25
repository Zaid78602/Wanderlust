const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const  listningSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg",
        set: (v) => v === "" ? "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg" : v
    },
    price: Number,
    location: String, 
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

const Listing = mongoose.model("Listing", listningSchema);
module.exports = Listing;