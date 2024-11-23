import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16'
});

const esewaPaymentConfig = {
    apiUrl: process.env.NODE_ENV === 'production' 
        ? 'https://esewa.com.np' 
        : 'https://uat.esewa.com.np',
    merchantCode: process.env.ESEWA_MERCHANT_CODE,
    successUrl: `${process.env.BASE_URL}/api/payment/esewa/success`,
    failureUrl: `${process.env.BASE_URL}/api/payment/esewa/failure`,
};

const stripePaymentConfig = {
    stripeClient: stripe,
    currency: 'USD',
    successUrl: `${process.env.BASE_URL}/payment/success`,
    cancelUrl: `${process.env.BASE_URL}/payment/cancel`,
};

const codPaymentConfig = {
    method: 'Cash on Delivery',
    allowedStatuses: ['pending', 'confirmed']
};

const PAYMENT_METHODS = {
    COD: 'COD',
    ESEWA: 'ESEWA',
    STRIPE: 'STRIPE'
};

const PAYMENT_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    CANCELLED: 'cancelled'
};

export { 
    esewaPaymentConfig, 
    stripePaymentConfig, 
    codPaymentConfig,
    PAYMENT_METHODS,
    PAYMENT_STATUS
};