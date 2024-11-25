import { body, param, validationResult } from 'express-validator';

// Validation for user registration
export const validateRegister = [
  body('mobile')
    .notEmpty().withMessage('Mobile number is required')
    .isMobilePhone().withMessage('Invalid mobile number'),
  body('date_of_birth')
    .notEmpty().withMessage('Date of birth is required')
    .isDate().withMessage('Invalid date format'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirm_password')
    .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')
];

// Validation for user login
export const validateLogin = [
  body('mobile')
    .notEmpty().withMessage('Mobile number is required')
    .isMobilePhone().withMessage('Invalid mobile number'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

// Validation for updating user profile
export const validateUpdateProfile = [
  body('first_name').optional().isString().withMessage('First name must be a string'),
  body('middle_name').optional().isString().withMessage('Middle name must be a string'),
  body('last_name').optional().isString().withMessage('Last name must be a string'),
  body('date_of_birth').optional().isDate().withMessage('Invalid date of birth format'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
];

// Validation for changing password
export const validateChangePassword = [
  body('current_password')
    .notEmpty().withMessage('Current password is required'),
  body('new_password')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirm_password')
    .custom((value, { req }) => value === req.body.new_password).withMessage('Passwords do not match'),
];

// Validation for adding address
export const validateAddAddress = [
  body('address_label')
    .notEmpty().withMessage('Address Line 1 is required'),
  body('city')
    .notEmpty().withMessage('City is required'),
  body('state')
    .notEmpty().withMessage('State is required'),
  body('country')
    .notEmpty().withMessage('Country is required'),
];




// Validation for viewing shipment details (typically no validation needed)
export const validateShipmentDetails = [];

// Helper function for centralized validation results
export const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};
