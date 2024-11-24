import express from 'express';
import categoryController from '../controllers/Categories.js';
import { 
  validateCategory, 
  validateEditCategory, 
  validateSubcategory, 
  validateDeleteCategory,
  errorHandler 
} from '../validation/CategoryValidation.js';

const router = express.Router();

// Get all main categories
router.get('/all-category', categoryController.getAllCategory);

// Get subcategories of a specific category
router.get('/subcategories/:parentCategoryId', validateSubcategory, categoryController.getSubcategories);

// Add category (main or subcategory)
router.post('/add-category', validateCategory, categoryController.postAddCategory);

// Edit category
router.put('/edit-category/:cId', validateEditCategory, categoryController.putEditCategory);

// Delete category
router.delete('/delete-category/:cId', validateDeleteCategory, categoryController.deleteCategory);  // Updated route

// Apply error handling middleware
router.use(errorHandler);

export default router;
