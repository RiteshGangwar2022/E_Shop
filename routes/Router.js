const express = require('express')
const router = new express.Router();
const products = require("../Db/models/productschema")
const User = require("../Db/models/userSchema")
const bcrypt = require("bcryptjs")
const Authenticate = require("../middleware/Authenticate")

//creating api to get products from the database
router.get("/getproducts", async (req, res) => {

    try {

        //getting data from database
        const data = await products.find();
        //sending data to server with status code(200==success)
        res.status(200).json(data);

    }
    catch (err) {
        console.log("not able to fetched data")
    }
})



//api to get individual items of products so that when we click on an image on carousel it get directed to buynow page
router.get("/singleitem/:id", async (req, res) => {

    try {
        //getting id of the particular product from database on clicking to the image of that item
        const id = req.params.id;
        const singleitem = await products.findOne({ id: id });
        res.status(201).json(singleitem);
    }
    catch (err) {
        res.status(400).json(singleitem);
        console.log("not able to fetch single item");
    }
})



//creating API for Signup and login( User Authentication)

//register api (method post->because we want to send data to database)

router.post("/register", async (req, res) => {

    //this is the data which we are getting from frontend
    const { fname, email, mobile, password, cpassword } = req.body;//req.body contains the whole data

    //checking if any of the input is not filled
    if (!fname || !email || !mobile || !password || !cpassword) {
        res.status(422).json({ error: "fill all the data properly" });
    }

    //if all the data filled, now create a new user

    try {

        //checking if user already exists in database or not , else create a new user
        const user = await User.findOne({ email: email });
        if (user) {
            res.status(422).json({ error: "User already exists" });
        }
        else if (password !== cpassword) {
            res.status(422).json({ error: "password and confirm password do not match" });
        }
        else {

            const newuser = new User({ fname, email, mobile, password, cpassword });
            const data = await newuser.save();
            // console.log(data);
            //sending data which is fetched from database to frontend to show different pop_ups(toast)
            res.status(201).json(data);
        }
    }
    catch (err) {
        res.status(422).send(err);
    }

})




//api to login

router.post("/login", async (req, res) => {

    //getting data from frontend
    const { email, password } = req.body;
    //console.log(req.body);  , to check if we are getting data from frontend or not


    //cheking if user have both email and password or not
    if (!email || !password) {
        res.status(400).json({ error: "fill the data properly" });
    }

    try {
        const userlogin = await User.findOne({ email: email });//first email is from database and second is filled by user

        //checking if the user with entered email id exists in database or not

        if (userlogin) {
            //if user exists in database

            //now, comparing password entered by user with the password present in database
            const ismatch = await bcrypt.compare(password, userlogin.password);


            if (!ismatch) {
                res.status(400).json({ error: "invalid details" })
            }
            else {

                //if user exists then, generate a token to the given user
                const token = await userlogin.generatAuthtoken();
                //console.log(token);


                //creating cookie-parser (cookie-name->Amazon web, and we using token to create cookie)
                res.cookie("Amazonweb", token, {
                    expires: new Date(Date.now() + 900000), //token expires after 30hrs
                    httpOnly: true

                })

                //sending data which is fetched from database to frontend to show different pop_ups(toast)
                res.status(201).json(userlogin);
            }

        }
        else {
            res.status(400).json({ error: "user not exists" })
        }
    }
    catch (err) {
        res.status(400).json({ error: "Invalid details" });
    }
})


//to add items to cart
router.post("/addcart/:id", Authenticate, async (req, res) => {

    try {

        const { id } = req.params;
        const cart = await products.findOne({ id: id });


        const Usercontact = await User.findOne({ _id: req.userID });



        if (Usercontact) {
            const cartData = await Usercontact.addcartdata(cart);

            await Usercontact.save();
            res.status(201).json(Usercontact);
        }
    } catch (error) {
        console.log(error);
    }
});



//api to show cart data
router.get("/cartdetails", Authenticate, async (req, res) => {
    try {
        const buyuser = await User.findOne({ _id: req.userID });
        res.status(201).json(buyuser);
    } catch (error) {
        console.log(error + "error for buy now");
    }
});



//to delete item from the cart
router.get("/remove/:id", Authenticate, async (req, res) => {
    try {

        //getting of the clicked element on fronend
        const { id } = req.params;
         

        //we will save all the items in database whose id is not equal to clicked item id so, it automatically removes the element from the database
        req.rootUser.carts = req.rootUser.carts.filter((curel) => {
            return curel.id != id    //comparing and returning all the items whose id is not equal to the id of item cliked by user
        });

        req.rootUser.save();// saving rest of the items again in database other than selected item
        res.status(201).json(req.rootUser);
        //console.log("iteam remove");

    } catch (error) {
       
        res.status(400).json(error);
    }
});



//to logout a user
router.get("/logout", Authenticate, async (req, res) => {
    try {

        //filtering out all the tokens whose id is not equal to provider id of user
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        res.clearCookie("Amazonweb", { path: "/" });//now, we will clear cookie corresponding to that user and directing to the home page
        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens)
        console.log("user logout");

    } catch (error) {
        console.log(error + "jwt provide then logout");
    }
});



module.exports = router;