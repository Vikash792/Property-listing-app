const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
let methodOverride = require('method-override');
const ejsmate = require("ejs-mate");
const ExpressError = require('./utils/ExpressError.js');
const coolkieParser = require("cookie-parser");
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require('./Models/user.js');
// const {listingSchema,reviewSchema} = require('./joiSchema.js')
// const Review = require('./Models/review.js')
// const asyncWrap = require('./utils/asyncWrap.js')
// const Listing = require('./Models/listing')


const alllistingRouter = require("./Routes/listing.js")
const reviewRouter = require("./Routes/review.js")
const userRouter = require("./Routes/user.js")

async function main(){
 await mongoose.connect('mongodb://127.0.0.1:27017/testPassport');
}

main().then(() =>{
    console.log("connected to DB");
}).catch((err) =>{
    console.log(err);
})

app.use(methodOverride('_method'));

// app.use(express.static(path.join(__dirname, 'Models')));
app.use(express.static(path.join(__dirname, 'Public')));

app.engine('ejs',ejsmate);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));

//session
const sessionOptions = {
   secret : "Mysecretkkey",
   resave: false,
   saveUninitialized : true,
   cookie:{
       expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
       maxAge: 7 * 24 * 60 * 60 * 1000 ,
       httpOnly : true
   },
}
  
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.serializeUser(User.deserializeUser());


app.use((req,res,next) =>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.fakeuser; // <-- ADD THIS LINE
    console.log(res.locals.success);
    next();
})

app.get('/demouser',async(req,res) =>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username : "delta-student"
    });

    let registeredUser = await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
})

//for alllisting paths
app.use("/alllisting",alllistingRouter);

//for review paths
app.use("/alllisting/:listingId/review",reviewRouter)

//for a user
app.use('/',userRouter)

//parse cookies to redable form
app.use(coolkieParser('signing'));

//signed cookies
app.get('/getsignedcookies',(req,res) =>{
    res.cookie("Vande","Matram" ,{signed: true});
    res.send("send the signed cookies")
})

app.get('/showsignedcookies',(req,res) =>{
    let{Vande} = req.signedCookies;
    console.log(req.signedCookies)
    res.send(`${Vande}`);
})

//cookies
app.get('/getcookies',(req,res) =>{
    res.cookie("Name","lasan");
    res.send("Sent you some cookies")
})

app.get("/showcookies",(req,res) =>{
 let{Name,Bharat} = req.cookies;
 console.log(req.cookies)
  res.send(`Hi i am Groot ${Name} ${Bharat}`);
})

// app.get("/testListening", async(req,res) =>{
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : " By the beach",
//         price : 1200,
//         location : "Calangute, Goa",
//         country : "India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfull testing");

     
// })



// page not found
app.use("/",(req,res) =>{
    throw new ExpressError(404, "Page not found");
})

// app.use("/", asyncWrap((req, res, next) => {
//     // Create the error and pass it to the next middleware in the chain
//     next(new ExpressError(404, "Page not found"));
// }));

// app.use((err,req,res,next) =>{
//    let{status =500, message = "Some error ocuured"} = err;
//    console.log(message);
//    res.status(status).render("error.ejs",{message});

// })

app.listen(8080, () =>{
    console.log("server is listening to port 8080");
})