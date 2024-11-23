import { 
    esewaPaymentConfig, 
    stripePaymentConfig, 
    codPaymentConfig,
    PAYMENT_STATUS
} from '../config/paymentConfig.js';
import Order from '../models/orderModel.js';

export const cashOnDelivery = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Validate amount limits
        if (order.totalAmount < codPaymentConfig.minimumAmount || 
            order.totalAmount > codPaymentConfig.maximumAmount) {
            return res.status(400).json({
                success: false,
                message: `COD amount must be between ${codPaymentConfig.minimumAmount} and ${codPaymentConfig.maximumAmount}`
            });
        }

        // Update order status
        order.paymentStatus = PAYMENT_STATUS.PENDING;
        order.paymentMethod = 'COD';
        order.orderStatus = 'Confirmed';
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Cash on Delivery initiated successfully",
            order: {
                id: order._id,
                amount: order.totalAmount,
                status: order.paymentStatus
            }
        });
    } catch (error) {
        console.error('COD Payment Error:', error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Payment processing failed"
        });
    }
};

export const esewaPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const params = {
            amt: order.totalAmount,
            psc: 0,
            pdc: 0,
            txAmt: 0,
            tAmt: order.totalAmount,
            pid: orderId,
            scd: esewaPaymentConfig.merchantCode,
            su: esewaPaymentConfig.successUrl,
            fu: esewaPaymentConfig.failureUrl
        };

        // Update order status
        order.paymentStatus = PAYMENT_STATUS.PROCESSING;
        order.paymentMethod = 'ESEWA';
        order.paymentDetails = params;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "eSewa payment initiated",
            paymentUrl: `${esewaPaymentConfig.apiUrl}/epay/main`,
            params,
            orderId: order._id
        });
    } catch (error) {
        console.error('eSewa Payment Error:', error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Payment initiation failed"
        });
    }
};

export const esewaSuccess = async (req, res) => {
    try {
        const { oid, amt, refId } = req.query;
        
        const order = await Order.findById(oid);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Verify payment amount
        if (order.totalAmount !== parseFloat(amt)) {
            order.paymentStatus = PAYMENT_STATUS.FAILED;
            await order.save();
            return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
        }

        // Update order status
        order.paymentStatus = PAYMENT_STATUS.COMPLETED;
        order.transactionId = refId;
        order.orderStatus = 'Confirmed';
        await order.save();

        return res.redirect(`${process.env.FRONTEND_URL}/payment/success`);
    } catch (error) {
        console.error('eSewa Success Callback Error:', error);
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
    }
};

export const esewaFailure = async (req, res) => {
    try {
        const { oid } = req.query;
        
        const order = await Order.findById(oid);
        if (order) {
            order.paymentStatus = PAYMENT_STATUS.FAILED;
            await order.save();
        }

        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
    } catch (error) {
        console.error('eSewa Failure Callback Error:', error);
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
    }
};

export const stripePayment = async (req, res) => {
    try {
        const { orderId, paymentMethodId } = req.body;
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const paymentIntent = await stripePaymentConfig.stripeClient.paymentIntents.create({
            amount: Math.round(order.totalAmount * 100), // Convert to cents
            currency: stripePaymentConfig.currency,
            payment_method: paymentMethodId,
            confirm: true,
            return_url: stripePaymentConfig.successUrl,
            metadata: {
                orderId: order._id.toString(),
                customerEmail: order.contactInfo.email
            }
        });

        // Update order status
        order.paymentStatus = paymentIntent.status === 'succeeded' ? 
            PAYMENT_STATUS.COMPLETED : PAYMENT_STATUS.PROCESSING;
        order.paymentMethod = 'STRIPE';
        order.transactionId = paymentIntent.id;
        order.paymentDetails = paymentIntent;

        if (paymentIntent.status === 'succeeded') {
            order.orderStatus = 'Confirmed';
        }

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Payment processed successfully",
            payment: {
                id: order._id,
                status: order.paymentStatus,
                transactionId: order.transactionId
            }
        });
    } catch (error) {
        console.error('Stripe Payment Error:', error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Payment processing failed"
        });
    }
};