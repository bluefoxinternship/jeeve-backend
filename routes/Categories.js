import express from 'express';
import categoryController from '../controllers/Categories.js';
import {
  validateCategory,
  validateEditCategory,
  validateSubcategory,
  validateDeleteCategory,
  errorHandler
} from '../validation/Categoryvalidation.js';
import upload from '../middlewares/multer.js';  // Import multer middleware

const router = express.Router();

// Get all main categories
router.get('/all-category', categoryController.getAllCategory);

// Get subcategories of a specific category
router.get('/subcategories/:parentCategoryId', validateSubcategory, categoryController.getSubcategories);

// Add category (main or subcategory)
router.post('/add-category', upload.single('cImage'), validateCategory, categoryController.postAddCategory);

// Edit category
router.put('/edit-category/:cId', upload.single('cImage'), validateEditCategory, categoryController.putEditCategory);

// Delete category
router.delete('/delete-category/:cId', validateDeleteCategory, categoryController.deleteCategory);

// Apply error handling middleware
router.use(errorHandler);

export default router;
