import express from "express";

import { login, register } from "../controllers/authJwtController.js";

const router = express.Router();

export { router };

router.post("/login", login);

router.post("/register", register);
