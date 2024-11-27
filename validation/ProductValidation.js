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
    .withMessage("Count in stock must be a non-negative integer"),

  body("weight")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Weight must be a positive number"),

  body("status")
    .optional()
    .isIn(["active", "inactive", "archived"])
    .withMessage("Status must be one of 'active', 'inactive', or 'archived'"),

  body("seoDescription")
    .optional()
    .isLength({ max: 160 })
    .withMessage("SEO description cannot exceed 160 characters"),

  body("seoTitle")
    .optional()
    .isLength({ max: 60 })
    .withMessage("SEO title cannot exceed 60 characters"),

  body("highlights")
    .optional()
    .isArray()
    .withMessage("Highlights must be an array of strings"),

  body("highlights.*")
    .optional()
    .isString()
    .withMessage("Each highlight must be a string"),

  body("color")
    .optional()
    .isString()
    .withMessage("Color must be a string"),

  body("specifications")
    .optional()
    .isObject()
    .withMessage("Specifications must be a valid object"),

  body("slug")
    .optional()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Slug must be a valid URL-friendly string"),
];

export const productIdValidation = [
  param("id").isMongoId().withMessage("Invalid product ID format"),
];
