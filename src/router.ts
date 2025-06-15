import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "./handlers/product";
import { handleInputErrors } from "./middleware/inputValidator";
import {
  createUpdateValidators,
  postProductValidators,
  putProductValidators,
  putUpdateValidators,
} from "./modules/validator";
import {
  createUpdate,
  deleteUpdate,
  getUpdate,
  getUpdates,
  updateUpdate,
} from "./handlers/update";

const router = Router();

/**
 * API - Products
 * Methods: Allows to get all, get by id, create, update and delete a product
 */
router.get("/product", getProducts);
router.get("/product/:id", getProduct);
router.post(
  "/product",
  ...postProductValidators,
  handleInputErrors,
  createProduct
);
router.put(
  "/product/:id",
  ...putProductValidators,
  handleInputErrors,
  updateProduct
);
router.delete("/product/:id", deleteProduct);

/**
 * Update
 */
router.get("/update", getUpdates);
router.get("/update/:id", getUpdate);
router.post("/update", ...createUpdateValidators, createUpdate);
router.put(
  "/update/:id",
  ...putUpdateValidators,
  handleInputErrors,
  updateUpdate
);
router.delete("/update/:id", deleteUpdate);

export default router;
