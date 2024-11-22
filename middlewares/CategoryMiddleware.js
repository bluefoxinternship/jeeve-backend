import { body, validationResult, param } from 'express-validator';

// Validation rules for adding or editing a category
const validateCategory = [
  body('cName').notEmpty().withMessage('Category name is required'),
  body('cStatus')
    .isIn(['active', 'inactive'])
    .withMessage('Category status must be either active or inactive'),
  body('cDescription')
    .notEmpty()
    .withMessage('Category description is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for subcategories
const validateSubcategory = [
  body('cName').notEmpty().withMessage('Subcategory name is required'),
  body('cStatus')
    .isIn(['active', 'inactive'])
    .withMessage('Subcategory status must be either active or inactive'),
  body('parentCategoryId')
    .notEmpty()
    .withMessage('Parent category ID is required')
    .isMongoId()
    .withMessage('Invalid parent category ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
//error handling
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
    });
  };
  

export { validateCategory, validateSubcategory, errorHandler };
