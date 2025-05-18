import validator from "validator";

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
