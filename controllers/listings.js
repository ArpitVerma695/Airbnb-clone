const Listing = require("../models/listing");

module.exports.index = async (req, res) => {

    const { search, category } = req.query;

    let filter = {};

    if (search) {

        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } }
        ];
    }

    if (category) {
        filter.category = category;
    }

    const allListings = await Listing.find(filter);

    res.render("listings/index.ejs", {
        allListings,
        search,
        category
    });

};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListings = async(req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews", populate:{path:"author",},}).populate("owner");
  if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListings = async (req, res) => {

    if (!req.file) {
        req.flash("error", "Please upload an image.");
        return res.redirect("/listings/new");
    }

    const url = req.file.path;
    const filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
    if(typeof req.file != "undefined"){
       let url = req.file.path;
       let filename = req.file.filename;
       listing.image = {url, filename};
       await listing.save();
    }
    req.flash("success" , "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listings");
};