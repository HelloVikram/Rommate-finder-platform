const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/user');


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createRazorpayOrder = async (amount) => {
  const options = {
    amount: amount,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`
  };
  return await razorpay.orders.create(options);
};

const createUserOrder = async (userId, razorpayOrder) => {
  return await Order.create({
    userId,
    orderId: razorpayOrder.id,
    status: 'pending'
  });
};


const findOrderById = async (orderId) => {
  return await Order.findOne({ orderId });
};

const updateOrderStatus = async (orderId, paymentId, status) => {
  return await Order.findOneAndUpdate(
    { orderId },
    { paymentId, status },
    { new: true }
  );
};

const updateUserPremiumStatus = async (userId, isPremium = true) => {
  return await User.findByIdAndUpdate(
    userId,
    { isPremium },
    { new: true }
  );
};

module.exports = {
  createRazorpayOrder,
  createUserOrder,
  findOrderById,
  updateOrderStatus,
  updateUserPremiumStatus
};
