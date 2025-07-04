const jwt=require('jsonwebtoken');
const User=require('../models/user');

const authenticate=async(req,res,next)=>{
    const token=req.header('Authorization')?.split(' ')[1];
    if(!token)
    {
        return res.status(401).json({success:false,message:'Authorization failed no token found'});
    }
 try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const user= await User.findById(decoded.id);
    if(!user){
        return res.status(404).json({success:false,message:'User not found!'});
    }
    req.user=user;
    next();
 }catch(err){
    res.status(400).json({success:false,message:"Error in authenticatin Invalid token",error:err})
 }
}

module.exports=authenticate;