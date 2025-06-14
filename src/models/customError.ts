import { CustomErrorEnum } from "./ErrorEnum";

export class CustomError extends Error {
  type?: CustomErrorEnum;

  constructor(message: string, type?: CustomErrorEnum) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
    Error.captureStackTrace(this, this.constructor);
  }
}
