const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapasync = require("./utils/WrapAsync.js");
const expressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("Connected to DB.");
})
.catch((err) => {
    console.log(err)
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("viewengine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.send("I am root.");
})

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    }
    else{
        next();
    }
}

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    }
    else{
        next();
    }
}


//INDEX ROUTE
app.get("/listings", wrapasync( async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//NEW ROUTE
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//CREATE ROUTE
app.post("/listings", validateListing, wrapasync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");    
}));

//EDIT ROUTE
app.get("/listings/:id/edit", wrapasync(async (req, res) => {
   let {id} = req.params;
   const listing = await Listing.findById(id);
   res.render("listings/edit.ejs", {listing});
}));

//UPDATE ROUTE
app.put("/listings/:id", validateListing, wrapasync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//DELETE ROUTE
app.delete("/listings/:id", wrapasync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})); 

//SHOW ROUTE
app.get("/listings/:id", wrapasync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));


//REVIEWS
//Post Review Route
app.post("/listings/:id/reviews", validateReview, wrapasync(async (req, res) => {
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();
        res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapasync( async (req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.render(`/listings`);
}));

// app.get("/testlisting", async (req, res) => {
//     let samplelisting = new Listing({
//         title: "My new villa",
//         description: "by the beatch0",
//         price: 1800,
//         location: "Goa",
//         country: "India"
//     });
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("successful testing");

// });

app.all("*", (req, res, next) => {
    next(new expressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
});

app.listen(8080, () => {
    console.log("app is listning to port 8080.");
});