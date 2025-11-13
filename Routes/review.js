const express = require("express");
const router = express.Router({mergeParams: true});
const asyncWrap = require('../utils/asyncWrap.js')
const ExpressError = require('../utils/ExpressError.js');
const {reviewSchema} = require('../joiSchema.js')
const Review = require('../Models/review.js')
const Listing = require('../Models/listing')
const {isLoggedin,isOwner,validateReview} = require('../middleware.js')
const {createReview,destroyReview} = require("../controllers/review.js")


//create a review
router.post('/',isLoggedin,validateReview,asyncWrap(createReview));

//delete a indivisual review
router.delete('/:id',isLoggedin,asyncWrap(destroyReview))

module.exports = router;