import express from "express";
import { login, register } from "../controllers/authSessionController.js";

const router = express.Router();

export { router };

router.post("/register", register);

router.post("/login", login);
