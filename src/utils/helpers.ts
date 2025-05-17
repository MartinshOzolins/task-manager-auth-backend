import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

import { Response } from "express";

const saltRounds = 10;

// hashed password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

// compares password with stored one
export async function comparePassword(
  currentPassword: string,
  storedPassword: string
): Promise<void> {
  const isMatch = await bcrypt.compare(currentPassword, storedPassword);
  if (!isMatch) new Error("Invalid credentials, incorrect password or email");
}

// creates JWT
export async function signToken(userId: string) {
  return await new Promise((resolve, reject) => {
    jwt.sign(
      { userId: userId },
      `${process.env.JWT_SECRET}`,
      { expiresIn: "2d" },
      // callback function
      (err, token) => {
        if (err) return reject(err);
        // resolves with token
        else resolve(token);
      }
    );
  });
}

// verifies JWT
export async function verifyToken(token: string) {
  return await new Promise((resolve, reject) => {
    jwt.verify(
      token,
      `${process.env.JWT_SECRET}`,
      // callback function
      (err, decoded) => {
        if (err)
          if (err) return reject(err);
          // resolves with decoded token
          else resolve(decoded);
      }
    );
  });
}

// attaches JWT to headers
export function attachJWTCookie(res: Response, token: string) {
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    //secure: true, // only for production
  });
}

// validates user details
export async function validatePasswordAndEmail({
  password,
  email,
}: {
  password: string;
  email: string;
}) {
  // checks if password and email exist
  if (validator.isEmpty(password) || validator.isEmpty(email)) {
    throw new Error("Invalid password or/and email");
  }

  // checks if email is of email type
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  //checks if password is strong enough
  // if (!validator.isStrongPassword(password)) {
  //   throw new Error("Password is not strong enough");
  // }
}
