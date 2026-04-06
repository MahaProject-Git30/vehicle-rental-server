import express from "express"
import { registerUser, 
         loginUser, 
         sendLoginOTP, 
         verifyOTP, 
         forgotPassword, 
         resetPassword } from "../controllers/authController.js"


const router = express.Router()

router.post("/register", registerUser)

router.post("/login", loginUser)

router.post("/login-otp", sendLoginOTP)

router.post("/forgot-password", forgotPassword)

router.post("/reset-password/:token", resetPassword)

router.post("/verify-otp", verifyOTP)

export default router