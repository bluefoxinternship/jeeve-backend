import { Router } from 'express';
import { register, login } from '../controllers/AuthController.js'; 
import validateRequest from '../middlewares/ValidateRequest.js'; 
import { validateLogin, validateRegister } from '../validation/UserValidation.js';

const router = Router();
router.post('/register', validateRegister, validateRequest, register); 
router.post('/login', validateLogin, validateRequest, login); 

export default router;
