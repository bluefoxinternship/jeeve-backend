import ProductSearch from '../models/ProductSearch.js';
import Product from '../models/Product.js';

// Track product search
export const trackProductSearch = async (productId) => {
    try {
        let searchRecord = await ProductSearch.findOne({ productId });
        
        if (searchRecord) {
            await searchRecord.incrementSearchCount();
        } else {
            // Create new record if product exists
            const product = await Product.findById(productId);
            if (product) {
                searchRecord = new ProductSearch({ productId });
                await searchRecord.save();
            }
        }
        return true;
    } catch (error) {
        console.error('Error tracking product search:', error);
        return false;
    }
};

// Get most searched products
export const getMostSearchedProducts = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        // Get most searched products with populated product details
        const mostSearched = await ProductSearch.find()
            .sort({ searchCount: -1 })
            .limit(parseInt(limit))
            .populate({
                path: 'productId',
                select: 'productName productPrice productImage productDetail brand parentCategory',
                populate: [
                    { path: 'brand', select: 'name' },
                    { path: 'parentCategory', select: 'cName' }
                ]
            });

        // Filter out products that don't exist anymore
        const validProducts = mostSearched
            .filter(item => item.productId != null)
            .map(item => ({
                product: item.productId,
                searchCount: item.searchCount,
                lastSearched: item.lastSearched
            }));

        res.status(200).json({
            success: true,
            count: validProducts.length,
            data: validProducts
        });
    } catch (error) {
        console.error('Error in getMostSearchedProducts:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching most searched products",
            error: error.message
        });
    }
};
