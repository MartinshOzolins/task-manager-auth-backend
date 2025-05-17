import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
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
  console.log(currentPassword, storedPassword);
  console.log(isMatch);
  if (!isMatch)
    throw new Error("Invalid credentials, incorrect password or email");
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
        if (err) throw new Error("Something went wrong, please try again!");
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
        if (err) throw new Error("Something went wrong, please login!");
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
    sameSite: "strict",
    //secure: true, // only for production
  });
}

// validates user details
export function validatePasswordAndEmail({
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
// validates todo details
export function validateNewTodo({ description }: { description: string }) {
  // checks if todo is not empty and if is, throws an error
  if (validator.isEmpty(description)) {
    throw new Error("Please submit todo description");
  }
}
