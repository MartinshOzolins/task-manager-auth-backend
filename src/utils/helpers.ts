import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  if (match) return match;
  else throw new Error("Invalid credentials, incorrect password or email");
}

export async function signToken(userId: string) {
  const token = await new Promise((resolve, reject) => {
    jwt.sign(
      { userId: userId },
      `${process.env.JWT_SECRET}`,
      { expiresIn: "2d" },
      // callback function
      (err, token) => {
        if (err) return reject(err);
        else resolve(token);
      }
    );
  });
  return token;
}

export async function verifyToken(token: string) {
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(
      token,
      `${process.env.JWT_SECRET}`,
      // callback function
      (err, decoded) => {
        if (err) return reject(err);
        else resolve(decoded);
      }
    );
  });
  return decoded;
}
