const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapasync = require("../utils/WrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingControllers = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router.route("/")
.get(wrapasync(listingControllers.index))
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapasync(listingControllers.createNewListing));

router.get("/new", isLoggedIn, listingControllers.renderNewForm);

router.get("/:id/edit", isLoggedIn, isOwner, wrapasync(listingControllers.editListing));

router.route("/:id")
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapasync(listingControllers.updateListing))
.delete(isLoggedIn, isOwner, wrapasync(listingControllers.destroyListing))
.get(wrapasync(listingControllers.showListing));


module.exports = router;