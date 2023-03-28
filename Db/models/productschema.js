const mongoose = require('mongoose');

//creating schema according to dummy data
const productSchema=new mongoose.Schema({

    id:String,
    url:String,
    detailUrl:String,
    title:Object,
    price:Object,
    description:String,
    discount:String,
    tagline:String
})

//creating model products of the productSchema
const products= new mongoose.model("products",productSchema);

module.exports=products;
