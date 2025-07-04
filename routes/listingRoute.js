const express=require('express');
const listingController=require('../controllers/listingController');
const authenticate=require('../middlewares/authmiddleware');
const router=express.Router();

router.post(`/create/listing`,authenticate,listingController.createListing);
router.get('/listings',authenticate,listingController.getListings);
router.get('/listings/my', authenticate, listingController.getMyListings);
router.delete('/listings/:id', authenticate, listingController.deleteListing);
router.get('/listings/:id', authenticate, listingController.getListingById);
router.put('/listings/:id', authenticate, listingController.updateListing);

module.exports=router;