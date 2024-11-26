import Product from "../models/Product.js";

export const searchProducts = async (req, res) => {
  try {
    const { query, category, brand, minPrice, maxPrice, sortBy } = req.query;

    // Base search filter
    let searchFilter = {};

    
    if (query) {
      searchFilter.$or = [
        { productName: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      searchFilter.category = category;
    }

    // Brand filter
    if (brand) {
      searchFilter.brand = { $regex: brand, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      searchFilter.productPrice = {};
      if (minPrice) searchFilter.productPrice.$gte = Number(minPrice);
      if (maxPrice) searchFilter.productPrice.$lte = Number(maxPrice);
    }

    // Sorting options
    const sortOptions = {
      'price-asc': { productPrice: 1 },
      'price-desc': { productPrice: -1 },
      'rating-desc': { rating: -1 },
      'newest': { createdAt: -1 }
    };

    const sort = sortBy && sortOptions[sortBy] ? sortOptions[sortBy] : { createdAt: -1 };

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Execute search
    const products = await Product.find(searchFilter)
      .populate('category', 'cName cDescription')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Count total matching products for pagination
    const totalProducts = await Product.countDocuments(searchFilter);

    return res.status(200).json({
      status: 'success',
      message: 'Products retrieved successfully',
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products
    });

  } catch (error) {
    console.error('Error searching products:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Server Error',
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