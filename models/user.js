const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    profession: {
        type: String,
    },
    budget: Number,
    isPremium: {
    type: Boolean,
    default: false
    },
    phone:{
        type:String,
        required:true
    }
    },
     { timestamps: true });

module.exports = mongoose.model('User', userSchema);