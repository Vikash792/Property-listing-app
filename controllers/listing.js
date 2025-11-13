const Listing = require('../Models/listing')

module.exports.index = async (req,res) =>{
   let alllisting = await Listing.find({});
    res.render("./listings/index.ejs",{alllisting});
}

module.exports.indivisualShow = async(req,res) =>{
 
    let{id} =req.params;
   let listing = await Listing.findById(id)
   .populate("review")
   .populate("owner")
   .populate({
        path: "review",     // 1. First, populate the 'reviews' array
        populate: {
            path: "author"   // 2. Then, for each review, populate its 'author' field
        }
    });
  console.log("in show route");

    if(!listing){
       req.flash("error",`Listing not found`) ;
        res.redirect("/alllisting"); //it does not stop execution that's why else is must
    }
    else{ 
    console.log(req.user)
   console.log(listing);
   res.render('./listings/show.ejs',{listing});
    }
    
}

module.exports.newListing = async(req,res,next) =>{
       let {path,filename} = req.file;
       let url = path;
       console.log(url,"....",filename)
       
        let listing =await new Listing( req.body.listing);   //things to remember listing[title] in ejs take title as a key value pair
        listing.image.url = url;
        listing.image.filename = filename;
        console.log("before save");
        listing.owner = req.user._id;
        await listing.save().then((res) =>{
        console.log(res);
    })
    console.log("after save")
    req.flash("success","New Listing added")
   res.redirect("/alllisting");

}

module.exports.updateForm = async(req,res) =>{
    let {id} =req.params;
   let listing = await Listing.findById(id);
   
   if(!listing){
       req.flash("error",`Listing not found`) ;
        return res.redirect("/alllisting");
    }
    else{
    console.log(listing.image);
    let originalImageUrl = listing.image.url;
    originalImageUrl =originalImageUrl.replace("/upload","/upload/c_fill,h_200,w_250/e_blur:300");
    res.render('./listings/edit.ejs',{listing,originalImageUrl});
    }
}

module.exports.updateListing = async(req,res) =>{
    let {id} =req.params;
    
    let newlisting = req.body.newlisting;
//    if(req.file){
//         newlisting.image = {
//              url : path,
//              filename:filename
//        }
//    }
  let listing =  await Listing.findByIdAndUpdate(id, {...newlisting});
  console.log(listing);
  if(typeof req.file!=="undefined"){
    let {path,filename} = req.file;
     listing.image.url = path;
     listing.image.filename = filename;
   await listing.save();
  }
    
  res.redirect(`/alllisting/${id}`);
}

module.exports.deleteListing = async(req,res) =>{
     let {id} =req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/alllisting");
}