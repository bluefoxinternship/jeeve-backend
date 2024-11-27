import { Router } from 'express';
import { getMostSearchedProducts } from '../controllers/MostSearchedController.js';

const router = Router();

// Get most searched products with optional limit parameter
router.get('/most-searched', getMostSearchedProducts);

export default router;
