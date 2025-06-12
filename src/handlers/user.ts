import { Request, Response } from "express";
import * as prisma from "../modules/db";
import { sendNotAuthorizedResponse } from "../middleware/protect";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

export const createUser = async (req: Request, res: Response) => {
  // @ts-ignore
  const password = req.body?.password;

  if (!password) {
    sendNotAuthorizedResponse(res);
  }

  // Hash the password
  const hashedPassword = await hashPassword(req.body.password);

  // Save the password on database
  const user = await prisma.default.user.create({
    data: {
      username: req.body.username,
      password: hashedPassword,
    },
  });
  const token = createJWT(user);

  res.json({
    token,
  });
};

export const signin = async (req: Request, res: Response) => {
  const user = await prisma.default.user.findUnique({
    where: {
      username: req.body.username,
    },
  });

  if (!user) {
    sendNotAuthorizedResponse(res);
    return;
  }

  const isUserValid = await comparePasswords(req.body.password, user.password);

  if (!isUserValid) {
    res.status(401);
    res.send("Invalid username or password");
    return;
  }

  const token = createJWT(user);
  res.json({
    token,
  });
};
