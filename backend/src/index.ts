import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectToMongoDB } from "./models/db.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});