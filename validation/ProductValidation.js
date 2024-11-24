import { body, param } from "express-validator";

export const productValidationRules = [
    body("productName").notEmpty().withMessage("Product name is required"),
    body("productDetail").notEmpty().withMessage("Product detail is required"),
    body("productPrice")
        .isFloat({ gt: 0 })
        .withMessage("Product price must be a positive number"),
    body("brand").notEmpty().withMessage("Brand name is required"),
    body("countInStock")
        .isInt({ min: 0 })
        .withMessage("Count in stock must be a positive number"),
];

export const productIdValidation = [
    param("id").isMongoId().withMessage("Invalid product id format"),
];
