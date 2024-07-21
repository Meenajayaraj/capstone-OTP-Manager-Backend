import mongoose from "mongoose";
import validator from "validator";

const { Schema, model } = mongoose;

const userOtpSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not Valid Email");
      }
    },
  },
  otp: {
    type: String,
    required: true,
  },
});

// user otp model
const UserOtp = model("userotps", userOtpSchema);

export default UserOtp;
