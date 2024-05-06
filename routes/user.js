const express = require("express");
const router = express.Router();


const {Login,Signup,Logout} = require("../controller/user");


router.post("/login", Login);
router.post("/register", Signup);
router.post("/logout",Logout);

module.exports = router;
