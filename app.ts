import express from "express";

// Middlewares
import morgan from "morgan";

// Creates express app instance
const app = express();

// Middlewares configuration
app.use(morgan("tiny"));

export default app;
