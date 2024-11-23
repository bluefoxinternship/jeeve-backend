import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'NPR'
    },
    method: {
        type: String,
        enum: ['COD', 'ESEWA', 'STRIPE'],
        required: true
    },
    status: {
        type: String,
        enum: ['initiated', 'pending', 'processing', 'completed', 'failed', 'refunded'],
        default: 'initiated'
    },
    transactionId: String,
    paymentDetails: {
        type: Object,
        default: {}
    },
    metadata: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
});

// Indexes for better query performance
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ status: 1, method: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;