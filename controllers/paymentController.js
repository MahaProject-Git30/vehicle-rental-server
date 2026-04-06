import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import transporter from "../config/mail.js";
import dotenv from "dotenv";    

dotenv.config();

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount required" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_order",
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      carId,
      startDate,
      endDate,
      totalPrice,
    } = req.body;

    // 🔐 VERIFY SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    // 🚨 PREVENT DOUBLE BOOKING
    const existingBooking = await Booking.findOne({
      car: carId,
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Car already booked for selected dates",
      });
    }

    // ✅ CREATE BOOKING
    const booking = new Booking({
      user: req.user._id,
      car: carId,
      startDate,
      endDate,
      totalPrice,
    });

    await booking.save();

    // 📩 EMAIL
    const car = await Car.findById(carId);
    const user = await User.findById(req.user._id);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Booking Confirmed 🚗",
      html: `
        <h2>Booking Confirmed</h2>
        <p>Hello ${user.name},</p>
        <p>Your booking is successful.</p>

        <ul>
          <li><b>Car:</b> ${car.name}</li>
          <li><b>Location:</b> ${car.location}</li>
          <li><b>Start:</b> ${new Date(startDate).toLocaleDateString()}</li>
          <li><b>End:</b> ${new Date(endDate).toLocaleDateString()}</li>
          <li><b>Total:</b> ₹${totalPrice}</li>
        </ul>

        <p>Thank you 🚗</p>
      `,
    });

    res.json({
      message: "Payment verified & booking created",
      booking,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};