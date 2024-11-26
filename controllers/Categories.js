import { toTitleCase } from '../config/function.js';
import categoryModel from '../models/Categories.js';
import cloudinary from '../config/cloudinaryConfig.js';  // Import Cloudinary config
import upload from '../middlewares/multer.js';  // Import multer middleware

class Category {
  async getAllCategory(req, res, next) {
    try {
      const categories = await categoryModel
        .find({ parentCategory: null })
        .sort({ _id: -1 });

      return res.status(200).json({
        success: true,
        message: categories.length ? 'Categories retrieved successfully' : 'No categories found',
        data: categories,
        count: categories.length,
      });
    } catch (err) {
      next(err);
    }
  }

  async getSubcategories(req, res, next) {
    try {
      const { parentCategoryId } = req.params;
  
      // Check if parent category exists
      const parentCategory = await categoryModel.findById(parentCategoryId);
      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          message: 'Parent category not found',
        });
      }
  
      const subcategories = await categoryModel
        .find({ parentCategory: parentCategoryId })
        .sort({ _id: -1 });
  
      return res.status(200).json({
        success: true,
        message: subcategories.length ? 'Subcategories retrieved successfully' : 'No subcategories found',
        data: subcategories,
        count: subcategories.length,
        parentCategory: parentCategory.cName,
      });
    } catch (err) {
      next(err);
    }
  }

  async postAddCategory(req, res, next) {
    try {
      const { cName, cDescription, cStatus, parentCategory } = req.body;

      const existingCategory = await categoryModel.findOne({
        cName: new RegExp(`^${cName}$`, 'i'),
        parentCategory: parentCategory || null,
      });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: 'Category already exists at this level',
        });
      }

      if (parentCategory) {
        const parentExists = await categoryModel.findById(parentCategory);
        if (!parentExists) {
          return res.status(404).json({
            success: false,
            message: 'Parent category not found',
          });
        }
      }

      let cImageUrl = null;

      // Handle image upload to Cloudinary with async/await
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "categories_images",
              resource_type: 'auto' },

            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(req.file.buffer);
        });

        cImageUrl = result.secure_url;  // The URL of the uploaded image
      }

      const newCategory = new categoryModel({
        cName: toTitleCase(cName),
        cDescription,
        cStatus,
        parentCategory: parentCategory || null,
        cImage: cImageUrl || null,
      });

      await newCategory.save();

      return res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: newCategory,
      });
    } catch (err) {
      next(err);
    }
  }

  async putEditCategory(req, res, next) {
    try {
      const { cName, cDescription, cStatus, parentCategory } = req.body;
      const { cId } = req.params; // Extract cId from URL parameters
  
      // Check if cId is provided
      if (!cId) {
        return res.status(400).json({
          success: false,
          message: 'Category ID is required',
        });
      }
  
      // If name is being updated, check for duplicates
      if (cName) {
        const existingCategory = await categoryModel.findOne({
          cName: new RegExp(`^${cName}$`, 'i'),
          _id: { $ne: cId },
          parentCategory: parentCategory || null,
        });
  
        if (existingCategory) {
          return res.status(409).json({
            success: false,
            message: 'Category name already exists at this level',
          });
        }
      }
  
      // If changing parent category, verify it exists
      if (parentCategory) {
        const parentExists = await categoryModel.findById(parentCategory);
        if (!parentExists) {
          return res.status(404).json({
            success: false,
            message: 'Parent category not found',
          });
        }
      }
  
      // Update the category
      const updatedCategory = await categoryModel.findByIdAndUpdate(
        cId,
        {
          ...(cName && { cName: toTitleCase(cName) }),
          ...(cDescription && { cDescription }),
          ...(cStatus && { cStatus }),
          ...(parentCategory !== undefined && { parentCategory: parentCategory || null }),
          updatedAt: Date.now(),
        },
        { new: true }
      );
  
      if (!updatedCategory) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: updatedCategory,
      });
    } catch (err) {
      next(err);
    }
  }
  
//get nestedcategory
  async getNestedCategories(req, res, next) {
    try {
      const buildCategoryTree = async (parentId = null) => {
        const categories = await categoryModel.find({ parentCategory: parentId }).sort({ _id: -1 });
        return Promise.all(
          categories.map(async (category) => ({
            ...category.toObject(),
            subcategories: await buildCategoryTree(category._id),
          }))
        );
      };
  
      const categoryTree = await buildCategoryTree();
      return res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: categoryTree,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const { cId } = req.params;
  
      // Check if category or any descendant subcategories exist
      const hasSubcategories = await categoryModel.exists({ parentCategory: cId });
      if (hasSubcategories) {
        return res.status(409).json({
          success: false,
          message: 'Cannot delete category with existing subcategories. Please delete subcategories first.',
        });
      }
  
      const deletedCategory = await categoryModel.findByIdAndDelete(cId);
      if (!deletedCategory) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
        data: deletedCategory,
      });
    } catch (err) {
      next(err);
    }
  }
}  

const categoryController = new Category();
export default categoryController;
