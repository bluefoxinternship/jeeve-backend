import { validationResult } from 'express-validator';
import axios from 'axios';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import * as PaymentService from '../services/PaymentServices.js';

// Initialize payment based on method
export const initiatePayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { orderId, amount, paymentMethod } = req.body;
  const userId = req.user.id;

  try {
    let paymentResponse;
    
    switch (paymentMethod) {
      case 'COD':
        paymentResponse = await PaymentService.initiateCODPayment(orderId, userId, amount);
        break;
      
      case 'ESEWA':
        paymentResponse = await PaymentService.initiateEsewaPayment(orderId, userId, amount);
        break;
      
      case 'CARD':
        paymentResponse = await PaymentService.initiateCardPayment(orderId, userId, amount);
        break;
      
      default:
        return res.status(400).json({ message: 'Invalid payment method' });
    }

    res.status(200).json(paymentResponse);
  } catch (error) {
    console.error('Payment Initiation Error:', error);
    res.status(500).json({ message: 'Payment initiation failed', error: error.message });
  }
};

// Verify Esewa Payment
export const verifyEsewaPayment = async (req, res) => {
  const { oid, amt, refId } = req.query;

  try {
    const verificationResponse = await PaymentService.verifyEsewaTransaction(oid, amt, refId);
    res.status(200).json(verificationResponse);
  } catch (error) {
    console.error('Esewa Verification Error:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
};

// Handle Card Payment
export const processCardPayment = async (req, res) => {
  const { orderId, cardDetails } = req.body;
  const userId = req.user.id;

  try {
    const paymentResponse = await PaymentService.processCardTransaction(orderId, userId, cardDetails);
    res.status(200).json(paymentResponse);
  } catch (error) {
    console.error('Card Payment Error:', error);
    res.status(500).json({ message: 'Card payment failed', error: error.message });
  }
};

// Get Payment Status
export const getPaymentStatus = async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ status: payment.status, details: payment.paymentDetails });
  } catch (error) {
    console.error('Payment Status Error:', error);
    res.status(500).json({ message: 'Failed to fetch payment status', error: error.message });
  }
};