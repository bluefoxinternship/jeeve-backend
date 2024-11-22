import { Router } from 'express';
import { register, login } from '../controllers/AuthController.js'; 
import { registerValidation, loginValidation } from '../validation/UserValidation.js'; 
import validateRequest from '../middlewares/ValidateRequest.js'; 

const router = Router();
router.post('/api/v1/register', registerValidation, validateRequest, register); 
router.post('/api/v1/login', loginValidation, validateRequest, login); 

export default router;
