import express from 'express';
import categoryController from '../controllers/Categories.js';
import { validateCategory, validateSubcategory, errorHandler } from '../middlewares/CategoryMiddleware.js';

const router = express.Router();

// Apply logger middleware globally for all category routes


// Define the routes

// Get all main categories (without subcategories)
router.get('/all-category', categoryController.getAllCategory);

// Get subcategories of a specific category
router.get('/subcategories/:parentCategoryId', validateSubcategory, categoryController.getSubcategories);

// Add category (main or subcategory) with validation
router.post('/add-category', validateCategory, categoryController.postAddCategory);

// Edit category (main or subcategory) with validation
router.post('/edit-category', validateCategory, categoryController.postEditCategory);

// Delete category (main or subcategory) without validation
router.post('/delete-category', categoryController.getDeleteCategory);

// Apply error handling middleware globally (after all routes)
router.use(errorHandler);

export default router;
