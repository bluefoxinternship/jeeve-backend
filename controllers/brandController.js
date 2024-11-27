// controllers/brandController.js
import brandService from '../services/BrandServices.js';
import upload from '../middlewares/multer.js';  // Ensure correct import for multer
import Brand from '../models/Brand.js';
import Product from '../models/Product.js';

// Create a new brand with an image
const createBrand = (req, res) => {
  // Use the .single() method of multer to handle the image upload
  upload.single('image')(req, res, async (err) => {  // 'image' is the field name for the image file
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      // Pass req.body (brand details) and req.file (the uploaded image file)
      const brand = await brandService.createBrand(req.body, req.file); 
      res.status(201).json(brand);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// Get all brands
const getAllBrands = async (req, res) => {
  try {
    const brands = await brandService.getAllBrands();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single brand by ID
const getBrandById = async (req, res) => {
  const { id } = req.params;
  try {
    const brand = await brandService.getBrandById(id);
    res.status(200).json(brand);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update brand details by ID
const updateBrand = (req, res) => {
  const { id } = req.params;

  // Use multer's upload middleware for handling file upload
  upload.single('image')(req, res, async (err) => {  // Ensure 'image' matches the field in the request
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const updatedBrand = await brandService.updateBrand(id, req.body, req.file);  // Pass updated data & file
      res.status(200).json(updatedBrand);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// Delete brand by ID
const deleteBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBrand = await brandService.deleteBrand(id);
    res.status(200).json(deletedBrand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const brandOfTheWeek =async (req, res) => {
  try {
    // Fetch the Brand of the Week
    const brand = await Brand.findOne({ isBrandOfTheWeek: true });

    if (!brand) {
      return res.status(404).json({ message: "No Brand of the Week found." });
    }

    // Fetch products for the Brand of the Week
    const products = await Product.find({ brand: brand._id });

    // Respond with the brand and its products
    res.status(200).json({
      brand,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



export default {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  brandOfTheWeek,
};

