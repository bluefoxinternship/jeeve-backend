import Brand from "../models/Brand.js";
import Product from "../models/Product.js";
import { trackProductSearch } from "./MostSearchedController.js";

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required',
      });
    }

    // Search filter for text-based query
    const searchFilter = {
      $or: [
        { productName: { $regex: query, $options: 'i' } },
        { productDetail: { $regex: query, $options: 'i' } },
      ],
    };

    // Execute search
    const products = await Product.find(searchFilter)
      .populate('brand', 'name')
      .populate("parentCategory", "cName cDescription")
      .populate("subCategory", "cName cDescription")
      .populate("childCategory", "cName cDescription");

    // Track searches for found products
    for (const product of products) {
      await trackProductSearch(product._id, query);
    }

    return res.status(200).json({
      status: 'success',
      message: 'Products retrieved successfully',
      products,
    });
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};


export const filterByBrand = async (req, res) => {
  try {
    const { brand } = req.query;

    if (!brand) {
      return res.status(400).json({
        status: 'error',
        message: 'Brand name is required',
      });
    }

    const brandObj = await Brand.findOne({ name: { $regex: brand, $options: 'i' } });
    if (!brandObj) {
      return res.status(404).json({
        status: 'error',
        message: 'Brand not found',
      });
    }

    const products = await Product.find({ brand: brandObj._id });

    return res.status(200).json({
      status: 'success',
      message: 'Products filtered by brand',
      products,
    });
  } catch (error) {
    console.error('Error in filterByBrand:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};


export const getSortedProducts = async (req, res) => {
  try {
    const { sort, category } = req.query;

    // Check if category is provided
    if (!category) {
      return res.status(400).json({
        status: "error",
        message: "Category is required for sorting.",
      });
    }

    if (!sort || (sort !== "low-to-high" && sort !== "high-to-low")) {
      return res.status(400).json({
        status: "error",
        message: "Invalid sort parameter. Use 'low-to-high' or 'high-to-low'.",
      });
    }

    const sortOrder = sort === "low-to-high" ? 1 : -1;

    const filter = { category }; // Ensure category is always included in the filter

    const products = await Product.find(filter)
    .populate("parentCategory", "cName cDescription")
    .populate("subCategory", "cName cDescription")
    .populate("childCategory", "cName cDescription")
      .sort({ productPrice: sortOrder });

    if (!products.length) {
      return res.status(404).json({
        status: "error",
        message: "No products found in the specified category.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: `Products sorted by price ${sort.replace("-", " ")}`,
      products,
    });
  } catch (error) {
    console.error("Error sorting products:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Server Error",
    });
  }
};


export const filteredPriceProducts = async (req, res) => {
  try {
    const { minPrice, maxPrice, category } = req.query;

    // Check if category is provided
    if (!category) {
      return res.status(400).json({
        status: "error",
        message: "Category is required for filtering.",
      });
    }

    const filter = { category }; // Ensure category is always included in the filter
    if (minPrice) filter.productPrice = { $gte: Number(minPrice) };
    if (maxPrice) filter.productPrice = { ...filter.productPrice, $lte: Number(maxPrice) };

    const products = await Product.find(filter)
    .populate("parentCategory", "cName cDescription")
    .populate("subCategory", "cName cDescription")
    .populate("childCategory", "cName cDescription")
      .sort({ productPrice: 1 }); // Optional: default sorting by price

    if (!products.length) {
      return res.status(404).json({
        status: "error",
        message: "No products found in the specified category and price range.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Products filtered successfully.",
      products,
    });
  } catch (error) {
    console.error("Error filtering products:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Server Error",
    });
  }
};

export const getProductSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Query must be at least 2 characters long'
      });
    }

    const suggestions = await Product.aggregate([
      {
        $match: {
          $or: [
            { productName: { $regex: query, $options: 'i' } },
            { brand: { $regex: query, $options: 'i' } }
          ]
        }
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          brand: 1,
          productPrice: 1,
          productImage: 1
        }
      },
      { $limit: 5 }
    ]);

    return res.status(200).json({
      status: 'success',
      suggestions
    });
  } catch (error) {
    console.error('Error fetching product suggestions:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Server Error'
    });
  }
};