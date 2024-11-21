import { Router } from 'express';
import { createProduct } from '../controllers/ProductController.js';

const router = Router();


router.post('/api/create_product', createProduct)

export default router;