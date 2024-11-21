import { Router } from 'express';
import AuthController from '../controllers/AuthController.js'; // Use import for controllers
import { registerValidation, loginValidation } from '../validation/UserValidation.js'; // Use import for validation functions
import validateRequest from '../middlewares/ValidateRquest.js'; // Use import for middleware

const router = Router();
router.post('/register', registerValidation, validateRequest, AuthController.register);
router.post('/login', loginValidation, validateRequest, AuthController.login);

export default router;
