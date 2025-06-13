import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "./handlers/product";
import { body } from "express-validator";
import { handleInputErrors } from "./middleware/inputValidator";
import { changeUpdate } from "./handlers/update";
import {
  postProductValidators,
  postUpdatePointValidators,
  putProductValidators,
  putUpdatePointValidators,
  putUpdateValidators,
} from "./modules/validator";

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

router.get("/update", (req, res) => {});

router.get("/update/:id", (req, res) => {});

router.post("/update", (req, res) => {});

router.put(
  "/update/:id",
  ...putUpdateValidators,
  handleInputErrors,
  changeUpdate
);

router.delete("/update/:id", (req, res) => {});

/**
 * UpdatePoint
 */

router.get("/updatepoint", (req, res) => {});

router.get("/updatepoint/:id", (req, res) => {});

router.post("/updatepoint", ...postUpdatePointValidators, (req, res) => {});

router.put("/updatepoint/:id", ...putUpdatePointValidators, (req, res) => {});

router.delete("/updatepoint/:id", (req, res) => {});

export default router;
