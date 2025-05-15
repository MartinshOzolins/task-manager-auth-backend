import dotenv from "dotenv";

import app from "./app.js";

// Loads env variables into process.env
dotenv.config();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
