import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

export const adminOnly = (req, res, next) => {

  if (req.user && req.user.role === "admin") { 
    next()
  } else {
    res.status(403).json({
      message: "Admin access only"
    })
  }
}

export const ownerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user._id.toString() === req.params.id)) {
    next()
  } else {


    res.status(403).json({
      message: "Access denied"
    })
  }
}

export const allowAdminOrOwner = (req, res, next) => {

  if (req.user.role === "admin" || req.user.role === "owner") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied" });
  }

};