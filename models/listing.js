const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    city: String,
    rent: Number,
    availableFrom: Date,
    genderPreference: String,
    roomType: String,
    imageUrl: {
        type: String,
    },
    location: {
  type: {
    type: String,
    enum: ['Point'],
    required: true,
    default: 'Point',
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  }
}

}, { timestamps: true })

listingSchema.index({ location: '2dsphere' });


module.exports = mongoose.model('Listing', listingSchema);