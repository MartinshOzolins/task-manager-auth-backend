import app from "./app.js";
import dotenv from "dotenv";

// Loads env variables into process.env
dotenv.config();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
