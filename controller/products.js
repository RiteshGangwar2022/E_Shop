const products = require("../Db/models/productschema");
const User = require("../Db/models/userSchema");

const Getproducts = async (req, res) => {
  try {
    //getting data from database
    const data = await products.find();
    //sending data to server with status code(200==success)
    res.status(200).json(data);
    //console.log(data)
  } catch (err) {
    //console.log("not able to fetched data");
    res.status(200).json("error");
  }
};

//api to get individual items of products so that when we click on an image on carousel it get directed to buynow page
const Singleproduct = async (req, res) => {
  try {
    //getting id of the particular product from database on clicking to the image of that item
    const id = req.params.id;
    const singleitem = await products.findOne({ id: id });
    res.status(201).json(singleitem);
  } catch (err) {
    res.status(400).json("error");
  }
};

const Addcart = async (req, res) => {
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
    //console.log(error);
    res.status(201).json("error");
  }
};

//api to show cart data
const Carddetails = async (req, res) => {
  try {
    const buyuser = await User.findOne({ _id: req.userID });
    res.status(201).json(buyuser);
  } catch (error) {
    //console.log(error + "error for buy now");
    res.status(201).json("error");
  }
};

//to delete item from the cart
const Removeitem = async (req, res) => {
  try {
    //getting of the clicked element on fronend
    const { id } = req.params;
    

    //we will save all the items in database whose id is not equal to clicked item id so, it automatically removes the element from the database
    req.rootUser.carts = req.rootUser.carts.filter((curel) => {
      return curel.id != id; //comparing and returning all the items whose id is not equal to the id of item cliked by user
    });

    req.rootUser.save(); // saving rest of the items again in database other than selected item
    res.status(201).json(req.rootUser);
    //console.log("iteam remove");
  } catch (error) {
    res.status(400).json(error);
  }
};
module.exports = {
  Getproducts,
  Singleproduct,
  Addcart,
  Carddetails,
  Removeitem,
};
