import { toTitleCase } from '../config/function.js';
import categoryModel from '../models/Categories.js';

class Category {
  // Get all categories
  async getAllCategory(req, res) {
    try {
      let Categories = await categoryModel.find({}).sort({ _id: -1 });
      if (Categories) {
        return res.json({ Categories });
      } else {
        return res.json({ error: "No categories found" });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: "An error occurred while fetching categories" });
    }
  }

  // Get subcategories of a specific category
  async getSubcategories(req, res) {
    const { parentCategoryId } = req.params; // Get the parent category ID from the route parameter

    try {
      // Fetch subcategories for the parent category
      const subcategories = await categoryModel.find({ parentCategory: parentCategoryId });

      if (subcategories.length > 0) {
        return res.json({ subcategories });
      } else {
        return res.json({ message: "No subcategories found for this category" });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: "An error occurred while fetching subcategories" });
    }
  }

  // Add a new category (main or subcategory)
  async postAddCategory(req, res) {
    let { cName, cDescription, cStatus, parentCategory } = req.body; // Add parentCategory for subcategory

    // Check if all required fields are present
    if (!cName || !cDescription || !cStatus) {
      return res.json({ error: "All fields must be required" });
    }

    cName = toTitleCase(cName); // Convert category name to title case

    try {
      // Check if the category already exists
      let checkCategoryExists = await categoryModel.findOne({ cName: cName });
      if (checkCategoryExists) {
        return res.json({ error: "Category already exists" });
      } else {
        // Create and save the new category or subcategory
        let newCategory = new categoryModel({
          cName,
          cDescription,
          cStatus,
          parentCategory: parentCategory || null, // Set parent category for subcategory or null for main category
        });

        // Save category (use async/await, no callback needed)
        await newCategory.save();

        return res.json({ success: "Category created successfully" });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: "An error occurred while creating the category" });
    }
  }

  // Edit a category (main or subcategory)
  async postEditCategory(req, res) {
    let { cId, cDescription, cStatus, parentCategory } = req.body;

    if (!cId || !cDescription || !cStatus) {
      return res.json({ error: "All fields must be required" });
    }

    try {
      let editCategory = await categoryModel.findByIdAndUpdate(cId, {
        cDescription,
        cStatus,
        parentCategory, // Update the parent category if needed
        updatedAt: Date.now(),
      });

      if (editCategory) {
        return res.json({ success: "Category edited successfully" });
      } else {
        return res.json({ error: "Category not found" });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: "An error occurred while editing the category" });
    }
  }

  // Delete a category (main or subcategory)
  async getDeleteCategory(req, res) {
    let { cId } = req.body;

    if (!cId) {
      return res.json({ error: "Category ID is required" });
    }

    try {
      // Find the category to be deleted
      let deletedCategory = await categoryModel.findById(cId);

      if (deletedCategory) {
        // Delete the category from the database
        await categoryModel.findByIdAndDelete(cId);
        return res.json({ success: "Category deleted successfully" });
      } else {
        return res.json({ error: "Category not found" });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: "An error occurred while deleting the category" });
    }
  }
}

// Exporting the categoryController as default export
const categoryController = new Category();
export default categoryController;
