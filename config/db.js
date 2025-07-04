const mongoose=require('mongoose');

async function database() {
    try{
       await mongoose.connect(process.env.MONGO_URL)
       console.log('Database connected!')
    }catch(err){
        console.log('Database connection error',err);
    }
}

module.exports=database;