const express=require('express');
const listingController=require('../controllers/listingController');
const authenticate=require('../middlewares/authmiddleware');
const upload=require('../middlewares/multer');
const router=express.Router();

router.post(`/create/listing`,authenticate,upload.single('image'),listingController.createListing);
router.get('/listings',authenticate,listingController.getListings);
router.get('/listings/my', authenticate, listingController.getMyListings);
router.delete('/listings/:id', authenticate, listingController.deleteListing);
router.get('/listings/:id', authenticate, listingController.getListingById);
router.put('/listings/:id', authenticate, listingController.updateListing);

router.post('/listings/nearby', authenticate, listingController.getNearbyListings);


module.exports=router;