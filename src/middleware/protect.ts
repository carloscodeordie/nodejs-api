import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const sendNotAuthorizedResponse = (res: Response) => {
  res.status(401);
  res.send("Not authorized");
};

export const protectMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    sendNotAuthorizedResponse(res);
    return;
  }

  const [, token] = bearer.split(" ");
  if (!token) {
    sendNotAuthorizedResponse(res);
    return;
  }

  try {
    const secret = process.env.JWT_SECRET as jwt.Secret;
    const payload = jwt.verify(token, secret);

    // @ts-ignore
    req.user = payload;
    next();
  } catch (error: unknown) {
    console.error(error);
    sendNotAuthorizedResponse(res);
    return;
  }
};
