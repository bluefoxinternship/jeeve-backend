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
router.post('/add-to-cart', addToCart);

// Get the current user's cart
router.get('/get-from-cart', user, getCart);

// Remove an item from the cart
router.delete('/remove-from-cart', user, removeFromCart);

// Update the quantity of an item in the cart
router.put('/update-to-cart', user, updateCartItem);

export default router;
