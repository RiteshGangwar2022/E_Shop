const mongoose = require("mongoose");
const User = require("../Db/models/userSchema");
const bcrypt = require("bcryptjs");

//function to login
const Login = async (req, res) => {
  const { email, password } = req.body;
 // console.log(req.body); // to check if we are getting data from frontend or not

  //cheking if user have both email and password or not
  if (!email || !password) {
    res.status(400).json({ error: "fill the data properly" });
  }

  try {

    const userlogin = await User.findOne({ email: email }); //first email is from database and second is filled by user

    //checking if the user with entered email id exists in database or not

    if (userlogin) {
      //now, comparing password entered by user with the password present in database
      const ismatch = await bcrypt.compare(password, userlogin.password);
       
      if (!ismatch) {
        res.status(400).json({ error: "invalid details" });
      } else {
       
        //if user exists then, generate a token to the given user
        const token = await userlogin.generatAuthtoken();
      

        //creating cookie-parser (cookie-name->Amazon web, and we using token to create cookie)
        res.cookie("Amazonweb", token, {
          expires: new Date(Date.now() + 900000), //token expires after 30hrs
          httpOnly: true,
        });

        //sending data which is fetched from database to frontend to show different pop_ups(toast)
        res.status(201).json(userlogin);
      }
    } else {
      res.status(400).json({ error: "user not exists" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid details" });
  }
};


//to register user
const Signup = async (req, res) => {
  //console.log(req.body);
  const { fname, email, mobile, password, cpassword } = req.body; //req.body contains the whole data

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
    } else if (password !== cpassword) {
      res
        .status(422)
        .json({ error: "password and confirm password do not match" });
    } else {
      const newuser = new User({ fname, email, mobile, password, cpassword });
      const data = await newuser.save();
       //console.log(data);
      //sending data which is fetched from database to frontend to show different pop_ups(toast)
      res.status(201).json(data);
    }
  } catch (err) {
    res.status(422).send(err);
  }
};


const Logout = async (req, res) => {
  try {
    //filtering out all the tokens whose id is not equal to provider id of user
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });

    res.clearCookie("Amazonweb", { path: "/" }); //now, we will clear cookie corresponding to that user and directing to the home page
    req.rootUser.save();
    res.status(201).json(req.rootUser.tokens);
    console.log("user logout");
  } catch (error) {
    //console.log(error + "jwt provide then logout");
    res.status(201).json(error);
  }
};

module.exports = { Login, Signup, Logout };
