import { Router } from "express";
import { searchProducts, getProductSuggestions } from "../controllers/SearchController.js";

const router = Router();


router.get("/search", searchProducts);


router.get("/suggestions", getProductSuggestions);

export default router;