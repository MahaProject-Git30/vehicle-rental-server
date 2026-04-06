import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    totalPrice: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        default: "Booked"
    }

},
{ timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);