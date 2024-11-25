import { Router } from 'express';
import { 
  initiatePayment, 
  verifyEsewaPayment, 
  processCardPayment,
  getPaymentStatus 
} from '../controllers/PaymentController.js';
import { paymentValidation } from '../validation/PaymentValidation.js';
import { user } from '../middlewares/AuthMiddleware.js';
import validateRequest from '../middlewares/ValidateRequest.js';

const router = Router();

// Payment routes
router.post('/initiate', user, paymentValidation, validateRequest, initiatePayment);
router.get('/esewa/verify', verifyEsewaPayment);
router.post('/card/process', user, processCardPayment);
router.get('/status/:paymentId', user, getPaymentStatus);

export default router;