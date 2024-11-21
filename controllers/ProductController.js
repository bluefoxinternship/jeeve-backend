import Product from '../models/Product.js';


export const createProduct = async (req, res, next) => {
  const {
    product_name,
    product_detail,
    product_price,
    brand_name,
    countInStock,
    product_image,
  } = req.body;

  try {

    const newProduct = new Product({
      productName: product_name,
      productDetail: product_detail,
      productPrice: product_price,
      brand: brand_name,
      countInStock,
      productImage: product_image, 
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
