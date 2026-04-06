import User from "../models/User.js"
import Car from "../models/Car.js"
import Booking from "../models/Booking.js"

export const getAdminStats = async (req, res) => {

  try {

    const totalUsers = await User.countDocuments()

    const totalCars = await Car.countDocuments()

    const totalBookings = await Booking.countDocuments()

    const revenueData = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" }
        }
      }
    ])

    const totalRevenue = revenueData[0]?.totalRevenue || 0

    res.json({
      totalUsers,
      totalCars,
      totalBookings,
      totalRevenue
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error"
    })

  }

}

export const getAllUsers = async (req,res)=>{

  try{

    const users = await User.find().select("-password")

    res.json(users)

  }catch(error){

    res.status(500).json({message:"Server error"})

  }

}

export const updateUserRole = async (req, res) => {

  try {

    const { role } = req.body

    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    user.role = role

    await user.save()

    res.json({
      message: "User role updated successfully",
      user
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error"
    })

  }

}

export const deleteUser = async (req, res) => {

  try {

    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    // 🚨 Prevent deleting admin

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin cannot be deleted"
      })
    }

    await user.deleteOne()

    res.json({
      message: "User deleted successfully"
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error"
    })

  }

}



