const express=require("express");
const mongoose=require("mongoose");
const app=express();
const path=require("path");//to get static pages path for deployment
const router=require("./routes/Router")
const dotenv=require("dotenv");
const cookieParser=require("cookie-parser"); // we are using cookie parser to parse cookie data on frontend
//we need to include env file only in serverjs 
dotenv.config();

//to share data between backend and frontend on two different ports
const cors=require("cors");

//to connect backend to database
const connectdb=require("./connection/conn");
connectdb();

app.use(express.json());

//need of cookie  =>cookies let websites recognize users and recall their individual login information 
app.use(cookieParser(""));//it is used to to parse the created cookie data
app.use(cors());

//we are creating another Router file so that server.js remain simple and , we will write all our api inside the Router to fetch data on frontend
app.use(router);

//to insert dummy product data into database(mongoatlas)
const products=require("./Db/productdata");
const Deafaultdata=require("./Db/defaultdata")


//for deployment
app.use(express.static(path.join(__dirname, "./client/build")))
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
})



//getting port from env file
const port=process.env.PORT;

app.listen(port,(()=>{
    console.log("server is running on port ");
}));

//we are calling this fn to insert dummy data of products int database
Deafaultdata();