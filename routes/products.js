const express = require("express");
const router = express.Router();


const {Getproducts,Singleproduct,Addcart,Carddetails,Removeitem} = require("../controller/products");
const Authenticate= require("../middleware/Authenticate");


router.get("/getproducts", Getproducts);
router.post("/singleitem/:id",Singleproduct);
router.post("/addcart/:id",Authenticate,Addcart);
router.get("/cartdetails",Authenticate,Carddetails);
router.post("/remove/:id",Authenticate,Removeitem);

module.exports = router;
