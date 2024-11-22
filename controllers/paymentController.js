import axios from "axios";
import stripe from "stripe";

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Cash on Delivery Payment
export const cashOnDelivery = async (req, res) => {
    try {
        const { orderId, amount } = req.body;

        // Save COD details in your database (if necessary)
        // Example:
        // await Order.create({ orderId, amount, paymentType: "COD", status: "Pending" });

        return res.status(200).json({
            success: true,
            message: "Cash on Delivery initiated successfully.",
            orderId,
            amount,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Esewa Payment
export const esewaPayment = async (req, res) => {
    try {
        const { orderId, amount } = req.body;

        const esewaUrl = "https://uat.esewa.com.np/epay/main"; // Use production URL for live
        const params = {
            amt: amount,
            psc: 0,
            pdc: 0,
            txAmt: 0,
            tAmt: amount,
            pid: orderId,
            scd: process.env.ESEWA_MERCHANT_CODE,
            su: `${process.env.BASE_URL}/payment/esewa/success?q=su`,
            fu: `${process.env.BASE_URL}/payment/esewa/failure?q=fu`,
        };

        return res.status(200).json({
            success: true,
            message: "Esewa payment initiated.",
            esewaUrl,
            params,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const esewaSuccess = async (req, res) => {
    try {
        const { refId, pid, amt } = req.query;

        // Validate Esewa payment
        const esewaVerificationUrl = "https://uat.esewa.com.np/epay/transrec";
        const params = {
            amt,
            scd: process.env.ESEWA_MERCHANT_CODE,
            rid: refId,
            pid,
        };

        const response = await axios.post(esewaVerificationUrl, null, { params });

        if (response.data.includes("<response_code>Success</response_code>")) {
            // Update payment status in DB (if applicable)
            return res.status(200).json({ success: true, message: "Esewa payment successful." });
        } else {
            return res.status(400).json({ success: false, message: "Esewa payment verification failed." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const esewaFailure = (req, res) => {
    return res.status(400).json({ success: false, message: "Esewa payment failed." });
};

// Stripe Payment
export const stripePayment = async (req, res) => {
    try {
        const { amount, currency, tokenId } = req.body;

        const paymentIntent = await stripeInstance.paymentIntents.create({
            amount: amount * 100, // Stripe uses cents
            currency: currency || "usd",
            payment_method_types: ["card"],
            payment_method_data: {
                type: "card",
                card: { token: tokenId },
            },
            confirm: true,
        });

        return res.status(200).json({
            success: true,
            message: "Stripe payment successful.",
            paymentIntent,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
