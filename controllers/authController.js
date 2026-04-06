import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/mail.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// ================= REGISTER =================

export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= LOGIN =================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= FORGOT PASSWORD =================

export const forgotPassword = async (req, res) => {
  try {
    console.log("STEP 1: Request received");

    const { email } = req.body;

    console.log("STEP 2: Email:", email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log("STEP 3: User found");

    const token = crypto.randomBytes(32).toString("hex");

    console.log("STEP 4: Token generated:", token);

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 60 * 60 * 1000;

    await user.save();

    console.log("STEP 5: Token saved");

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    console.log("STEP 6: Reset Link:", resetLink);

    await transporter.verify();

    console.log("STEP 7: SMTP Connected");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "DriveNow Password Reset",
      html: `
        <h2>Password Reset</h2>
        <p>Click below link to reset password</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    console.log("STEP 8: Mail sent");

    res.json({
      message: "Reset link sent to email",
    });
  } catch (error) {
    console.log("MAIL ERROR:", error);

    res.status(500).json({
      message: "mail failed",
      error: error.message,
    });
  }
};

// ================= RESET PASSWORD =================

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log("Reset token:", token);

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.log("RESET ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= LOGIN OTP =================

export const sendLoginOTP = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Login OTP",
      text: `Your OTP is ${otp}`,
    });

    console.log("OTP sent to:", email);

    res.json({
      message: "OTP sent to email",
    });
  } catch (error) {
    console.log("OTP ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= VERIFY OTP =================

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp != otp || user.otpExpire < Date.now()) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log("VERIFY OTP ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
