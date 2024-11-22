import { body } from 'express-validator';

export const registerValidation = [
  body('mobile', 'Mobile number is required').notEmpty(),
  body('mobile', 'Invalid mobile number').isMobilePhone(),
  body('date_of_birth', 'Date of birth is required').notEmpty(),
  body('date_of_birth', 'Invalid date of birth').isDate(),
  body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
  body('confirm_password', 'Confirm password is required').notEmpty(),
  body('confirm_password', 'Passwords must match').custom((value, { req }) => value === req.body.password),
];

export const loginValidation = [
  body('mobile', 'Mobile number is required').notEmpty(),
  body('password', 'Password is required').notEmpty(),
];
