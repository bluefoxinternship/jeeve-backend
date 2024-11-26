import { PaymentService } from '../services/PaymentService.js';
import Payment from '../models/Payment.js';

export const initiatePayment = async (req, res) => {
  const { orderId, amount, paymentMethod } = req.body;
  const userId = req.user.id;

  try {
    let paymentResponse;
    switch (paymentMethod) {
      case 'COD':
        paymentResponse = await PaymentService.createCODPayment(orderId, userId, amount);
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
    res.status(500).json({ message: error.message });
  }
};

export const verifyEsewaPayment = async (req, res) => {
  const { oid, amt, refId } = req.query;

  if (!oid || !amt || !refId) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    const verificationResponse = await PaymentService.verifyEsewaTransaction(oid, amt, refId);
    res.status(200).json(verificationResponse);
  } catch (error) {
    console.error('Esewa Verification Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const processCardPayment = async (req, res) => {
  const { orderId, cardDetails } = req.body;
  const userId = req.user.id;

  try {
    const paymentResponse = await PaymentService.processCardTransaction(orderId, userId, cardDetails);
    res.status(200).json(paymentResponse);
  } catch (error) {
    console.error('Card Payment Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentStatus = async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await Payment.findById(paymentId).select('-cardDetails');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error('Payment Status Error:', error);
    res.status(500).json({ message: error.message });
  }
};