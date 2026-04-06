import mongoose from "mongoose"

const hostRequestSchema = new mongoose.Schema({

 user:{
  type: mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 name:String,

 email:String,

 mobile:String,

 message:String,

 status:{
  type:String,
  default:"pending"
 }

},{timestamps:true})

export default mongoose.model("HostRequest",hostRequestSchema)