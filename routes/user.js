const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/WrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.signupForm)
.post(wrapasync(userController.signupUser));

router.route("/login")
.get(userController.loginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.loginUser);

router.get("/logout", userController.logoutUser);

module.exports = router;