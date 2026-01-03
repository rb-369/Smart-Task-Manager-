
const express = require("express");
const { registerUser, loginUser,logoutUser } = require("../controllers/user-controller");

const {userAuthVerification} = require("../middlewares/auth-middleware");


const router = express.Router();

router.post("/register", registerUser)

router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.post("/auth", userAuthVerification);




module.exports= router;

