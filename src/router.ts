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
  postProductValidators,
  postUpdatePointValidators,
  putProductValidators,
  putUpdatePointValidators,
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
// TODO: Add validators
router.post("/update", createUpdate);
router.put(
  "/update/:id",
  ...putUpdateValidators,
  handleInputErrors,
  updateUpdate
);
router.delete("/update/:id", deleteUpdate);

/**
 * UpdatePoint
 */

router.get("/updatepoint", (req, res) => {});

router.get("/updatepoint/:id", (req, res) => {});

router.post("/updatepoint", ...postUpdatePointValidators, (req, res) => {});

router.put("/updatepoint/:id", ...putUpdatePointValidators, (req, res) => {});

router.delete("/updatepoint/:id", (req, res) => {});

export default router;
