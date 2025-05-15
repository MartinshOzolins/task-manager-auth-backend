import express from "express";

// Middlewares
import morgan from "morgan";

// Routers
import { router as authJwtRouter } from "./routes/authJwtRouter.js";
import { router as authSessionRouter } from "./routes/authSessionRouter.js";
import { router as taskRouter } from "./routes/taskRouter.js";

// Creates express app instance
const app = express();

// Middlewares configuration
app.use(express.json());
app.use(morgan("tiny"));

// Routers
app.use("/api/auth/jwt", authJwtRouter);
app.use("/api/auth/session", authSessionRouter);
app.use("/api/tasks", taskRouter);

export default app;
