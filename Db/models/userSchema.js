const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");



const userSchema=new mongoose.Schema({

    fname:{
        type: 'string',
        required: true,
        trim: true
    },
    email:{
        type: 'string',
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('not a valid email address');
            }
        }
    },
    mobile:{
        type:Number,
        required: true,
        maxLength:10
    },
    password:{
        type:String,
        required: true
    },
    cpassword:{
        type:String,
        required: true
    },
    tokens://saves array of objects(for JWT authentication)
    [
        {
          token:{
            type:String,
            required:true
          }
        }
    ],
    carts:Array
});

//to hash password before saving, w need to put a middleware 
//pre function takes two argumnets ("fn before which we need to call",next())
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
           //salt is used to hash password, higher the salt ,more the password will be stronger and ,more time it take to resolve
        this.password = await bcrypt.hash(this.password, 12);//it is hashed with salt 12
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});


// generting token
userSchema.methods.generatAuthtoken = async function(){
    try {
        let token = jwt.sign({ _id:this._id},process.env.SECRET_KEY,{
            expiresIn:"1d"
        });
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;

    } catch (error) {
        console.log(error);
    }
}


// addto cart data (instance fn ) to save data to cart
userSchema.methods.addcartdata = async function(cart){
    try {
        this.carts = this.carts.concat(cart);
        await this.save();
        return this.carts;
    } catch (error) {
        console.log(error + "getting  error during adding item");
    }
}

const User=new mongoose.model("User",userSchema);
module.exports=User;