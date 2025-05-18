import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Request, Response } from "express";
import AppError from "./appError.js";

// hashes the password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = parseInt((process.env.SALT_ROUNDS as string) || "10");
  return await bcrypt.hash(password, saltRounds);
}

// compares provided password with the stored one
export async function comparePassword(
  currentPassword: string,
  storedPassword: string
): Promise<void> {
  const isMatch = await bcrypt.compare(currentPassword, storedPassword);
  if (!isMatch)
    throw new AppError(
      "Invalid credentials: incorrect password or/and email!",
      401
    );
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
        if (err) reject(new AppError("Error occurred while signing JWT", 500));
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
        if (err)
          reject(
            new AppError(
              "Error occurred while verifying JWT. Please login again!",
              401
            )
          );
        // resolves with decoded token
        else resolve(decoded);
      }
    );
  });
}

// attaches a JWT cookie to headers
export function attachJWTCookie(res: Response, token: string) {
  const secure = process.env.NODE_ENV === "production" ? true : false;
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "strict",
    secure,
  });
}

export function checkJWTCookie(req: Request): string {
  const token = req.cookies.jwt || undefined;

  if (!token) throw new AppError("Please login again or register!", 401);

  return token;
}
