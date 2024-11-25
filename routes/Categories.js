import express from 'express';
import categoryController from '../controllers/Categories.js';
import {
  validateCategory,
  validateEditCategory,
  validateSubcategory,
  validateDeleteCategory,
  errorHandler,
} from '../validation/CategoryValidation.js';
import { isAdmin } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Get all main categories
router.get('/categories',  categoryController.getAllCategory);

// Get subcategories of a specific category
router.get('/categories/:parentCategoryId/subcategories', validateSubcategory, categoryController.getSubcategories);

// Get all nested categories
router.get('/categories/nested', categoryController.getNestedCategories);

// Add category
router.post('/categories', isAdmin, validateCategory, categoryController.postAddCategory);

// Edit category
router.put('/categories/:cId', isAdmin, validateEditCategory, categoryController.putEditCategory);

// Delete category
router.delete('/categories/:cId', isAdmin, validateDeleteCategory, categoryController.deleteCategory);

// Apply error handling middleware
router.use(errorHandler);

export default router;
