const mongoose = require("mongoose");
let Review = require("./review.js");
// const User = require('./user.js');


const listingSchema = new mongoose.Schema({
    title :{
        type : String,
        
    },
    description : String,
    image : {filename : String,
            url : {
                  type : String,
                  default :"https://i.pinimg.com/originals/70/54/a9/7054a9ebf8ab1e8c78b7dfb6ea7781bb.jpg", 
                  set : (v) => v === ""? "https://i.pinimg.com/originals/70/54/a9/7054a9ebf8ab1e8c78b7dfb6ea7781bb.jpg": v, 
    
            }
    },
    price : {
        type : Number,
        // required: true,
    },
    location : {
        type : String,
    },
    country : {
        type : String,
        maxlength : 20
    },
    review: [
      {  
        type : mongoose.Schema.Types.ObjectId,
        ref: "Review"
      }
    ],
    owner : {
      type : mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
})

//mongoose middleware
listingSchema.post('findOneAndDelete',async(listing) =>{

    let reviews = await Review.deleteMany({_id : {$in : listing.review}})

  console.log("in Post mongoose middleware"); 
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;