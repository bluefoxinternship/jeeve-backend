import mongoose from 'mongoose';

const productSearchSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    searchCount: {
        type: Number,
        default: 1
    },
    lastSearched: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
productSearchSchema.index({ searchCount: -1 });

// Method to increment search count
productSearchSchema.methods.incrementSearchCount = async function() {
    this.searchCount += 1;
    this.lastSearched = new Date();
    return this.save();
};

export default mongoose.model('ProductSearch', productSearchSchema);
