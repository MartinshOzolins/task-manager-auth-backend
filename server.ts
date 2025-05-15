import express from "express";
import dotenv from "dotenv";

// Loads env variables into process.env
dotenv.config();

const app = express();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
