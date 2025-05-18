import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Request, Response } from "express";

// hashes the password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = parseInt(process.env.SALT_ROUNDS as string);
  return await bcrypt.hash(password, saltRounds);
}

// compares provided password with the stored one
export async function comparePassword(
  currentPassword: string,
  storedPassword: string
): Promise<void> {
  const isMatch = await bcrypt.compare(currentPassword, storedPassword);
  if (!isMatch) throw new Error("Incorrect credentials");
}

// creates a JWT
export async function signToken(userId: string) {
  return await new Promise((resolve, reject) => {
    jwt.sign(
      { userId: userId },
      `${process.env.JWT_SECRET}`,
      { expiresIn: "2d" },
      // callback function
      (err, token) => {
        if (err) throw new Error("JWT sign error");
        // resolves with token
        else resolve(token);
      }
    );
  });
}

// verifies a JWT
export async function verifyToken(token: string) {
  return await new Promise((resolve, reject) => {
    jwt.verify(
      token,
      `${process.env.JWT_SECRET}`,
      // callback function
      (err, decoded) => {
        if (err) throw new Error("JWT verify error");
        // resolves with decoded token
        else resolve(decoded);
      }
    );
  });
}

// attaches a JWT cookie to headers
export function attachJWTCookie(res: Response, token: string) {
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "strict",
    //secure: true, // only for production
  });
}

export function checkJWTCookie(req: Request) {
  const token = req.cookies.jwt || undefined;

  if (!token) throw new Error("JWT cookie absent");

  return token;
}
