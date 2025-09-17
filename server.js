const express=require('express');
const cors=require('cors');
require('dotenv').config();
const db=require('./config/db');
const path=require('path');

const authRoute=require('./routes/authRoute');
const listingRoute=require('./routes/listingRoute');
const contactRoute = require('./routes/contactRoute');
const premiumRoute=require('./routes/premiumRoute');

const app=express();
app.use(cors({
    origin:'*',
    methods:['PUT','GET','POST','DELETE']
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')));

app.use(authRoute);
app.use(listingRoute);
app.use(contactRoute);
app.use(premiumRoute);

db();
app.listen(3000,()=>{
    console.log('app is listening at port 3000')
});