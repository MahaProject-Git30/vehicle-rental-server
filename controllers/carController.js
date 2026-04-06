import Car from "../models/Car.js";
import cloudinary from "../config/cloudinary.js";

export const addCar = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "cars" },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            },
          );

          stream.end(req.file.buffer);
        });
      };

      const result = await streamUpload();

      imageUrl = result.secure_url;
    }

    const car = new Car({
      owner: req.user._id,

      name: req.body.name,
      brand: req.body.brand,
      model: req.body.model,
      year: req.body.year,

      pricePerHour: req.body.pricePerHour,
      pricePerDay: req.body.pricePerDay,
      pricePerWeek: req.body.pricePerWeek,

      fuelType: req.body.fuelType,
      transmission: req.body.transmission,
      seats: req.body.seats,

      location: req.body.location,

      image: imageUrl || req.body.image,
    });
    await car.save();

    res.status(201).json({
      message: "Car added successfully",
      car,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getCars = async (req, res) => {
  try {
    const cars = await Car.find();

    res.json(cars);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getSingleCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    res.json(car);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const searchCars = async (req, res) => {
  try {
    const {
      location,
      fuelType,
      minPrice,
      maxPrice,
      seats,
      transmission,
      sort,
    } = req.query;

    let filter = {};

    // Location search
    if (location) {
      filter.location = { $regex: `^${location}`, $options: "i" };
    }

    // Fuel type
    if (fuelType) {
      filter.fuelType = fuelType;
    }

    // Seats
    if (seats) {
      filter.seats = seats;
    }

    // Transmission
    if (transmission) {
      filter.transmission = transmission;
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.pricePerHour = {};

      if (minPrice) filter.pricePerHour.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerHour.$lte = Number(maxPrice);
    }

    // Build query
    let query = Car.find(filter);

    // Sort logic
    if (sort === "price_asc") {
      query = query.sort({ pricePerHour: 1 });
    }

    if (sort === "price_desc") {
      query = query.sort({ pricePerHour: -1 });
    }

    const cars = await query;

    res.json(cars);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    await car.deleteOne();

    res.json({
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getOwnerCars = async (req, res) => {
  try {
    const cars = await Car.find({
      owner: req.user._id,
    });

    res.json(cars);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateCar = async (req, res) => {

  try {

    const car = await Car.findById(req.params.id)

    if (!car) {
      return res.status(404).json({
        message: "Car not found"
      })
    }

    if (car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" })
    }

    let imageUrl = car.image

    if (req.file) {

      const streamUpload = () => {
        return new Promise((resolve, reject) => {

          const stream = cloudinary.uploader.upload_stream(
            { folder: "cars" },
            (error, result) => {
              if (result) resolve(result)
              else reject(error)
            }
          )

          stream.end(req.file.buffer)

        })
      }

      const result = await streamUpload()

      imageUrl = result.secure_url
    }

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        brand: req.body.brand,
        model: req.body.model,
        year: req.body.year,
        pricePerHour: req.body.pricePerHour,
        pricePerDay: req.body.pricePerDay,
        pricePerWeek: req.body.pricePerWeek,
        fuelType: req.body.fuelType,
        transmission: req.body.transmission,
        seats: req.body.seats,
        location: req.body.location,
        image: imageUrl
      },
      { new: true }
    )

    res.json({
      message: "Car updated successfully",
      car: updatedCar
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error"
    })

  }

}
