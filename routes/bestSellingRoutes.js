import express from 'express';
const router = express.Router();
import bestSellingController from '../controllers/bestSellingController.js';

// Route for best sellers by category
router.get('/best-seller-category', bestSellingController.getBestSellers);

// Route for overall best sellers
router.get('/overall-best-seller', bestSellingController.getOverallBestSellers);

export default router;