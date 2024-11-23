import mongoose from "mongoose";
import { PAYMENT_METHODS, PAYMENT_STATUS } from '../config/paymentConfig.js';

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0
                }
            },
        ],
        paymentMethod: {
            type: String,
            enum: Object.values(PAYMENT_METHODS),
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: Object.values(PAYMENT_STATUS),
            default: PAYMENT_STATUS.PENDING,
        },
        orderStatus: {
            type: String,
            enum: ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"],
            default: "Processing",
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        transactionId: {
            type: String,
            sparse: true,
        },
        paymentDetails: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        shippingAddress: {
            street: String,
            city: String,
            state: String,
            country: String,
            zipCode: String
        },
        contactInfo: {
            email: String,
            phone: String
        }
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes for better query performance
orderSchema.index({ createdAt: -1 });
orderSchema.index({ paymentStatus: 1, orderStatus: 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;