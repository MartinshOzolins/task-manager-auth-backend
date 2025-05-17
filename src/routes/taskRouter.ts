import express from "express";

const router = express.Router();

export { router };

import {
  createTodo,
  getAllTodos,
  getSingleTodo,
  deleteTodo,
  updateTodo,
} from "../controllers/taskController.js";

router.route("/").get(getAllTodos).post(createTodo);

router.route("/:id").get(getSingleTodo).put(updateTodo).delete(deleteTodo);
