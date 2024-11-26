// services/brandService.js
import Brand from '../models/Brand.js';
import cloudinary from '../config/cloudinaryConfig.js';
import stream from 'stream';

// Create a new brand with image upload
const createBrand = async (brandData, file) => {
  try {
    const brand = new Brand(brandData);

    if (file) {
      // Create a Promise for Cloudinary upload
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'brands/', // Optional folder in Cloudinary
            width: 500, // Resize image
            height: 500,
            crop: 'limit', // Crop to fit
          },
          (error, result) => {
            if (error) {
              reject('Cloudinary upload failed: ' + error.message);
            }
            resolve(result); // resolve with the Cloudinary result
          }
        );

        // Stream the image buffer to Cloudinary
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);
        bufferStream.pipe(uploadStream);
      });

      // After successful upload, save the Cloudinary URL in the brand document
      brand.image = uploadResult.secure_url;
    }

    return await brand.save(); // Save brand after uploading image
  } catch (error) {
    throw new Error('Error creating brand: ' + error.message);
  }
};

// Get all brands
const getAllBrands = async () => {
  try {
    return await Brand.find();
  } catch (error) {
    throw new Error('Error fetching brands: ' + error.message);
  }
};

// Get a single brand by ID
const getBrandById = async (id) => {
  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      throw new Error('Brand not found');
    }
    return brand;
  } catch (error) {
    throw new Error('Error fetching brand: ' + error.message);
  }
};

// Update brand details by ID
const updateBrand = async (id, brandData, file) => {
  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      throw new Error('Brand not found');
    }

    // Update brand details
    brand.name = brandData.name || brand.name;
    brand.description = brandData.description || brand.description;

    if (file) {
      // Create a Promise for Cloudinary upload
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'brands/', // Optional folder in Cloudinary
            width: 500,
            height: 500,
            crop: 'limit',
          },
          (error, result) => {
            if (error) {
              reject('Cloudinary upload failed: ' + error.message);
            }
            resolve(result); // resolve with the Cloudinary result
          }
        );

        // Stream the image buffer to Cloudinary
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);
        bufferStream.pipe(uploadStream);
      });

      // After successful upload, save the Cloudinary URL in the brand document
      brand.image = uploadResult.secure_url;
    }

    return await brand.save(); // Save updated brand after uploading new image
  } catch (error) {
    throw new Error('Error updating brand: ' + error.message);
  }
};

// Delete brand by ID
const deleteBrand = async (id) => {
  try {
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
      throw new Error('Brand not found');
    }
    return brand;
  } catch (error) {
    throw new Error('Error deleting brand: ' + error.message);
  }
};

export default {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
