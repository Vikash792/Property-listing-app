if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

console.log(process.env)

const express = require("express");
const router = express.Router({mergeParams: true});
const asyncWrap = require('../utils/asyncWrap.js')
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema} = require('../joiSchema.js')
const Listing = require('../Models/listing')
const {isLoggedin,isOwner,validateListing} = require('../middleware.js')
const {index,indivisualShow,newListing,updateForm,updateListing,deleteListing} = require("../controllers/listing.js")
const multer = require('multer');
const{storage} = require('../cloudConfig.js')
const upload = multer({storage});


router.route("/")
//alllisting show
.get(asyncWrap(index))
//create listing
.post(
  isLoggedin,
  validateListing,
  upload.single("listing[image][url]"),
  asyncWrap(newListing))


//new
router.get("/new", isLoggedin ,asyncWrap(async(req,res) =>{
    res.render("./listings/new.ejs");
}))

router.route("/:id")
 // indivisual show
 .get(asyncWrap(indivisualShow))
 //update listing
 .put(isLoggedin,isOwner, upload.single("newlisting[image][url]"),asyncWrap(updateListing))
 //delete listing
 .delete(isLoggedin,isOwner,asyncWrap(deleteListing))



//update form
router.get("/:id/edit",isLoggedin,isOwner,asyncWrap(updateForm))





module.exports = router;

