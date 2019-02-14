const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const mapbox = require("../public/javascripts/geocode");

// Bcrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const position = req.body.position;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    mapbox(
      'pk.eyJ1IjoiZnJkMjZ4IiwiYSI6ImNqcnQ4ZGFzMjF4dDA0M3BzOWg4NGNlem4ifQ.SgF_HKYViz0-nlirZ9Ksag',
      `${position}`,
      function(err, data) {

        const newUser = new User({
          username,
          password: hashPass,
          position,
          loc: {
            type: "Point",
            coordinates: data.features[0].center
          }
 });
 newUser.save()
 .then((user) => {
  req.logIn(user, () => {
    res.redirect("/"); 
    })
   
 })
 .catch(err => {
   res.render("auth/signup", { message: "Something went wrong" });
 })
        
    

  
  });
});
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
