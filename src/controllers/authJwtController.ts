import { Request, Response } from "express";
import { signToken } from "../utils/helpers.js";

export async function register(req: Request, res: Response) {
  // retrieve inputs
  const data = req.body;
  const email = data.email || "";
  const password = data.password || "";

  // validate inputs
  if (!email || !password) {
    throw new Error("Please provide password and email");
  }
  // create jwt
  const token = signToken("123");

  // attach jwt cookie
  res.cookie("jwt", token);

  res.json("Registration succesful");
  // return success message
}

export async function login() {}
