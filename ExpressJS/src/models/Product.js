const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: "default-product.jpg"
        },
        onSale: {
            type: Boolean,
            default: false
        },
        views: {
            type: Number,
            default: 0
        },
        purchaseCount: {
            type: Number,
            default: 0
        },
        commentCount: {
            type: Number,
            default: 0
        },
        favorites: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        similarProducts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
        viewedBy: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            viewedAt: {
                type: Date,
                default: Date.now
            }
        }],
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;