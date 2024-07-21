import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongoURL = process.env.DATABASE;
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(mongoURL);
    console.log("Connected to the mongodb");
    return connection;
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;