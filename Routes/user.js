const express = require("express");
const router = express.Router();
const asyncWrap = require('../utils/asyncWrap.js');
const passport = require("passport");
const {saveRedirectUrl} =  require('../middleware.js');
const{signupForm,signupUser,loginForm,loginUser,logoutUser} = require("../controllers/user.js")

router.route("/signup")
 .get(signupForm)
 .post(asyncWrap(signupUser))


router.route("/login")
  .get(loginForm)
  .post(saveRedirectUrl,passport.authenticate('local',{
    failureRedirect: "/login",
     failureFlash: true
    }),
   asyncWrap(loginUser)
)

router.get("/logout",logoutUser)

module.exports = router;