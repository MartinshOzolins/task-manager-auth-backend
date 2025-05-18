import express from "express";

import { Request, Response, NextFunction } from "express";

// Middlewares
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Routers
import { router as authJwtRouter } from "./routes/authJwtRouter.js";
import { router as taskRouter } from "./routes/taskRouter.js";

// Creates express app instance
const app = express();

// Middlewares configuration
app.use(express.json());
app.use(morgan("tiny"));
app.use(cookieParser());

// Routers
app.use("/api/auth/jwt", authJwtRouter);
app.use("/api/todos", taskRouter);

app.use((req: Request, res: Response) => {
  // Invalid request
  res.status(404).json("Such route does not exist. Please try again!");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // development mode
  if (process.env.NODE_ENV === "development") {
    console.log("error", err);
    res.status(409).json({ err: err, message: err.message });
  } else if (err.code === "P2002") {
    // Prisma error => Unique constraint failure
    res.status(409).json({ message: "Email already in use!" });
  } else if (err.code === "P2025") {
    // Prisma error => Unique constraint failure
    res
      .status(409)
      .json({ message: "No todo was found for update/delete action!" });
  } else {
    // switch statement to match different errors in production mode
    switch (err.message) {
      case "Incorrect credentials": // Invalid credentials => incorrect password or email
        res.status(401).json({
          message: "Invalid credentials: incorrect password or/and email!",
        });
        break;
      case "No credentials": // No credentials => missing password and/or email
        res
          .status(400)
          .json({ message: "Please provide both password and email!" });
        break;
      case "Invalid email": // Invalid email => invalid email address provided
        res
          .status(400)
          .json({ message: "Please provide a valid email address!" });
        break;
      case "No todo description": // No description => no todo description
        res.status(400).json({ message: "Please provide a todo description" });
        break;
      case "JWT sign error": // JWT sign error => Error while signing JWT
        res.status(500).json({ message: "Error occurred while signing JWT" });
        break;
      case "JWT verify error": // JWT verify error => Error while veryfing JWT
        res.status(401).json({ message: "Error occurred while verifying JW" });
        break;
      case "JWT cookie absent": // JWT cookie absent => JWT cookie absent in headers
        res.status(401).json({ message: "Please login again or register!" });
        break;
      case "todo not found": // todo not found => such todo does not exist or/and user is not owner of this todo
        res.status(404).json({ message: "Todo not found" });
        break;
      default:
        res.status(500).json({ message: "Internal server error" });
        break;
    }
  }
});

export default app;
