import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { User } from "../models/user";

export const createJWT = (user: User) => {
  const secret = process.env.JWT_SECRET as jwt.Secret;
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    secret
  );
};

export const comparePasswords = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 5);
};
