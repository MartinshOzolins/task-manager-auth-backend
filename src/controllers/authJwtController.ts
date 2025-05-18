import { Request, Response } from "express";

// helpers
import { validatePasswordAndEmail } from "../utils/validators.js";
import {
  attachJWTCookie,
  hashPassword,
  signToken,
  comparePassword,
} from "../utils/auth.js";
import { catchAsync } from "../utils/catchAsync.js";

// prisma client
import prisma from "../prismaClient.js";

// registers and returns JWT
export const register = catchAsync(async function (
  req: Request,
  res: Response
) {
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

  // creates jwt
  const token = await signToken(user.userId);

  // attahes jwt as a cookie
  attachJWTCookie(res, token as string);

  // returns success message
  res.json("Registration succesful");
});

// logins and returns JWT
export const login = catchAsync(async function (req: Request, res: Response) {
  // retrieves inputs
  const { email, password } = req.body;

  // validates inputs
  validatePasswordAndEmail({ email, password });

  // retrieves user from database
  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user)
    throw new Error("Invalid credentials, incorrect password or email");

  // compares passwords
  await comparePassword(password, user.password);

  // if password matches
  // creates jwt
  const token = await signToken(user.password);

  // attahes jwt as a cookie
  attachJWTCookie(res, token as string);

  // returns success message
  res.json("Login succesful");
});
