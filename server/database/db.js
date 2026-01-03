const mongoose = require("mongoose");

require("dotenv").config();

mongoose
.connect(process.env.MONGO_URL)
.then(()=>console.log("Databse connected Successfully"))
.catch(e=>console.log(e));


    
