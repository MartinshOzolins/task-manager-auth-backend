import express from "express";

import { Request, Response, NextFunction } from "express";

// Middlewares
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";

// Routers
import { router as authJwtRouter } from "./routes/authJwtRouter.js";
import { router as taskRouter } from "./routes/taskRouter.js";
import AppError from "./utils/appError.js";

// Creates express app instance
const app = express();

// Middlewares configuration
app.use(rateLimit({ limit: 100, windowMs: 15 * 60 * 1000 }));
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
  console.log(err);

  // Development environment
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode || 500).json({
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
    return;
  }

  // Prisma unique constraint error
  if (err.code === "P2002") {
    res.status(409).json({ message: "Email already in use!" });
    return;
  }

  // Prisma record not found error
  if (err.code === "P2025") {
    res.status(409).json({ message: "No TODO found to update or delete." });
    return;
  }

  // Custom application error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // Fallback error
  res.status(500).json({ message: "Internal server error" });
});

export default app;
