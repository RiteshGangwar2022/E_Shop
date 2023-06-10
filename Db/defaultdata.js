const products=require("./models/productschema")
const productsdata=require("./productdata");

//this fn is used to insert data into database(mongoatlas), which can be used anywhere in our 
const Defaultdata=async()=>{

    try{
        // to delete extra data from the database  
       // await products.deleteMany({});

        //to insert data into database
       await products.insertMany(productsdata);

    }
    catch(err){
        console.log(err);
    }
}

module.exports=Defaultdata;