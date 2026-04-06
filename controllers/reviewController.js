import Review from "../models/Review.js";

export const addReview = async (req, res) => {

  try {

    const { carId, rating, comment } = req.body;

    const review = new Review({
      user: req.user._id,
      car: carId,
      rating,
      comment
    });

    await review.save();

    res.json({
      message: "Review added successfully",
      review
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

export const getCarReviews = async (req, res) => {

  try {

    const reviews = await Review.find({
      car: req.params.carId
    }).populate("user", "name");

    res.json(reviews);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};