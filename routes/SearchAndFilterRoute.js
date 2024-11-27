import { Router } from "express";
import { searchProducts, getProductSuggestions, getSortedProducts, filterByBrand, filteredPriceProducts } from "../controllers/SearchAndFilterController.js";

const router = Router();


router.get("/products/search", searchProducts);
router.get("/products/sort",  getSortedProducts); 
router.get("/products/price_filter", filteredPriceProducts);
router.get("/products/brand_filter", filterByBrand );
router.get("/products/suggestions", getProductSuggestions);

export default router;