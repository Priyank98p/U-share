import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },

  department: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  studentIdCard: {
    type: String,
    required: true,
  },
  isVerified:{
    type: Boolean,
    default: false
  },
  rating:{
    type:Number
  },
  totalReviews:{
    type: Number,
    default : 0
  }
},{
    timestamps:true
});


userSchema.pre("save", async function(){
    if (!this.isModified("password")) return

    this.password = await bcrypt.hash(this.password, 10)
})

export default User = mongoose.model("User", userSchema)