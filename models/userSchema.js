import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const keysecret = process.env.SECRET_KEY;

const { Schema, model } = mongoose;

const userSchema = new Schema({
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Not valid email",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  cpassword: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  verifytoken: {
    type: String,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

// Generate authentication token
userSchema.methods.generateAuthtoken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, keysecret, {
      expiresIn: "1d",
    });

    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (error) {
    throw error;
  }
};

// Create model
const User = model("users", userSchema);

export default User;
