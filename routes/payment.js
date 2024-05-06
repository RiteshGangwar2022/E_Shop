const express = require("express");
const router = express.Router();

const { Checkout, verifypay, Getkey } = require("../controller/payment");
const Authenticate = require("../middleware/Authenticate");

router.post("/checkout", Authenticate, Checkout);
router.post("/paymentverification", Authenticate, verifypay);
router.get("/getkey", Authenticate, Getkey);

module.exports = router;
