const mongoose = require("mongoose");
const path = require("path");
const Listing = require('../Models/listing');
const initData = require("./data");


async function main(){
 await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}

main().then(() =>{
    console.log("connected to DB");
}).catch((err) =>{
    console.log(err);
})

async function updation() {
  await  Listing.deleteMany({});
  initData.data = initData.data.map((obj) =>({...obj, owner: '68f3b983229c5eb41b2562ce'}))
   await Listing.insertMany(initData.data);
   console.log("Previous Deleted New Inserted");
}

updation();
