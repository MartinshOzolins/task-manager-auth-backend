import prisma from "../prismaClient.js";
import { catchAsync } from "../utils/catchAsync.js";
import { hashPassword, validatePasswordAndEmail } from "../utils/helpers.js";
import { Request, Response } from "express";

export const register = catchAsync(async function (
  req: Request,
  res: Response
) {
  const users = await prisma.user.findMany();
  console.log(users);
  // retrieves inputs
  const { email, password } = req.body;

  // validates inputs
  validatePasswordAndEmail({ email, password });

  // hashes password
  const hashedPassword = await hashPassword(password);

  // stores user into db
  const user = await prisma.user.create({
    data: { email: email, password: hashedPassword },
  });
  // creates session id and attaches session id to headers
  req.session.userId = user.userId;
  console.log(req.session);
  // returns success message
  res.json("Registration succesful");
  // stores session id into db
  // returns success message
});

export const login = catchAsync(async function (req: Request, res: Response) {
  // validates inputs
  // hashes password
  // creates user
  // creates session id
  // attaches session id to headers
  // stores session id into db
  // returns success message
});
