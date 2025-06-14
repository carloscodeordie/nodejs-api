import { Request, Response, NextFunction } from "express";
import { CustomError } from "../models/customError";
import { CustomErrorEnum } from "../models/ErrorEnum";

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  switch (err.type) {
    case CustomErrorEnum.AUTH:
      res.status(401);
      res.json({
        message: "Unauthorized",
      });
      break;
    case CustomErrorEnum.INPUT:
      res.status(400);
      res.json({
        message: "Invalid inputs",
      });
      break;
    case CustomErrorEnum.PRISMA:
      res.status(500);
      res.json({
        message: "Invalid database statement",
      });
      break;
    default:
      res.status(500);
      res.json({
        message: "An error occurs",
      });
      break;
  }
  next();
};
