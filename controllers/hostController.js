import HostRequest from "../models/HostRequest.js";
import transporter from "../config/mail.js";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// GET ALL REQUESTS (ADMIN)
export const getHostRequests = async (req, res) => {
  try {
    const requests = await HostRequest.find().populate("user", "name email");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// APPROVE HOST
export const approveHost = async (req, res) => {
  try {
    const request = await HostRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const user = await User.findById(request.user);

    user.role = "owner";
    await user.save();

    request.status = "approved";
    await request.save();

    res.json({ message: "User promoted to owner" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// USER REQUEST HOST
export const requestHost = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    // ❗ check existing request
    const existing = await HostRequest.findOne({ user: req.user._id });

    if (existing) {
      return res.status(400).json({
        message: "You already sent a request",
      });
    }

    // ✅ SAVE IN DB
    const newRequest = new HostRequest({
      user: req.user._id,
      name,
      email,
      mobile,
      message,
    });

    await newRequest.save();

    // ✅ SEND EMAIL
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Become Host Request",
      html: `
        <h2>New Host Request</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Mobile:</b> ${mobile}</p>
        <p><b>Message:</b> ${message}</p>
        <hr/>
        <p>User ID: ${req.user._id}</p>
      `,
    });

    res.json({
      message: "Host request sent successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};