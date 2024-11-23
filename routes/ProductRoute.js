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
  productValidationRules,
  validateRequest,
  createProduct
);

//edit product
router.put(
  "/update_product/:id",
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

// Product image upload route
router.post("/upload_image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "product_images" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });
    return res.status(200).json({
      message: "Image uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error while uploading image",
      error: error.message,
    });
  }
});

export default router;
