import axios from 'axios';
import crypto from 'crypto';
import Payment from '../models/Payment.js';

// Helper function to generate unique transaction ID
const generateTransactionId = () => {
  return `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
};

// Initialize COD Payment
export const initiateCODPayment = async (orderId, userId, amount) => {
  const payment = new Payment({
    orderId,
    userId,
    amount,
    paymentMethod: 'COD',
    status: 'PENDING',
    transactionId: generateTransactionId(),
    paymentDetails: {
      deliveryNotes: 'Cash payment to be collected on delivery'
    }
  });

  await payment.save();
  return {
    success: true,
    message: 'COD payment initiated successfully',
    paymentId: payment._id,
    transactionId: payment.transactionId
  };
};

// Initialize Esewa Payment
export const initiateEsewaPayment = async (orderId, userId, amount) => {
  const transactionId = generateTransactionId();
  
  const payment = new Payment({
    orderId,
    userId,
    amount,
    paymentMethod: 'ESEWA',
    status: 'PENDING',
    transactionId
  });

  await payment.save();

  // Esewa payment parameters
  const esewaParams = {
    amt: amount,
    psc: 0,
    pdc: 0,
    txAmt: 0,
    tAmt: amount,
    pid: transactionId,
    scd: process.env.ESEWA_MERCHANT_CODE,
    su: `${process.env.PAYMENT_SUCCESS_URL}/esewa-success`,
    fu: `${process.env.PAYMENT_FAILURE_URL}/esewa-failure`
  };

  return {
    success: true,
    message: 'Esewa payment initiated',
    paymentId: payment._id,
    transactionId,
    esewaParams,
    redirectUrl: process.env.ESEWA_PAYMENT_URL
  };
};

// Verify Esewa Transaction
export const verifyEsewaTransaction = async (oid, amt, refId) => {
  try {
    const payment = await Payment.findOne({ transactionId: oid });
    if (!payment) {
      throw new Error('Payment not found');
    }

    // Verify with Esewa
    const verifyData = {
      amt: amt,
      rid: refId,
      pid: oid,
      scd: process.env.ESEWA_MERCHANT_CODE
    };

    const response = await axios.post(process.env.ESEWA_VERIFICATION_URL, verifyData);

    if (response.data.includes('Success')) {
      payment.status = 'COMPLETED';
      payment.paymentDetails = { ...payment.paymentDetails, refId, verificationResponse: response.data };
      await payment.save();

      return {
        success: true,
        message: 'Payment verified successfully',
        paymentId: payment._id
      };
    } else {
      payment.status = 'FAILED';
      payment.paymentDetails = { ...payment.paymentDetails, refId, verificationResponse: response.data };
      await payment.save();

      throw new Error('Payment verification failed');
    }
  } catch (error) {
    throw new Error(`Esewa verification failed: ${error.message}`);
  }
};

// Process Card Payment
export const processCardTransaction = async (orderId, userId, cardDetails) => {
  const transactionId = generateTransactionId();
  
  // In a real implementation, you would integrate with a payment gateway
  // This is a simplified example
  const payment = new Payment({
    orderId,
    userId,
    amount: cardDetails.amount,
    paymentMethod: 'CARD',
    status: 'PENDING',
    transactionId,
    paymentDetails: {
      cardType: cardDetails.cardType,
      lastFourDigits: cardDetails.cardNumber.slice(-4)
    }
  });

  try {
    // Simulate payment processing
    // In reality, you would integrate with a payment gateway here
    const isSuccessful = true; // This would be the response from payment gateway

    if (isSuccessful) {
      payment.status = 'COMPLETED';
      await payment.save();
      
      return {
        success: true,
        message: 'Card payment processed successfully',
        paymentId: payment._id,
        transactionId
      };
    } else {
      payment.status = 'FAILED';
      await payment.save();
      throw new Error('Card payment processing failed');
    }
  } catch (error) {
    throw new Error(`Card payment failed: ${error.message}`);
  }
};