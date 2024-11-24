import { Router } from 'express';
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from '../controllers/cartController.js';
import { user } from '../middlewares/AuthMiddleware.js'; // Custom token validation middleware

const router = Router();

// Add an item to the cart
router.post('/cart', user, addToCart);

// Get the current user's cart
router.get('/cart', user, getCart);

// Remove an item from the cart
router.delete('/cart/:id', user, removeFromCart);

// Update the quantity of an item in the cart
router.put('/cart/:id', user, updateCartItem);

export default router;
