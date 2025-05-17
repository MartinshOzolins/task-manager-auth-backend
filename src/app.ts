import express from "express";
import dotenv from "dotenv";

// Loads env variables into process.env
dotenv.config();

// Middlewares
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";

// Routers
import { router as authJwtRouter } from "./routes/authJwtRouter.js";
import { router as authSessionRouter } from "./routes/authSessionRouter.js";
import { router as taskRouter } from "./routes/taskRouter.js";

// Creates express app instance
const app = express();

// Middlewares configuration
app.use(express.json());
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "strict",
      secure: false,
    },
  })
);

// Routers
app.use("/api/auth/jwt", authJwtRouter);
app.use("/api/auth/session", authSessionRouter);
app.use("/api/tasks", taskRouter);

export default app;
