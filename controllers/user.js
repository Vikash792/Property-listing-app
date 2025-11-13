const User = require('../Models/user.js');

module.exports.signupForm = async(req,res) =>{
    res.render('./User/signUp.ejs')
}

module.exports.signupUser = async(req,res) =>{
  try  {
    let{username,password,email} = req.body;
    const newUser = new User({
        username: username,
        email: email,
    })
     const registeredUser = await User.register(newUser,password);
      console.log(registeredUser);
      req.login(registeredUser, (err)=> {
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to WanderLust")
        res.redirect("/alllisting");
      })
     }
      catch(err)  {
        req.flash("error",err.message);
        res.redirect("/signup")
     }
    }

module.exports.loginForm = async(req,res) =>{
    res.render("./User/login.ejs");
}

module.exports.loginUser = async(req,res) =>{
        req.flash("success","Welcome Back to WanderLust");
        let redirectUrl = res.locals.redirectUrl || "/alllisting" ;
        res.redirect(`${redirectUrl}`);
    }

module.exports.logoutUser = (req,res,next) =>{
    req.logout( (err) => {
        if(err){
            return next(err);
        }
        req.flash("success","logged you out!");
        res.redirect("/alllisting");
    })
}