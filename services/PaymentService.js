import Payment from '../models/Payment.js';
import axios from 'axios';
import crypto from 'crypto';

export class PaymentService {
  static async createCODPayment(orderId, userId, amount) {
    const payment = new Payment({
      orderId,
      userId,
      amount,
      paymentMethod: 'COD',
      status: 'PENDING',
      paymentDetails: {
        initiatedAt: new Date()
      }
    });

    await payment.save();
    return { success: true, paymentId: payment._id };
  }

  static async initiateEsewaPayment(orderId, userId, amount) {
    try {
      const transactionId = crypto.randomBytes(16).toString('hex');
      const payment = new Payment({
        orderId,
        userId,
        amount,
        paymentMethod: 'ESEWA',
        status: 'PENDING',
        transactionId,
        paymentDetails: {
          initiatedAt: new Date()
        }
      });

      await payment.save();

      const esewaParams = {
        amt: amount,
        psc: 0,
        pdc: 0,
        txAmt: 0,
        tAmt: amount,
        pid: transactionId,
        scd: process.env.ESEWA_MERCHANT_CODE,
        su: `${process.env.PAYMENT_SUCCESS_URL}`,
        fu: `${process.env.PAYMENT_FAILURE_URL}`
      };

      return {
        success: true,
        paymentId: payment._id,
        transactionId,
        esewaParams,
        redirectUrl: process.env.ESEWA_PAYMENT_URL
      };
    } catch (error) {
      throw new Error(`Esewa payment initiation failed: ${error.message}`);
    }
  }

  static async verifyEsewaTransaction(oid, amt, refId) {
    try {
      const payment = await Payment.findOne({ transactionId: oid });
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (parseFloat(amt) !== payment.amount) {
        throw new Error('Amount mismatch');
      }

      const verifyData = {
        amt: amt,
        rid: refId,
        pid: oid,
        scd: process.env.ESEWA_MERCHANT_CODE
      };

      const response = await axios.post(
        process.env.ESEWA_VERIFICATION_URL,
        new URLSearchParams(verifyData).toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 10000
        }
      );

      if (response.data.includes('Success')) {
        payment.status = 'COMPLETED';
        payment.paymentDetails.verificationResponse = response.data;
        payment.paymentDetails.completedAt = new Date();
        await payment.save();
        return { success: true, paymentId: payment._id };
      }

      payment.status = 'FAILED';
      payment.paymentDetails.failureReason = 'Verification failed';
      await payment.save();
      throw new Error('Payment verification failed');
    } catch (error) {
      throw new Error(`Esewa verification failed: ${error.message}`);
    }
  }

  static async processCardTransaction(orderId, userId, cardDetails) {
    try {
      // Implement your card payment gateway integration here
      const payment = new Payment({
        orderId,
        userId,
        amount: cardDetails.amount,
        paymentMethod: 'CARD',
        status: 'PENDING',
        paymentDetails: {
          initiatedAt: new Date(),
          last4: cardDetails.cardNumber.slice(-4)
        }
      });

      await payment.save();
      return { success: true, paymentId: payment._id };
    } catch (error) {
      throw new Error(`Card payment failed: ${error.message}`);
    }
  }
}
