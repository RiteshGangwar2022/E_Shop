const mongoose=require("mongoose");

//to hide database name and password and getting the url from the env file
const url=process.env.DB;
//console.log(url);
const connectdb=async () =>{

    try{
        const connect=await mongoose.connect(url);
        console.log("server cononected to database");
    }
    catch(err){
        console.log(err);
    }

}

//we will call connectdb fn inside serverjs to connect database to backend(nodejs)
module.exports=connectdb;