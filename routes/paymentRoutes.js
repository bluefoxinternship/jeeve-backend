import express from "express";
import { body } from 'express-validator';
import { user } from '../middlewares/AuthMiddleware.js';
import validateRequest from '../middlewares/ValidateRequest.js';
import {
    cashOnDelivery,
    esewaPayment,
    esewaSuccess,
    esewaFailure,
    stripePayment,
} from "../controllers/paymentController.js";

const router = express.Router();

// Validation schemas using express-validator
const paymentValidation = {
    cod: [
        body('orderId').isString().notEmpty().withMessage('Order ID is required')
    ],
    esewa: [
        body('orderId').isString().notEmpty().withMessage('Order ID is required')
    ],
    stripe: [
        body('orderId').isString().notEmpty().withMessage('Order ID is required'),
        body('paymentMethodId').isString().notEmpty().withMessage('Payment method ID is required')
    ]
};

// added authentication
router.post("/payment/cod", user, validateRequest(paymentValidation.cod), cashOnDelivery);
router.post("/payment/esewa", user, validateRequest(paymentValidation.esewa), esewaPayment);
router.post("/payment/stripe", user, validateRequest(paymentValidation.stripe), stripePayment);

// Public callback routes - no authentication needed
router.get("/payment/esewa/success", esewaSuccess);
router.get("/payment/esewa/failure", esewaFailure);

export default router;