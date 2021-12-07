
const express = require("express");
const router = require("express").Router();
const User = require("../models/User.model");
const saltRound = 5;
const bcrypt = require("bcrypt");


function isLoggedIn(req, res, next){
  if(req.session.loggedInUser) next()
  else res.redirect("/auth/login")
}

/* GET home page */
router.get("/", isLoggedIn, (req, res, next) => {
  res.render("index");
});

router
  .route("/auth/signup")
  .get((req, res, next) => {
    res.render("signup");
  })
  .post((req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
      res.render("signup", { errorMessage: "All fields are REQUIRED" });

    User.findOne({ username })
      .then((user) => {
        if (user) res.render("signup", { errorMessage: "User already exists" });

        const salt = bcrypt.genSaltSync(saltRound);
        const hashedPwd = bcrypt.hashSync(password, salt);

        User.create({ username, password: hashedPwd })
          .then((newUser) => res.render("index"))
          .catch((error) =>
            res.render("signup", { errorMessage: "WTF the DB broke" })
          );
      })
      .catch(console.log);
  })


  router
  .route("/auth/login")
  .get((req, res, next) => {
    res.render("login");
  })
  .post((req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
      res.render("login", { errorMessage: "All fields are required" });

    User.findOne({ username })
      .then((user) => {
        if (!user) res.render("login", { errorMessage: "User does not exist" });
        const isPwdCorrect = bcrypt.compareSync(password, user.password); // The  first password is the one form the form, the secodn one is the encrypted one form the DB
        if (isPwdCorrect) {
          req.session.loggedInUser = user;
          res.render("profile", user);
        } else res.render("login", { errorMessage: "Password incorrect" });
      })
      .catch(() => {});
  });


module.exports = router;
