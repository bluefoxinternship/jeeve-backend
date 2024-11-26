import express from 'express';
import { Order } from '../models/order.js';
import { OrderItem } from '../models/order-item.js';
// import AuthMiddleware from '../middlewares/AuthMiddleware.js'
import AuthMiddleware from '../middlewares/AuthMiddleware.js';

const { isUser, isAdmin } = AuthMiddleware;

const router = express.Router();

// Create an order (Requires user authentication)
router.post('/orders', isUser, async (req, res) => {
    try {
        const { orderItems, shippingAddress, city, phone, user, totalAmount } = req.body;

        if (!orderItems?.length || !shippingAddress || !city || !phone || !user) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required",
                required: ["orderItems", "shippingAddress", "city", "phone", "user"]
            });
        }

        const orderItemsIds = await Promise.all(orderItems.map(async (item) => {
            const newOrderItem = new OrderItem({
                quantity: item.quantity,
                product: item.productId,
                price: item.price
            });
            return await newOrderItem.save();
        }));

        const calculatedTotal = await OrderItem.aggregate([
            { $match: { _id: { $in: orderItemsIds } } },
            { $group: { _id: null, total: { $sum: { $multiply: ["$price", "$quantity"] } } } }
        ]);

        const finalTotal = totalAmount || calculatedTotal[0]?.total || 0;

        const order = new Order({
            orderItems: orderItemsIds,
            shippingAddress,
            city,
            phone,
            totalAmount: finalTotal,
            user,
            status: 'Pending'
        });

        const savedOrder = await order.save();

        const populatedOrder = await Order.findById(savedOrder._id)
            .populate('user', 'name email')
            .populate({
                path: 'orderItems',
                populate: { path: 'product', select: 'name price image' }
            });

        res.status(201).json({ success: true, message: "Order created successfully", data: populatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create order", error: error.message });
    }
});

// Get all orders (Requires admin access)
router.get('/orders', isAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate({
                path: 'orderItems',
                populate: { path: 'product', select: 'name price image' }
            })
            .sort('-createdAt');

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch orders", error: error.message });
    }
});

// Get order by ID (Requires user authentication)
router.get('/orders/:id', isUser, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate({
                path: 'orderItems',
                populate: { path: 'product', select: 'name price image' }
            });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch order", error: error.message });
    }
});

// Update order status (Requires admin access)
router.put('/orders/:id', isAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ success: false, message: "Status is required" });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('user', 'name email')
        .populate({
            path: 'orderItems',
            populate: { path: 'product', select: 'name price image' }
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, message: "Order status updated successfully", data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update order status", error: error.message });
    }
});

// Delete order (Requires admin access)
router.delete('/orders/:id', isAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        await OrderItem.deleteMany({ _id: { $in: order.orderItems } });
        await order.deleteOne();

        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete order", error: error.message });
    }
});

// Get user orders (Requires user authentication)
router.get('/orders/user/:userId', isUser, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId })
            .populate('user', 'name email')
            .populate({
                path: 'orderItems',
                populate: { path: 'product', select: 'name price image' }
            })
            .sort('-createdAt');

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch user orders", error: error.message });
    }
});

// Get total sales (Requires admin access)
router.get('/orders/stats/total-sales', isAdmin, async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
        ]);

        res.status(200).json({ success: true, data: { totalSales: totalSales[0]?.totalSales || 0 } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to calculate total sales", error: error.message });
    }
});


export default router;