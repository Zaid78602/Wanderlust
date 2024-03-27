const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapasync = require("../utils/WrapAsync.js");
const expressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");


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

//INDEX ROUTE
router.get("/", wrapasync( async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//NEW ROUTE
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//CREATE ROUTE
router.post("/", validateListing, wrapasync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");    
}));

//EDIT ROUTE
router.get("/:id/edit", wrapasync(async (req, res) => {
   let {id} = req.params;
   const listing = await Listing.findById(id);
   if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
   res.render("listings/edit.ejs", {listing});
}));

//UPDATE ROUTE
router.put("/:id", validateListing, wrapasync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//DELETE ROUTE
router.delete("/:id", wrapasync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
})); 

//SHOW ROUTE
router.get("/:id", wrapasync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

module.exports = router;