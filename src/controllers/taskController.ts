import { Request, Response } from "express";

// helpers
import { catchAsync } from "../utils/catchAsync.js";
import { validateNewTodo } from "../utils/validators.js";
import { checkJWTCookie, verifyToken } from "../utils/auth.js";

// prisma client
import prisma from "../prismaClient.js";
import AppError from "../utils/appError.js";

export const getAllTodos = catchAsync(async function (
  req: Request,
  res: Response
) {
  // const users = await prisma.todo.findMany();
  // console.log(users);

  // checks for jwt cookie existance
  const token = checkJWTCookie(req);

  // verifies jwt cookie
  const decoded: any = await verifyToken(token);

  // fetches tasks for specific user based on id
  const todos = await prisma.todo.findMany({
    where: { userId: decoded.userId },
    select: { description: true, todoId: true },
  });

  if (todos.length === 0) {
    throw new AppError("No todos found!", 404);
  }
  // returns todos
  res.json(todos);
});

export const getSingleTodo = catchAsync(async function (
  req: Request,
  res: Response
) {
  // checks for jwt cookie existance
  const token = checkJWTCookie(req);

  // verifies jwt
  const decoded: any = await verifyToken(token);

  // fetches a task for specific user based on id
  const todo = await prisma.todo.findUnique({
    where: { todoId: req.params.id, userId: decoded.userId },
    select: { description: true, todoId: true },
  });

  if (!todo) {
    throw new AppError("Such todo not found!", 404);
  }

  // returns todo
  res.json(todo);
});

// creates todo
export const createTodo = catchAsync(async function (
  req: Request,
  res: Response
) {
  const description: string = req.body.description ?? "";

  // validates input
  validateNewTodo({ description: description });

  // checks for jwt cookie existance
  const token = checkJWTCookie(req);

  // verifies jwt
  const decoded: any = await verifyToken(token);

  // creates task
  const todo = await prisma.todo.create({
    data: { description: description, userId: decoded.userId },
    select: { todoId: true, description: true },
  });

  // returns the added todo
  res.json(todo);
});

// updates todo
export const updateTodo = catchAsync(async function (
  req: Request,
  res: Response
) {
  const description: string = req.body.description ?? "";
  // validates input
  validateNewTodo({ description: description });

  // checks for jwt cookie existance
  const token = checkJWTCookie(req);

  // verifies jwt
  const decoded: any = await verifyToken(token);

  // updates a task
  const todo = await prisma.todo.update({
    where: { todoId: req.params.id, userId: decoded.userId },
    data: { description: description },
    select: { description: true, todoId: true },
  });

  // returns the updated todo
  res.json(todo);
});

export const deleteTodo = catchAsync(async function (
  req: Request,
  res: Response
) {
  // checks for jwt cookie existance
  const token = checkJWTCookie(req);

  // verifies jwt
  const decoded: any = await verifyToken(token);

  // deletes task based on its id
  const todo = await prisma.todo.delete({
    where: { todoId: req.params.id, userId: decoded.userId },
  });

  if (!todo) {
    throw new AppError("Such todo not found!", 404);
  }

  // returns todo
  res.json({ message: "Todo deleted successfully!" });
});
