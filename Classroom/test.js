const express = require("express");
const app =express();
const session = require('express-session');
const path = require("path");
const flash = require('connect-flash');

app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));

// app.all("*", (req, res, next) => {
//     // Create the error and pass it to the next middleware in the chain
//     next(new ExpressError("Page not found", 404));
// });


//Express-Session
app.use(session({secret : "msupersecretstring", resave: false, saveUninitialized: true}));
//connect-flash
app.use(flash());

app.get('/hello',(req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get("/test", (req,res) =>{
    res.send("sent the session id");
})

app.get('/register',(req,res) =>{
    let {name="YoYo"} = req.query;
    req.session.name = name;
    console.log(req.session.name);
    if(name==="YoYo"){
        req.flash("error","User not Registered")
    }
    else{
      req.flash("success","User Registered Successfully!");
    }
    res.redirect("/hello");
})

app.get('/hello',(req,res) =>{
    // console.log(req.flash('success'))
    res.render('page.ejs',{name : req.session.name})
})

// app.get("/reqcount",(req,res) => {
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//        req.session.count = 1;
//     }
//     res.send(`I visited / route ${req.session.count} times`)
//})

app.listen(8080, () =>{
    console.log("server is listening to port 8080");
}) 