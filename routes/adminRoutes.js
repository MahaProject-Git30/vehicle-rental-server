import express from "express"
import { getAdminStats, getAllUsers, updateUserRole,  deleteUser } from "../controllers/adminController.js"
import { protect, adminOnly } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/stats", protect, adminOnly, getAdminStats)

router.get("/users", protect, adminOnly, getAllUsers)

router.put("/users/:id", protect, adminOnly, updateUserRole)

router.delete("/users/:id", protect, adminOnly, deleteUser)

export default router