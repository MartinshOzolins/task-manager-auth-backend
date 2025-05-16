import bcrypt from "bcrypt";
import {
  JsonWebTokenError,
  Jwt,
  JwtHeader,
  JwtPayload,
  sign,
  verify,
} from "jsonwebtoken";

const saltRounds = 10;

// hashed password
export async function hashPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// compares password with stored one
export async function comparePassword(
  currentPassword: string,
  storedPassword: string
) {
  const match = await bcrypt.compare(currentPassword, storedPassword);
}
