// brandRoutes.js
import express from 'express';
import { getBrandsByLetter, getProductsByBrand } from '../controllers/brandController.js';

const router = express.Router();

// Route to get brands starting with a letter
router.get('/:letter', getBrandsByLetter);

// Route to get products by brand
router.get('/products/:brandName', getProductsByBrand);

export default router;
