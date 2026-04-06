import express from "express"
import { addCar, getCars, getSingleCar,updateCar , searchCars, deleteCar, getOwnerCars } from "../controllers/carController.js"
import upload from "../middleware/upload.js"
import { protect, allowAdminOrOwner, adminOnly } from "../middleware/authMiddleware.js"

const router = express.Router()
router.post("/add", protect, allowAdminOrOwner, upload.single("image"), addCar);
// Get all cars
router.get("/", getCars)

// Search cars
router.get("/search", searchCars)

router.get("/owner", protect, getOwnerCars)

// Get single car
router.get("/:id", getSingleCar)

router.put("/update/:id", protect, allowAdminOrOwner, upload.single("image"), updateCar)

// Delete car
router.delete("/:id", protect, adminOnly, deleteCar)

export default router