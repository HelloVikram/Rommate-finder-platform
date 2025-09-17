const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken');

const signup = async (req, res, next) => {
    const { name, email, password, age, gender, profession, budget, phone} = req.body
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const saltround = 10;
        const hashed = await bcrypt.hash(password, saltround);
        const newUser = await User.create({
            name,
            email,
            password: hashed,
            age,
            gender,
            profession,
            budget,
            phone
        })
        res.status(201).json({ success: true, message: 'Signup Successfull!' });
    } catch (err) {
        console.log('Error in signup', err);
        res.status(500).json({ success: false, message: 'Something went wrong', error: err.message });
    }
}

const login=async (req,res,next)=>{
    const {email,password}=req.body;
    try{
     const user= await User.findOne({email});
     if(!user){
      return  res.status(404).json({status:false,message:'User not found!'})
     }
     else{
      const isMatch=await bcrypt.compare(password,user.password);
      if(!isMatch){
        return res.status(401).json({status:false,message:'Incorrect Password'})
      }
      const token= jwt.sign({id:user._id,email:user.email,name:user.name,isPremium:user.isPremium},process.env.JWT_SECRET);
      return res.status(200).json({success:true,token:token,message:'Login successfull!'});
     }
    }catch(err){
     console.log('Error in Login',err);
     res.status(500).json({success:false,message:'Interner Server Error',error:err});
    }
}

module.exports = { signup,login };