import { catchAsync } from "../utils/catchAsync.js";
import { Request, Response } from "express";
import { validateNewTodo, verifyToken } from "../utils/helpers.js";
import prisma from "../prismaClient.js";

export const getAllTodos = catchAsync(async function (
  req: Request,
  res: Response
) {
  // const users = await prisma.todo.findMany();
  // console.log(users);

  // checks for jwt
  const token = req.cookies.jwt || undefined;

  if (!token) throw new Error("Please login or register!");

  // verifies jwt
  const decoded: any = await verifyToken(token);

  // fetches tasks for specific user based on id
  const todos = await prisma.todo.findMany({
    where: { userId: decoded.userId },
    select: { description: true },
  });

  if (todos.length === 0) {
    return res.json("No todos found!");
  }
  // returns todos
  res.json(todos);
});

export const getSingleTodo = catchAsync(async function (
  req: Request,
  res: Response
) {
  // checks for jwt
  const token = req.cookies.jwt || undefined;

  if (!token) throw new Error("Please login or register!");

  // verifies jwt
  const decoded: any = await verifyToken(token);

  // fetches a task for specific user based on id
  const todo = await prisma.todo.findUnique({
    where: { todoId: req.params.id, userId: decoded.userId },
    select: { description: true },
  });

  if (!todo) {
    return res.json("Such todo not found!");
  }

  // returns todo
  res.json(todo);
});

export const createTodo = catchAsync(async function (
  req: Request,
  res: Response
) {
  const description: string = req.body.description ?? "";
  // validates input
  validateNewTodo({ description: description });

  // checks for jwt
  const token = req.cookies.jwt || undefined;

  if (!token) throw new Error("Please login or register!");

  // verifies jwt
  const decoded: any = await verifyToken(token);

  // creates task
  const todo = await prisma.todo.create({
    data: { description: description, userId: decoded.userId },
  });

  // returns new todo
  res.json(todo);
});

export const updateTodo = catchAsync(async function (
  req: Request,
  res: Response
) {
  const description: string = req.body.description ?? "";
  // validates input
  validateNewTodo({ description: description });

  // checks for jwt
  const token = req.cookies.jwt || undefined;

  if (!token) throw new Error("Please login or register!");

  // verifies jwt
  const decoded: any = await verifyToken(token);
  console.log(req.params.id, decoded.userId);
  // updates a task
  const todo = await prisma.todo.update({
    where: { todoId: req.params.id, userId: decoded.userId },
    data: { description: description },
  });

  // returns a updated todo
  res.json(todo);
});

export const deleteTodo = catchAsync(async function (
  req: Request,
  res: Response
) {
  // checks for jwt
  const token = req.cookies.jwt || undefined;

  // throws an error if not found
  if (!token) throw new Error("Please login or register!");

  // verifies jwt
  const decoded: any = await verifyToken(token);

  // deletes task based on its id
  const todo = await prisma.todo.delete({
    where: { todoId: req.params.id, userId: decoded.userId },
  });

  if (!todo) {
    return res.json("Such todo not found!");
  }

  // returns todo
  res.json("Todo deleted successfully");
});
