import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectToMongoDB } from "./models/db.js";
import { userRouter } from "./routes/auth.js";
import { classRouter } from "./routes/class.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use("/user",userRouter);
app.use("/class",classRouter);

connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});