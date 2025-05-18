import validator from "validator";
import AppError from "./appError.js";

// validates user details
export function validatePasswordAndEmail({
  password,
  email,
}: {
  password: string;
  email: string;
}) {
  // checks if password and email provided
  if (validator.isEmpty(password) || validator.isEmpty(email)) {
    throw new AppError("Please provide both password and email!", 400);
  }

  // checks if email is of email type
  if (!validator.isEmail(email)) {
    throw new AppError("Please provide a valid email address!", 400);
  }
}

// checks if password is strong enough
export function isPasswordStrong(password: string) {
  if (!validator.isStrongPassword(password)) {
    throw new AppError("Password is not strong enough!", 400);
  }
}

// validates todo details
export function validateNewTodo({ description }: { description: string }) {
  // checks if todo is not empty and if is, throws an error
  if (validator.isEmpty(description)) {
    throw new AppError("Please provide a todo description!", 400);
  }
}
