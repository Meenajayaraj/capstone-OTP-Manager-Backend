import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import cors from "cors";
import "./db/conn.js"; // Assuming db/conn.js exports the connection logic
import router from "./Routes/router.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 4002;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server start at Port No :${PORT}`);
});
