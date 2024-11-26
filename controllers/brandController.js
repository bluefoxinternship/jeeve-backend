// brandController.js
import Product from '../models/Product.js';

// Controller to fetch brands starting with a letter (A-Z)
export const getBrandsByLetter = async (req, res) => {
  const letter = req.params.letter.toUpperCase();
  try {
    const brands = await Product.distinct('brand', { brand: { $regex: `^${letter}`, $options: 'i' } });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Controller to fetch all products of a specific brand (alphabetically sorted)
export const getProductsByBrand = async (req, res) => {
  const { brandName } = req.params;
  try {
    const products = await Product.find({ brand: { $regex: new RegExp(`^${brandName}`, 'i') } }).sort({ productName: 1 });
    if (!products.length) {
      return res.status(404).json({ message: `No products found for the brand: ${brandName}` });
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
