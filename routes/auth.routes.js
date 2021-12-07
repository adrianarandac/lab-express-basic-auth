const express = require("express");
const User = require("../models/User.model");
const router = express.Router();
const saltRound = 5;
const bcrypt = require("bcrypt");

router
  .route("/signup")
  .get((req, res, next) => {
    console.log("DIOOOOS")
    res.render("index");
  })

module.exports = router;
