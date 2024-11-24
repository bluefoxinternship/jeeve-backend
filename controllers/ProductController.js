import cloudinary from "../config/cloudinaryConfig.js";
import upload from "../middlewares/multer.js";
import categoryModel from "../models/Categories.js";
import Product from "../models/Product.js";


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("category", "cName cDescription").sort({createdAt:-1})
    
    if (!products.length) {
      return res.status(404).json({
        status: "error",
        message: "No products found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Server Error",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid product ID format",
      });
    }

    const product = await Product.findById(id).populate("category", "cName cDescription");

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Product retrieved successfully",
      product,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Server Error",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      productDetail,
      productPrice,
      brand,
      countInStock,
      category,
    } = req.body;

// Convert price to number if it's coming as string from form-data
const price = Number(productPrice);
const stock = Number(countInStock);

    // Check if category exists
    const categoryExist = await categoryModel.findById(category);
    if (!categoryExist) {
      return res.status(400).json({
        status: "error",
        message: "Category does not exist",
      });
    }

    // Upload image to Cloudinary if file is present
    let productImageUrl = null;
    if (req.file) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              folder: "product_images",
              resource_type: "auto"
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
        productImageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        return res.status(500).json({
          status: "error",
          message: "Error uploading image",
        });
      }
    }

    // Create the new product
    const newProduct = new Product({
      productName,
      productDetail,
      productPrice: price,
      brand,
      countInStock: stock,
      productImage: productImageUrl,
      category,
    });

    await newProduct.save();

    return res.status(201).json({
      status: "success",
      message: "Product successfully created",
      product: newProduct,
    });
  } catch (err) {
    console.error("Error creating product:", err);
    return res.status(500).json({
      status: "error",
      message: err.message || "Error creating product",
    });
  }
};


export const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    const {
      productName,
      productDetail,
      productPrice,
      brand,
      countInStock,
      category,
    } = req.body;

    // Build update object with type conversion for numeric fields
    let productUpdates = {
      ...(productName && { productName }),
      ...(productDetail && { productDetail }),
      ...(productPrice && { productPrice: Number(productPrice) }),
      ...(brand && { brand }),
      ...(countInStock && { countInStock: Number(countInStock) }),
    };

    if (category) {
      const categoryExists = await categoryModel.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          status: "error",
          message: "Category not found",
        });
      }
      productUpdates.category = category;
    }

    if (req.file) {
      try {
        if (existingProduct.productImage) {
          const publicId = existingProduct.productImage.split('/').slice(-1)[0].split('.')[0];
          try {
            await cloudinary.uploader.destroy(`product_images/${publicId}`);
          } catch (deleteError) {
            console.error("Error deleting old image:", deleteError);
          }
        }

        // Upload new image
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              folder: "product_images",
              resource_type: "auto" 
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
        productUpdates.productImage = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        return res.status(500).json({
          status: "error",
          message: "Error uploading new image",
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productUpdates,
      { 
        new: true,
        runValidators: true 
      }
    ).populate("category", "cName cDescription");

    return res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Error updating product",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    if (product.productImage) {
      const publicId = product.productImage
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      await cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error("Error deleting image from Cloudinary:", error);
        } else {
          console.log("Image deletion result:", result);
        }
      });
    }
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: "success",
      message: "Product successfully deleted",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message || "Error deleting product",
    });
  }
};