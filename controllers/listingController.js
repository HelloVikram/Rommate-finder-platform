const Listing=require('../models/listing');

const createListing=async(req,res,next)=>{
 const {title,description,city,rent,availableFrom,genderPreference,roomType}=req.body;
 try{
    const userId=req.user.id;
    const response=await Listing.create({userId,title,description,city: city.toLowerCase(),rent,availableFrom,genderPreference,roomType})
    res.status(201).json({success:true,message:'Listing created Successfull!!',data:response});
 }catch(err){
    console.log('Internal Server error',err);
    res.status(500).json({success:false,message:'Interner Server Error',error:err.message})
 }
}

const getListings=async(req,res,next)=>{
    const {city,maxRent,genderPreference,roomType,page=1,limit=6}=req.query;
    let filter={};
    if(city){filter.city=city.trim().toLowerCase()};
    if(maxRent)filter.rent={$lte:Number(maxRent)};
    if(genderPreference)filter.genderPreference=genderPreference;
    if(roomType)filter.roomType=roomType;
    try{
     const totalCount=await Listing.countDocuments();
     const response=await Listing
     .find(filter)
     .sort({createdAt:-1})
     .skip((page-1)*limit)
     .limit(Number(limit))
     .populate('userId', 'email name')
     const totalPages=Math.ceil(totalCount/limit);
     const currentPage=page;

     res.status(200).json({success:true,message:'listing successfull',data:response,totalPages,currentPage})

    }catch(err){
        console.log(err);
        res.status(500).json({success:false,message:'Internal server Error',error:err.message});
    }
}

const getMyListings = async (req, res) => {
  try {
    const userId = req.user.id;
    const listings = await Listing.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: listings });
  } catch (err) {
    console.error("Error getting user's listings:", err);
    res.status(500).json({ success: false, message: 'Internal Server error' });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findOne({ _id: req.params.id, userId: req.user.id });

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found or unauthorized" });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Listing deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

const getListingById = async (req, res) => {
  const listingId = req.params.id;

  try {
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const updateListing = async (req, res) => {
  const listingId = req.params.id;
  const userId = req.user.id; 

  try {
    
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    if (listing.userId?.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this listing' });
    }

    const updatedFields = {
      title: req.body.title,
      description: req.body.description,
      city: req.body.city,
      rent: req.body.rent,
      availableFrom: req.body.availableFrom,
      genderPreference: req.body.genderPreference,
      roomType: req.body.roomType
    };

    await Listing.findByIdAndUpdate(listingId, updatedFields, { new: true });

    res.status(200).json({ success: true, message: 'Listing updated successfully' });

  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports={createListing,getListings,getMyListings,deleteListing,getListingById,updateListing};