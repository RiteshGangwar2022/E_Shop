const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path"); //to get static pages path for deployment
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const userRoutes = require("./routes/user");
const productsRoutes = require("./routes/products");
const paymentRoutes = require("./routes/payment");
const cors = require("cors");

//we need to include env file only in serverjs
dotenv.config();

//to connect backend to database
const connectdb = require("./Db/connection/conn");
connectdb();

app.use(express.json());
app.use(cookieParser());
app.use(cors());


//for deployment
/app.use(express.static(path.join(__dirname, "./client/build")))
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
})

// User routes
app.use('/api/user', userRoutes);

//products routes
app.use('/api/products', productsRoutes);

//payment routes
app.use('/api/pay', paymentRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("server is running on port ");
});


