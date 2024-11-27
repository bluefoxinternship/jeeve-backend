import express from "express";
import { isAdmin } from "../middlewares/AuthMiddleware.js"; // Admin authorization middleware
import brandController from "../controllers/brandController.js";

const router = express.Router();

// Public Routes
router.get("/brands", brandController.getAllBrands); // Get all brands
router.get("/brands/brand_of_the_week", brandController.brandOfTheWeek); // Get Brand of the Week
router.get("/brands/:id", brandController.getBrandById); // Get a single brand by ID

// Admin-Only Routes
router.post("/brands", isAdmin, brandController.createBrand); // Create a new brand
router.put("/brands/:id", isAdmin, brandController.updateBrand); // Update brand details
router.delete("/brands/:id", isAdmin, brandController.deleteBrand); // Delete a brand

export default router;
