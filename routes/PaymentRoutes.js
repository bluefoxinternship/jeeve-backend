import { Router } from 'express';
import { 
  initiatePayment, 
  verifyEsewaPayment, 
  processCardPayment,
  getPaymentStatus 
} from '../controllers/PaymentController.js';
import { paymentValidation, cardPaymentValidation } from '../validation/PaymentValidation.js';
import { user } from '../middlewares/AuthMiddleware.js';
import validateRequest from '../middlewares/ValidateRequest.js';
import rateLimit from 'express-rate-limit';

const router = Router();

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many payment attempts from this IP'
});

router.post('/initiate', user, paymentValidation, validateRequest, paymentLimiter, initiatePayment);
router.get('/esewa/verify', verifyEsewaPayment);
router.post('/card/process', user, cardPaymentValidation, validateRequest, paymentLimiter, processCardPayment);
router.get('/status/:paymentId', user, getPaymentStatus);

export default router;