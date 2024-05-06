const jwt = require("jsonwebtoken");
const User = require("../Db/models/userSchema");


const Authenticate = async(req,res,next)=>{
    try {

       //here we are getting token according to the the data entered by user on frontend to login
        const token = req.cookies.Amazonweb;//here Amazonweb is the cookie name
        

        //comparing generated token with the token present in database
        const verifyToken = jwt.verify(token,process.env.SECRET_KEY);

        //console.log(verifyToken);  
                                              
                                          //database id:token id ,if it fails then compoare token directly
        const rootUser = await User.findOne({_id:verifyToken._id,"tokens.token":token});
       
       // console.log(rootUser);
 
        if(!rootUser){ throw new Error("User Not Found") };
          //console.log(rootUser);
        req.token = token
        req.rootUser = rootUser 
        req.userID = rootUser._id    
    
        next();  //it calls the next fn after exectution of this middleware


    } catch (error) {
        res.status(401).send("Unauthorized:No token provided");
      //  console.log(error);
    }
};

module.exports = Authenticate;    