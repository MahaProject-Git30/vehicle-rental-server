import Booking from "../models/Booking.js";
import PDFDocument from "pdfkit";

export const bookCar = async (req, res) => {
  try {
    const { carId, startDate, endDate, totalPrice } = req.body;

    // check existing bookings
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

    // create booking
    const booking = new Booking({
      user: req.user._id,
      car: carId,
      startDate,
      endDate,
      totalPrice,
    });

    await booking.save();

    res.status(201).json({
      message: "Car booked successfully",
      booking,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("car");

    res.status(200).json(bookings);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    booking.status = "Cancelled";

    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getAllBookings = async (req, res) => {

  try {

    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("car", "name brand model location image");

    res.json(bookings);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

export const getOwnerBookings = async (req, res) => {

  try {

    const bookings = await Booking.find()
      .populate("car")
      .populate("user", "name email mobile")

    const ownerBookings = bookings.filter(
      booking => booking.car.owner.toString() === req.user._id.toString()
    )

    res.json(ownerBookings)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error"
    })

  }

}

export const deleteBooking = async (req, res) => {

  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    await booking.deleteOne();

    res.json({
      message: "Booking deleted successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

export const downloadInvoice = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("car", "name brand model location");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${booking._id}.pdf`
    );

    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Company Header
    doc
      .fontSize(24)
      .text("DriveNow Car Rentals", { align: "center" });

    doc
      .fontSize(10)
      .text("Chennai, Tamil Nadu", { align: "center" })
      .text("support@drivenow.com", { align: "center" });

    doc.moveDown(2);

    // Invoice title
    doc
      .fontSize(18)
      .text("INVOICE", { align: "center", underline: true });

    doc.moveDown();

    // Invoice details
    doc
      .fontSize(12)
      .text(`Invoice Number: INV-${booking._id}`)
      .text(`Invoice Date: ${new Date().toLocaleDateString()}`);

    doc.moveDown();

    // Customer Details
    doc
      .fontSize(14)
      .text("Customer Details", { underline: true });

    doc
      .fontSize(12)
      .text(`Name: ${booking.user.name}`)
      .text(`Email: ${booking.user.email}`);

    doc.moveDown();

    // Car Details
    doc
      .fontSize(14)
      .text("Car Details", { underline: true });

    doc
      .fontSize(12)
      .text(`Car Name: ${booking.car.name}`)
      .text(`Brand: ${booking.car.brand}`)
      .text(`Model: ${booking.car.model}`)
      .text(`Location: ${booking.car.location}`);

    doc.moveDown();

    // Booking Period
    doc
      .fontSize(14)
      .text("Booking Details", { underline: true });

    doc
      .fontSize(12)
      .text(
        `Start Date: ${new Date(booking.startDate).toLocaleDateString()}`
      )
      .text(
        `End Date: ${new Date(booking.endDate).toLocaleDateString()}`
      );

    doc.moveDown();

    // Payment Summary
    doc
      .fontSize(14)
      .text("Payment Summary", { underline: true });

    doc
      .fontSize(12)
      .text(`Total Paid: ₹${booking.totalPrice}`);

    doc.moveDown(3);

    // Footer
    doc
      .fontSize(10)
      .text("Thank you for choosing DriveNow!", { align: "center" })
      .text("Safe Drive 🚗", { align: "center" });

    doc.end();

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};

export const getCarBookings = async (req, res) => {

  try {

    const bookings = await Booking.find({
      car: req.params.carId
    }).select("startDate endDate");

    res.json(bookings);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};