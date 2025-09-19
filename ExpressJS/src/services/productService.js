const Product = require("../models/Product");
const Fuse = require("fuse.js");
const mongoose = require("mongoose");

// /**
//  * Lấy danh sách sản phẩm theo danh mục với phân trang
//  * @param {string} category - Danh mục sản phẩm
//  * @param {number} page - Số trang hiện tại
//  * @param {number} limit - Số sản phẩm trên mỗi trang
//  * @returns {Object} - Kết quả bao gồm danh sách sản phẩm và thông tin phân trang
//  */
// const getProductsByCategoryService = async (category, page = 1, limit = 10) => {
//     try {
//         // Chuyển đổi tham số sang số
//         const pageNumber = parseInt(page);
//         const limitNumber = parseInt(limit);

//         // Tính toán số lượng sản phẩm cần bỏ qua
//         const skip = (pageNumber - 1) * limitNumber;

//         // Tìm kiếm sản phẩm theo danh mục
//         let query = {};
//         if (category && category !== 'all') {
//             query.category = category;
//         }

//         // Thực hiện truy vấn với phân trang
//         const products = await Product.find(query)
//             .skip(skip)
//             .limit(limitNumber)
//             .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất

//         // Đếm tổng số sản phẩm thỏa mãn điều kiện
//         const totalProducts = await Product.countDocuments(query);

//         // Tính toán tổng số trang
//         const totalPages = Math.ceil(totalProducts / limitNumber);

//         return {
//             success: true,
//             data: {
//                 products,
//                 pagination: {
//                     total: totalProducts,
//                     page: pageNumber,
//                     limit: limitNumber,
//                     totalPages
//                 }
//             }
//         };
//     } catch (error) {
//         console.error("Error fetching products by category:", error);
//         return {
//             success: false,
//             message: "Error fetching products",
//             error: error.message
//         };
//     }
// };

/**
 * Lấy danh sách tất cả các danh mục sản phẩm
 * @returns {Array} - Danh sách các danh mục
 */
const getAllCategoriesService = async () => {
    try {
        // Lấy danh sách các danh mục duy nhất từ sản phẩm
        const categories = await Product.distinct("category");

        return {
            success: true,
            data: categories
        };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return {
            success: false,
            message: "Error fetching categories",
            error: error.message
        };
    }
};

/**
 * Lấy danh sách sản phẩm với filter + search + phân trang
 * @param {Object} filters - Bộ lọc (category, minPrice, maxPrice, onSale, views, search)
 * @param {number} page - Số trang hiện tại
 * @param {number} limit - Số sản phẩm trên mỗi trang
 * @returns {Object} - Kết quả bao gồm danh sách sản phẩm và thông tin phân trang
 */
const getProductsService = async (filters, page = 1, limit = 10) => {
    try {
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        let query = {};

        // Category filter
        if (filters.category && filters.category !== "all") {
            query.category = filters.category;
        }

        // Price filter
        if (filters.minPrice || filters.maxPrice) {
            query.price = {};
            if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
            if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);
        }

        // OnSale filter
        if (filters.onSale) {
            query.onSale = filters.onSale === "true";
        }

        // Views filter
        if (filters.views) {
            query.views = { $gte: parseInt(filters.views) };
        }

        // Lấy dữ liệu trước từ DB
        let products = await Product.find(query).sort({ createdAt: -1 });

        // search Fuse 
        if (filters.search) {
            const fuse = new Fuse(products, {
                keys: ["name", "description"],
                includeScore: true,
                threshold: 0.4
            });
            products = fuse.search(filters.search).map(r => r.item);
        }

        // Tính toán phân trang sau khi search
        const totalProducts = products.length;
        const totalPages = Math.ceil(totalProducts / limitNumber);
        const pagedProducts = products.slice(skip, skip + limitNumber);

        return {
            success: true,
            data: {
                products: pagedProducts,
                pagination: {
                    total: totalProducts,
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages
                }
            }
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            success: false,
            message: "Error fetching products",
            error: error.message
        };
    }
};

// Fuzzy search
// const fuzzySearchProducts = async (search) => {
//     const products = await Product.find();

//     const fuse = new Fuse(products, {
//         keys: ["name", "description"],
//         includeScore: true,
//         threshold: 0.4
//     });

//     const result = fuse.search(search);
//     return result.map(r => r.item);
// }

// // Filter
// const filterProducts = async (filters) => {
//     const { category, minPrice, maxPrice, onSale, views } = filters;
//     let query = {};

//     if (category) {
//         query.category = category;
//     }

//     if (minPrice || maxPrice) {
//         query.price = {};
//         if (minPrice) query.price.$gte = parseFloat(minPrice);
//         if (maxPrice) query.price.$lte = parseFloat(maxPrice);
//     }

//     if (onSale) {
//         query.isOnSale = onSale === "true";
//     }

//     if (views) {
//         query.views = { $gte: parseInt(views) };
//     }

//     return await Product.find(query);
// }

/**
 * Thêm sản phẩm vào danh sách yêu thích
 * @param {string} productId - ID của sản phẩm
 * @param {string} userId - ID của người dùng
 * @returns {Object} - Kết quả thêm vào yêu thích
 */
const addToFavoritesService = async (productId, userId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return {
                success: false,
                message: "Sản phẩm không tồn tại"
            };
        }

        // Kiểm tra xem sản phẩm đã có trong danh sách yêu thích chưa
        if (product.favorites.includes(userId)) {
            return {
                success: false,
                message: "Sản phẩm đã có trong danh sách yêu thích"
            };
        }

        // Thêm user vào danh sách yêu thích
        product.favorites.push(userId);
        await product.save();

        return {
            success: true,
            message: "Đã thêm sản phẩm vào danh sách yêu thích",
            data: product
        };
    } catch (error) {
        console.error("Error adding to favorites:", error);
        return {
            success: false,
            message: "Lỗi khi thêm vào danh sách yêu thích",
            error: error.message
        };
    }
};

/**
 * Xóa sản phẩm khỏi danh sách yêu thích
 * @param {string} productId - ID của sản phẩm
 * @param {string} userId - ID của người dùng
 * @returns {Object} - Kết quả xóa khỏi yêu thích
 */
const removeFromFavoritesService = async (productId, userId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return {
                success: false,
                message: "Sản phẩm không tồn tại"
            };
        }

        // Xóa user khỏi danh sách yêu thích
        product.favorites = product.favorites.filter(fav => fav.toString() !== userId);
        await product.save();

        return {
            success: true,
            message: "Đã xóa sản phẩm khỏi danh sách yêu thích",
            data: product
        };
    } catch (error) {
        console.error("Error removing from favorites:", error);
        return {
            success: false,
            message: "Lỗi khi xóa khỏi danh sách yêu thích",
            error: error.message
        };
    }
};

/**
 * Lấy danh sách sản phẩm yêu thích của người dùng
 * @param {string} userId - ID của người dùng
 * @param {number} page - Số trang hiện tại
 * @param {number} limit - Số sản phẩm trên mỗi trang
 * @returns {Object} - Danh sách sản phẩm yêu thích
 */
const getFavoriteProductsService = async (userId, page = 1, limit = 10) => {
    try {
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Tìm sản phẩm có userId trong danh sách favorites
        const products = await Product.find({ favorites: userId })
            .skip(skip)
            .limit(limitNumber)
            .sort({ updatedAt: -1 });

        const totalProducts = await Product.countDocuments({ favorites: userId });
        const totalPages = Math.ceil(totalProducts / limitNumber);

        return {
            success: true,
            data: {
                products,
                pagination: {
                    total: totalProducts,
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages
                }
            }
        };
    } catch (error) {
        console.error("Error fetching favorite products:", error);
        return {
            success: false,
            message: "Lỗi khi lấy danh sách sản phẩm yêu thích",
            error: error.message
        };
    }
};

/**
 * Cập nhật danh sách sản phẩm tương tự
 * @param {string} productId - ID của sản phẩm
 * @returns {Object} - Kết quả cập nhật
 */
const updateSimilarProductsService = async (productId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return {
                success: false,
                message: "Sản phẩm không tồn tại"
            };
        }

        // Tìm sản phẩm tương tự dựa trên category và price range
        const priceRange = product.price * 0.2; // 20% giá trị
        const similarProducts = await Product.find({
            _id: { $ne: productId },
            category: product.category,
            price: {
                $gte: product.price - priceRange,
                $lte: product.price + priceRange
            }
        }).limit(5);

        // Cập nhật danh sách sản phẩm tương tự
        product.similarProducts = similarProducts.map(p => p._id);
        await product.save();

        return {
            success: true,
            message: "Đã cập nhật danh sách sản phẩm tương tự",
            data: similarProducts
        };
    } catch (error) {
        console.error("Error updating similar products:", error);
        return {
            success: false,
            message: "Lỗi khi cập nhật sản phẩm tương tự",
            error: error.message
        };
    }
};

/**
 * Lấy danh sách sản phẩm tương tự
 * @param {string} productId - ID của sản phẩm
 * @returns {Object} - Danh sách sản phẩm tương tự
 */
const getSimilarProductsService = async (productId) => {
    try {
        const product = await Product.findById(productId).populate('similarProducts');
        if (!product) {
            return {
                success: false,
                message: "Sản phẩm không tồn tại"
            };
        }

        return {
            success: true,
            data: product.similarProducts
        };
    } catch (error) {
        console.error("Error fetching similar products:", error);
        return {
            success: false,
            message: "Lỗi khi lấy danh sách sản phẩm tương tự",
            error: error.message
        };
    }
};

/**
 * Cập nhật lượt xem sản phẩm
 * @param {string} productId - ID của sản phẩm
 * @param {string} userId - ID của người dùng
 * @returns {Object} - Kết quả cập nhật
 */
const updateProductViewService = async (productId, userId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return {
                success: false,
                message: "Sản phẩm không tồn tại"
            };
        }

        // Tăng lượt xem
        product.views += 1;

        // Thêm vào danh sách đã xem (nếu chưa có)
        const existingView = product.viewedBy.find(view => view.userId.toString() === userId);
        if (!existingView) {
            product.viewedBy.push({
                userId: userId,
                viewedAt: new Date()
            });
        } else {
            // Cập nhật thời gian xem
            existingView.viewedAt = new Date();
        }

        await product.save();

        return {
            success: true,
            message: "Đã cập nhật lượt xem sản phẩm",
            data: product
        };
    } catch (error) {
        console.error("Error updating product view:", error);
        return {
            success: false,
            message: "Lỗi khi cập nhật lượt xem sản phẩm",
            error: error.message
        };
    }
};

/**
 * Lấy danh sách sản phẩm đã xem của người dùng
 * @param {string} userId - ID của người dùng
 * @param {number} page - Số trang hiện tại
 * @param {number} limit - Số sản phẩm trên mỗi trang
 * @returns {Object} - Danh sách sản phẩm đã xem
 */
const getViewedProductsService = async (userId, page = 1, limit = 10) => {
    try {
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Tìm sản phẩm có userId trong danh sách viewedBy
        const products = await Product.find({ 'viewedBy.userId': userId })
            .skip(skip)
            .limit(limitNumber)
            .sort({ 'viewedBy.viewedAt': -1 });

        const totalProducts = await Product.countDocuments({ 'viewedBy.userId': userId });
        const totalPages = Math.ceil(totalProducts / limitNumber);

        return {
            success: true,
            data: {
                products,
                pagination: {
                    total: totalProducts,
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages
                }
            }
        };
    } catch (error) {
        console.error("Error fetching viewed products:", error);
        return {
            success: false,
            message: "Lỗi khi lấy danh sách sản phẩm đã xem",
            error: error.message
        };
    }
};

/**
 * Tăng số lượng khách mua
 * @param {string} productId - ID của sản phẩm
 * @returns {Object} - Kết quả cập nhật
 */
const incrementPurchaseCountService = async (productId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return {
                success: false,
                message: "Sản phẩm không tồn tại"
            };
        }

        product.purchaseCount += 1;
        await product.save();

        return {
            success: true,
            message: "Đã cập nhật số lượng khách mua",
            data: product
        };
    } catch (error) {
        console.error("Error incrementing purchase count:", error);
        return {
            success: false,
            message: "Lỗi khi cập nhật số lượng khách mua",
            error: error.message
        };
    }
};

/**
 * Tăng số lượng bình luận
 * @param {string} productId - ID của sản phẩm
 * @returns {Object} - Kết quả cập nhật
 */
const incrementCommentCountService = async (productId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return {
                success: false,
                message: "Sản phẩm không tồn tại"
            };
        }

        product.commentCount += 1;
        await product.save();

        return {
            success: true,
            message: "Đã cập nhật số lượng bình luận",
            data: product
        };
    } catch (error) {
        console.error("Error incrementing comment count:", error);
        return {
            success: false,
            message: "Lỗi khi cập nhật số lượng bình luận",
            error: error.message
        };
    }
};

/**
 * Cập nhật các số đếm của sản phẩm
 * @param {string} productId - ID của sản phẩm
 * @param {Object} counts - Object chứa các số đếm cần cập nhật
 * @returns {Object} - Kết quả cập nhật
 */
const updateProductCountsService = async (productId, counts) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return {
                success: false,
                message: "Sản phẩm không tồn tại"
            };
        }

        // Cập nhật các số đếm
        if (counts.views !== undefined) product.views = counts.views;
        if (counts.purchaseCount !== undefined) product.purchaseCount = counts.purchaseCount;
        if (counts.commentCount !== undefined) product.commentCount = counts.commentCount;

        await product.save();

        return {
            success: true,
            message: "Đã cập nhật số đếm sản phẩm",
            data: product
        };
    } catch (error) {
        console.error("Error updating product counts:", error);
        return {
            success: false,
            message: "Lỗi khi cập nhật số đếm sản phẩm",
            error: error.message
        };
    }
};

module.exports = {
    // getProductsByCategoryService,
    getAllCategoriesService,
    // fuzzySearchProducts,
    getProductsService,
    // filterProducts
    // Các chức năng mới
    addToFavoritesService,
    removeFromFavoritesService,
    getFavoriteProductsService,
    updateSimilarProductsService,
    getSimilarProductsService,
    updateProductViewService,
    getViewedProductsService,
    updateProductCountsService,
    incrementPurchaseCountService,
    incrementCommentCountService
};