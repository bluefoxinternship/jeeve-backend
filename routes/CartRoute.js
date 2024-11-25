import { Router } from 'express';
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from '../controllers/cartController.js';
import { isUser } from '../middlewares/AuthMiddleware.js';

const router = Router();

// Add an item to the cart
router.post('/cart', isUser, addToCart);

// Get the current user's cart
router.get('/cart', isUser, getCart);

// Remove an item from the cart
router.delete('/cart/:id', isUser, removeFromCart);

// Update the quantity of an item in the cart
router.put('/cart/:id', isUser, updateCartItem);

export default router;
