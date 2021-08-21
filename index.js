const express = require("express");
const cors = require("cors");
const mainRoute = require("./controllers/maincontroller");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();
let PORT = process.env.PORT || 5000;
let uri = process.env.DB_URI;

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}).catch(err=>console.log('Error!\n'+err));

app.use(cors());
app.use(express.json());
app.use('/', mainRoute);

app.listen(PORT, ()=>{console.log('[+] Express server is running on PORT: '+PORT);});