// routes/brandRoutes.js
import express from 'express';
import brandController from '../controllers/BrandController.js'; // default import
import { isAdmin } from '../middlewares/AuthMiddleware.js';
const router = express.Router();

router.post('/brands',isAdmin, brandController.createBrand); // Create a new brand with an image
router.get('/brands',brandController.getAllBrands);
router.get('/brands/:id', isAdminbrandController.getBrandById);
router.put('/brands/:id',isAdmin, brandController.updateBrand);
router.delete('/brands/:id',isAdmin, brandController.deleteBrand);

export default router;
