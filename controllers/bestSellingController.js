import Product from '../models/Product.js';
import { Order } from '../models/order.js';
import { OrderItem } from '../models/order-item.js';
import mongoose from 'mongoose';

export const getBestSellers = async (req, res) => {
  try {
    // Get category from query parameter, optional
    const { category } = req.query;

    // Aggregate pipeline to get best-selling products by category
    const pipeline = [
      // Join with OrderItem to get sales data
      {
        $lookup: {
          from: 'orderitems', // Ensure this matches your MongoDB collection name
          localField: '_id',
          foreignField: 'product',
          as: 'sales'
        }
      },
      // Unwind the sales array
      { $unwind: { path: '$sales', preserveNullAndEmptyArrays: true } },
      // Group by product and calculate total quantity sold
      {
        $group: {
          _id: '$_id',
          productName: { $first: '$productName' },
          category: { $first: '$category' },
          totalQuantitySold: { $sum: '$sales.quantity' },
          productPrice: { $first: '$productPrice' },
          productImage: { $first: '$productImage' }
        }
      }
    ];

    // Add category filter if provided
    if (category) {
      pipeline.unshift({ $match: { category: category } });
    }

    // Sort by total quantity sold in descending order and limit to top 10
    pipeline.push(
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 10 }
    );

    const bestSellers = await Product.aggregate(pipeline);

    return res.status(200).json({
      status: 'success',
      message: category 
        ? `Best selling products in ${category} category` 
        : 'Best selling products across all categories',
      data: bestSellers
    });
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error while fetching best sellers',
      error: error.message
    });
  }
};

export const getOverallBestSellers = async (req, res) => {
  try {
    // Aggregate pipeline to get overall best-selling products
    const bestSellers = await Product.aggregate([
      // Join with OrderItem to get sales data
      {
        $lookup: {
          from: 'orderitems',
          localField: '_id',
          foreignField: 'product',
          as: 'sales'
        }
      },
      // Unwind the sales array
      { $unwind: { path: '$sales', preserveNullAndEmptyArrays: true } },
      // Group by product and calculate total quantity sold
      {
        $group: {
          _id: '$_id',
          productName: { $first: '$productName' },
          category: { $first: '$category' },
          totalQuantitySold: { $sum: '$sales.quantity' },
          productPrice: { $first: '$productPrice' },
          productImage: { $first: '$productImage' }
        }
      },
      // Sort by total quantity sold in descending order
      { $sort: { totalQuantitySold: -1 } },
      // Limit to top 10 products
      { $limit: 10 }
    ]);

    return res.status(200).json({
      status: 'success',
      message: 'Overall best selling products across all categories',
      data: bestSellers
    });
  } catch (error) {
    console.error('Error fetching overall best sellers:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error while fetching overall best sellers',
      error: error.message
    });
  }
};

export default {
  getBestSellers,
  getOverallBestSellers
};