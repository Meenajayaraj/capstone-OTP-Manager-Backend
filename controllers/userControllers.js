import nodemailer from "nodemailer";
import users from "../models/userSchema";
import userotp from "../models/userOtp";
import dotenv from "dotenv";

dotenv.config();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// User registration endpoint
export const userregister = async (req, res) => {
  const { fname, email, password } = req.body;

  if (!fname || !email || !password) {
    res.status(400).json({ error: "Please Enter All Input Data" });
    return;
  }

  try {
    const preuser = await users.findOne({ email });

    if (preuser) {
      res.status(400).json({ error: "This User Already Exists in our DB" });
      return;
    }

    const userregister = new users({
      fname,
      email,
      password,
    });

    const storeData = await userregister.save();
    res.status(200).json(storeData);
  } catch (error) {
    res.status(400).json({ error: "Invalid Details", error });
  }
};

// User OTP sending endpoint
export const userOtpSend = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "Please Enter Your Email" });
    return;
  }

  try {
    const preuser = await users.findOne({ email });

    if (!preuser) {
      res.status(400).json({ error: "This User Does Not Exist in our DB" });
      return;
    }

    const OTP = Math.floor(100000 + Math.random() * 900000);

    let existingOtp = await userotp.findOne({ email });

    if (existingOtp) {
      existingOtp.otp = OTP;
      await existingOtp.save();
    } else {
      existingOtp = new userotp({
        email,
        otp: OTP,
      });
      await existingOtp.save();
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Sending Email For OTP Validation",
      text: `OTP: ${OTP}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error", error);
        res.status(400).json({ error: "Email not sent" });
      } else {
        console.log("Email sent", info.response);
        res.status(200).json({ message: "Email sent successfully" });
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Invalid Details", error });
  }
};

// User login endpoint
export const userLogin = async (req, res) => {
  const { email, otp } = req.body;

  if (!otp || !email) {
    res.status(400).json({ error: "Please Enter Your OTP and Email" });
    return;
  }

  try {
    const otpverification = await userotp.findOne({ email });

    if (!otpverification || otpverification.otp !== otp) {
      res.status(400).json({ error: "Invalid OTP" });
      return;
    }

    const preuser = await users.findOne({ email });

    if (!preuser) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const token = await preuser.generateAuthtoken();
    res
      .status(200)
      .json({ message: "User Login Successfully", userToken: token });
  } catch (error) {
    res.status(400).json({ error: "Invalid Details", error });
  }
};
