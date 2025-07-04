const mongoose=require('mongoose');

const listingSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    city:String,
    rent:Number,
    availableFrom:Date,
    genderPreference:String,
    roomType:String
},{timestamps:true})

module.exports=mongoose.model('Listing',listingSchema);