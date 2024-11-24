import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Helper function to check if string is valid MongoDB ObjectId
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// Validation for adding a new category
const validateCategory = [
  body('cName')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),
  
  body('cDescription')
    .trim()
    .notEmpty().withMessage('Category description is required')
    .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  
  // body('cStatus')
  //   .trim()
  //   .notEmpty().withMessage('Status is required')
  //   .isIn(['active', 'inactive']).withMessage('Status must be either active or inactive'),
  
  body('parentCategory')
    .optional({ nullable: true })
    .custom(value => {
      if (value && !isValidObjectId(value)) {
        throw new Error('Invalid parent category ID format');
      }
      return true;
    }),

  validateResults
];

// Specific validation for editing a category
const validateEditCategory = [
  body('cId')
    .notEmpty().withMessage('Category ID is required')
    .custom(value => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid category ID format');
      }
      return true;
    }),

  body('cName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),
  
  body('cDescription')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  
  body('cStatus')
    .optional()
    .trim()
    .isIn(['active', 'inactive']).withMessage('Status must be either active or inactive'),
  
  body('parentCategory')
    .optional({ nullable: true })
    .custom(value => {
      if (value && !isValidObjectId(value)) {
        throw new Error('Invalid parent category ID format');
      }
      return true;
    }),

  validateResults
];

// Validation for getting subcategories
const validateSubcategory = [
  param('parentCategoryId')
    .notEmpty().withMessage('Parent category ID is required')
    .custom(value => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid parent category ID format');
      }
      return true;
    }),

  validateResults
];

// Validation for deleting a category
const validateDeleteCategory = [
  param('cId')
    .notEmpty().withMessage('Category ID is required')
    .custom(value => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid category ID format');
      }
      return true;
    }),

  validateResults
];

// Helper function to validate results
function validateResults(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg
      }))
    });
  }
  next();
}

// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(error => ({
        field: error.path,
        message: error.message
      }))
    });
  }

  // Handle mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      error: `Invalid ${err.path}: ${err.value}`
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate Entry',
      error: `${Object.keys(err.keyValue)} already exists`
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

export { 
  validateCategory, 
  validateEditCategory, 
  validateSubcategory, 
  validateDeleteCategory,
  errorHandler 
};