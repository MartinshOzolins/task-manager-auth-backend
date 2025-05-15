import express from "express";

const router = express.Router();

export { router };

router.get("/", (req, res) => {
  res.json("Hello World");
});
