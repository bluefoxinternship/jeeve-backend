import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
} from "../controllers/ProductController.js";
import upload from "../middlewares/multer.js";
import {
  productIdValidation,
  productValidationRules,
} from "../validation/ProductValidation.js";
import validateRequest from "../middlewares/ValidateRequest.js";
import { isAdmin } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.get("/all_products", getAllProducts)

router.get("/product_by_id/:id", getProductById)

// Product creation route
router.post(
  "/create_product",
  isAdmin,
  upload.single("productImage"),
  productValidationRules,
  validateRequest,
  createProduct
);

//edit product
router.put(
  "/update_product/:id",
  isAdmin,
  upload.single("productImage"),
  [...productValidationRules, ...productIdValidation],
  validateRequest,
  editProduct
);

//delete product
router.delete(
  "/delete_product/:id",
  isAdmin,
  productIdValidation,
  validateRequest,
  deleteProduct
);


router.get("/products/category/:categoryId", getProductsByCategory);


export default router;
