import { Request, Response } from "express";
import {
  comparePassword,
  hashPassword,
  signToken,
  validatePasswordAndEmail,
} from "../utils/helpers.js";

import prisma from "../prismaClient.js";

export async function register(req: Request, res: Response) {
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
  const token = signToken(user.userId);

  // attaches jwt cookie
  res.cookie("jwt", token);

  res.json("Registration succesful");
  // returns success message
}

export async function login(req: Request, res: Response) {
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
  const token = signToken(user.password);

  // attaches jwt cookie
  res.cookie("jwt", token);

  res.json("Login succesful");
}
