
const Review = require('../Models/review.js')
const Listing = require('../Models/listing')

module.exports.createReview = async function(req,res){
    console.log("In create Reveiew Route")
    let{comment,rating} = req.body.review;
    
    let{listingId} = req.params;  
    let listing = await Listing.findById(listingId);
   
    let review1 = new Review({
        comment: comment,
        rating : rating
    })
    console.log(review1);

    review1.author = req.user._id;
    
    await review1.save();
    listing.review.unshift(review1);
   let result = await listing.save();
     console.log(result);
  req.flash("success","New Review added")
  res.redirect(`/alllisting/${listingId}`)
}

module.exports.destroyReview = async(req,res) =>{
    let {id,listingId} = req.params;
    let review = await Review.findById(id);
    console.log(review.author._id)
    if(!review.author.equals(req.user._id)){
      req.flash("error","You can't delete this review")
     return res.redirect(`/alllisting/${listingId}`)
    }
    let listing = await Listing.findByIdAndUpdate(listingId,{$pull : {review : id }})
      let review1 = await Review.findByIdAndDelete(id);
    console.log(review1);
    req.flash("success","Review Deleted")
    res.redirect(`/alllisting/${listingId}`)
}