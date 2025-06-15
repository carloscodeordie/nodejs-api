import { body } from "express-validator";

export const putProductValidators = [body("name").isString()];

export const postProductValidators = [body("name").isString()];

export const createUpdateValidators = [
  body("productId").isString(),
  body("title").isString(),
  body("body").isString(),
  body("updatedAt").isString(),
  body("asset").isString(),
];

export const putUpdateValidators = [
  body("title").optional(),
  body("body").optional(),
  body("title").optional(),
  body("status")
    .isIn(["IN_PROGRESS", "LIVE", "DEPRECATED", "ARCHIVED"])
    .optional(),
  body("version").optional(),
  body("productId").optional(),
];
