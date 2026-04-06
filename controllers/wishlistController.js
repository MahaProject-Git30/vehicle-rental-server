import User from "../models/User.js";

export const toggleWishlist = async (req,res)=>{

  try{

    const user = await User.findById(req.user._id);

    const carId = req.body.carId;

    const index = user.wishlist.indexOf(carId);

    if(index === -1){

      user.wishlist.push(carId);

    }else{

      user.wishlist.splice(index,1);

    }

    await user.save();

    res.json(user.wishlist);

  }catch(error){

    res.status(500).json({message:"Server error"});

  }

};

export const getWishlist = async (req,res)=>{

  try{

    const user = await User.findById(req.user._id).populate("wishlist");

    res.json(user.wishlist);

  }catch(error){

    res.status(500).json({message:"Server error"});

  }

};