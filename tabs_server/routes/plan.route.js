const express = require("express");
const Razorpay = require("razorpay");
const CryptoJS = require("crypto-js");
const User = require("../models/user.model");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const { planType } = req.body;
    let amount = 0;

    if (planType === "monthly") {
      amount = 299;
    } else if (planType === "annual") {
      amount = 2999;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid plan type",
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Order creation failed",
      err: err.message,
    });
  }
});

router.post("/verify", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    planType,
    userId,
  } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  const generated_signature = CryptoJS.HmacSHA256(
    razorpay_order_id + "|" + razorpay_payment_id,
    secret,
  ).toString(CryptoJS.enc.Hex);

  if (generated_signature !== razorpay_signature)
    return res.status(400).json({ message: "Invalid payment signature" });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  let duration = 0;
  let amount = 0;

  if (planType === "monthly") {
    duration = 30; // days
    amount = 299;
  } else if (planType === "annual") {
    duration = 365;
    amount = 2999;
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + duration);

  user.plan = {
    name: planType,
    price: amount,
    startDate,
    endDate,
    isActive: true,
  };

  await user.save();
  res.json({ success: true, message: "Payment verified, plan activated." });
});

module.exports = router;
