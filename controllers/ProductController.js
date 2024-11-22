import cloudinary from "../config/cloudinaryConfig.js";
import Product from "../models/Product.js";


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    
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

    const product = await Product.findById(id);

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

export const createProduct = async (req, res, next) => {
  const {
    productName,
    productDetail,
    productPrice,
    brand,
    countInStock,
    productImage,
  } = req.body;

  try {
    const newProduct = new Product({
      productName,
      productDetail,
      productPrice,
      brand,
      countInStock,
      productImage,
    });

    await newProduct.save();

    return res.status(200).json({
      status: "success",
      message: "Product successfully created",
      product: newProduct,
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: err.message || "Error creating product",
    });
  }
};


export const editProduct = async (req, res) => {
  const {
    productName,
    productDetail,
    productPrice,
    brand,
    countInStock,
    productImage,
  } = req.body;

  const productUpdates = {
    productName,
    productDetail,
    productPrice,
    brand,
    countInStock,
    productImage,
  };
  if (req.body.product_image) {
    productUpdates.productImage = req.body.product_image;
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      productUpdates,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Product successfully updated",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(400).json({
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
