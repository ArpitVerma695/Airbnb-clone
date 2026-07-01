const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validatelisting} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


//Index Route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new",isLoggedIn, listingController.renderNewForm);

//Show Route
router.get("/:id", wrapAsync(listingController.showListings));

//Create Route
router.post("/", isLoggedIn, upload.single("listing[image]"), validatelisting, wrapAsync (listingController.createListings));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm );

//update route

router.put("/:id",isLoggedIn,  isOwner, upload.single("listing[image]"), validatelisting, listingController.updateListing);

//delete route

router.delete("/:id", isLoggedIn, isOwner, listingController.deleteListing);

module.exports = router;