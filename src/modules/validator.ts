import { body } from "express-validator";

export const putProductValidators = [body("name").isString()];

export const postProductValidators = [body("name").isString()];

export const putUpdateValidators = [
  body("title").optional(),
  body("body").optional(),
  body("title").optional(),
  body("status").isIn(["IN_PROGRESS", "LIVE", "DEPRECATED", "ARCHIVED"]),
  body("version").optional(),
  body("productId").optional(),
];

export const postUpdatePointValidators = [
  body("name").isString(),
  body("description").isString(),
  body("updateId").exists().isString(),
];

export const putUpdatePointValidators = [
  body("name").optional().isString(),
  body("description").optional().isString(),
];
