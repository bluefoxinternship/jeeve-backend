import { Router } from 'express';
import { 
  initiatePayment, 
  verifyEsewaPayment, 
  processCardPayment,
  getPaymentStatus 
} from '../controllers/PaymentController.js';
import { paymentValidation } from '../validation/PaymentValidation.js';
import validateRequest from '../middlewares/ValidateRequest.js';
import { isUser } from '../middlewares/AuthMiddleware.js';

const router = Router();

// Payment routes
router.post('/initiate', isUser, paymentValidation, validateRequest, initiatePayment);
router.get('/esewa/verify', verifyEsewaPayment);
router.post('/card/process', isUser, processCardPayment);
router.get('/status/:paymentId', isUser, getPaymentStatus);

export default router;