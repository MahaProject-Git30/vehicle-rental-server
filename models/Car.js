import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  brand: {
    type: String,
    required: true,
  },

  model: {
    type: String,
    required: true,
  },

  year: {
    type: Number,
    required: true,
  },

  pricePerHour: {
    type: Number,
    required: true,
  },

  pricePerDay: {
    type: Number,
    required: true,
  },

  pricePerWeek: {
    type: Number,
    required: true,
  },

  fuelType: {
    type: String,
  },

  transmission: {
    type: String,
  },

  seats: {
    type: Number,
  },

  location: {
    type: String,
  },

  image: {
    type: String,
  },

  rating: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Car", carSchema);
