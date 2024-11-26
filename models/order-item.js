
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

export const OrderItem = mongoose.model('OrderItem', orderItemSchema);