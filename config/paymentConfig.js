import Stripe from 'stripe';

// Dummy Eswa Merchant Code and Test Stripe Secret Key
const ESEWA_MERCHANT_CODE = 'PAYTEST'; 
const STRIPE_SECRET_KEY = 'sk_test_51J0mKlF9gDkZ2t3hHOb2tbf7c2v5l26DBVmGnnFsq0Mt6DJ2S72FGxy5FscEkq7aXzN9R6AwEDjfK0N4tj5BrpaP'; // Stripe test key

// Initialize Stripe with your secret key
const stripe = Stripe(STRIPE_SECRET_KEY);

// Eswa Payment Configuration
const esewaPaymentConfig = {
  apiUrl: 'https://esewa.com.np',
  merchantCode: ESEWA_MERCHANT_CODE,
};

// Stripe Payment Configuration
const stripePaymentConfig = {
  stripeClient: stripe,
  currency: 'USD', 
  paymentIntentEndpoint: '/create-payment-intent', 
};

// Cash on Delivery (COD) Configuration
const codPaymentConfig = {
  method: 'Cash on Delivery',
  description: 'Pay cash on delivery of your order',
};

export { esewaPaymentConfig, stripePaymentConfig, codPaymentConfig };
