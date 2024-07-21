import jwt from "jsonwebtoken";
import User from "../models/userSchema"; // Assuming userSchema is exported as default
import dotenv from "dotenv";

dotenv.config();
const keysecret = process.env.SECRET_KEY;

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    const verifytoken = jwt.verify(token, keysecret);

    const rootUser = await User.findOne({ _id: verifytoken._id });

    if (!rootUser) {
      throw new Error("User not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    next();
  } catch (error) {
    res.status(401).json({ status: 401, message: error.message });
  }
};

export default authenticate;
