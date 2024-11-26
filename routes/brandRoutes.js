// routes/brandRoutes.js
import express from 'express';
import { isAdmin } from '../middlewares/AuthMiddleware.js';
import brandController from '../controllers/brandController.js';
const router = express.Router();

router.post('/brands',isAdmin, brandController.createBrand); // Create a new brand with an image
router.get('/brands',brandController.getAllBrands);
router.get('/brands/:id', isAdmin, brandController.getBrandById);
router.put('/brands/:id',isAdmin, brandController.updateBrand);
router.delete('/brands/:id',isAdmin, brandController.deleteBrand);

export default router;
