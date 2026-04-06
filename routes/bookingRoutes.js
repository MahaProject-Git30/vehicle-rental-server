import express from "express"
import { bookCar, downloadInvoice, getCarBookings,  getUserBookings, deleteBooking, cancelBooking, getAllBookings, getOwnerBookings } from "../controllers/bookingController.js"
import { protect, adminOnly } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/book", protect, bookCar)

router.get("/my-bookings", protect, getUserBookings)

router.get("/car/:carId", getCarBookings);

router.get("/owner-bookings", protect, getOwnerBookings)

router.put("/cancel/:id", protect, cancelBooking)

router.get("/admin", protect, adminOnly, getAllBookings)

router.delete("/admin/:id", protect, adminOnly, deleteBooking);

router.get("/invoice/:id", protect, downloadInvoice)
export default router