const Listing = require('./Models/listing')
const {listingSchema,reviewSchema} = require('./joiSchema.js')
const ExpressError = require('./utils/ExpressError.js');

module.exports.isLoggedin = (req,res,next) =>{ 
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in");
       return res.redirect("/login");  
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
   if(req.session.redirectUrl)  {
    res.locals.redirectUrl = req.session.redirectUrl;
   }
   next(); 
}

module.exports.isOwner = async(req,res,next) =>{
     let {id} =req.params;
   let listing = await Listing.findById(id);
    if(req.user && !req.user._id.equals(listing.owner)){
       req.flash("error","You are not a owner of the listing")
      return res.redirect(`/alllisting/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) =>{
 let {error} = listingSchema.validate(req.body);
    if(error){
        let errMessage = error.details.map((el) => el.message).join(",");
        console.log(error)
        throw new ExpressError(400, errMessage);    
    }
    else{
        next();
    }
}

module.exports.validateReview = async(req,res,next) =>{
    
   let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMessage = error.details.map((el) => el.message).join(",");
        console.log(error)
        throw new ExpressError(401, errMessage);    
    }
    else{
        next();
    }
}