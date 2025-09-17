const premiumService = require('../services/paymentService'); 
const User=require('../models/user');
const jwt=require('jsonwebtoken');

const buypremium = async (req, res) => {
  try {
    const amount = 2500; 
    const razorpayOrder = await premiumService.createRazorpayOrder(amount);

    await premiumService.createUserOrder(req.user.id, razorpayOrder); 
    res.status(201).json({
      success: true,
      order: razorpayOrder,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error("Buy Premium Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const updatepremiumuser = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;

    const order = await premiumService.findOrderById(order_id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await premiumService.updateOrderStatus(order_id, payment_id, 'success');
    await premiumService.updateUserPremiumStatus(order.userId, true);
    const user = await User.findById(req.user._id);
    const newToken = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      },
      process.env.JWT_SECRET,
    );

    res.status(202).json({ success: true, message: "Transaction successful" ,newToken:newToken});
  } catch (err) {
    console.error("Update Premium Error:", err);
    res.status(500).json({ success: false, message: 'Error while updating premium user' });
  }
};

const updatepremiumuseronfailure = async (req, res) => {
  try {
    const { order_id } = req.body;

    const order = await premiumService.findOrderById(order_id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await premiumService.updateOrderStatus(order_id, null, 'failure');

    res.status(201).json({ success: false, message: 'Transaction Failed' });
  } catch (err) {
    console.error("Failure Update Error:", err);
    res.status(500).json({ success: false, message: 'Error while updating premium user' });
  }
};

module.exports = {
  buypremium,
  updatepremiumuser,
  updatepremiumuseronfailure
};
