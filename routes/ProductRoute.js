import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getAllProducts,
} from "../controllers/ProductController.js";
import upload from "../middlewares/multer.js";
import cloudinary from "../config/cloudinaryConfig.js";
import {
  productIdValidation,
  productValidationRules,
} from "../validation/ProductValidation.js";
import validateRequest from "../middlewares/ValidateRequest.js";

const router = Router();

router.get("/all_products", getAllProducts)

// Product creation route
router.post(
  "/create_product",
  upload.single("productImage"),
  productValidationRules,
  validateRequest,
  createProduct
);

//edit product
router.put(
  "/update_product/:id",
  upload.single("productImage"),
  [...productValidationRules, ...productIdValidation],
  validateRequest,
  editProduct
);

//delete product
router.delete(
  "/delete_product/:id",
  productIdValidation,
  validateRequest,
  deleteProduct
);



export default router;
