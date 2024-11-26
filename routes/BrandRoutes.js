// routes/brandRoutes.js
import express from 'express';
import brandController from '../controllers/BrandController.js'; // default import

const router = express.Router();

router.post('/brands', brandController.createBrand); // Create a new brand with an image
router.get('/brands', brandController.getAllBrands);
router.get('/brands/:id', brandController.getBrandById);
router.put('/brands/:id', brandController.updateBrand);
router.delete('/brands/:id', brandController.deleteBrand);

export default router;
