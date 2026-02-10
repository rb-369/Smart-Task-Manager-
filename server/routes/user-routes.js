
const express = require("express");
const { registerUser, loginUser, logoutUser, googleOAuthVerify } = require("../controllers/user-controller");

const {userAuthVerification} = require("../middlewares/auth-middleware");


const router = express.Router();

router.post("/register", registerUser)

router.post("/login", loginUser);
router.post("/logout", logoutUser);

// OAuth Google endpoint
router.post("/google-oauth", googleOAuthVerify);

router.post("/auth", userAuthVerification);




module.exports= router;

