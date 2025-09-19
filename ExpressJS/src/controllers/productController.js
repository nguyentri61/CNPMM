const { 
    getProductsByCategoryService, 
    getAllCategoriesService, 
    fuzzySearchProducts, 
    filterProducts, 
    getProductsService,
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
} = require('../services/productService');

// /**
//  * Lấy danh sách sản phẩm theo danh mục với phân trang
//  * @param {Object} req - Request object
//  * @param {Object} res - Response object
//  */
// const getProductsByCategory = async (req, res) => {
//     try {
//         const { category = 'all', page = 1, limit = 10 } = req.query;

//         const result = await getProductsByCategoryService(category, page, limit);

//         if (result.success) {
//             return res.status(200).json(result);
//         } else {
//             return res.status(400).json(result);
//         }
//     } catch (error) {
//         console.error("Error in getProductsByCategory controller:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message
//         });
//     }
// };

/**
 * Lấy danh sách tất cả các danh mục sản phẩm
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getAllCategories = async (req, res) => {
    try {
        const result = await getAllCategoriesService();

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error in getAllCategories controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Fuzzy search controller
const fuzzySearch = async (req, res) => {
    try {
        const { search } = req.query;
        if (!search) {
            return res.status(400).json({ error: "Thiếu từ khóa search" });
        }

        const products = await fuzzySearchProducts(search);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, ...filters } = req.query;

        const result = await getProductsService(filters, page, limit);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error in getProducts controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// // Filter controller
// const filter = async (req, res) => {
//     try {
//         const products = await filterProducts(req.query);
//         res.json(products);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// }

/**
 * Thêm sản phẩm vào danh sách yêu thích
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const addToFavorites = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const result = await addToFavoritesService(productId, userId);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error in addToFavorites controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Xóa sản phẩm khỏi danh sách yêu thích
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const removeFromFavorites = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const result = await removeFromFavoritesService(productId, userId);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error in removeFromFavorites controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Lấy danh sách sản phẩm yêu thích
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getFavoriteProducts = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const result = await getFavoriteProductsService(userId, page, limit);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error in getFavoriteProducts controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Cập nhật danh sách sản phẩm tương tự
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateSimilarProducts = async (req, res) => {
    try {
        const { productId } = req.params;

        const result = await updateSimilarProductsService(productId);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error in updateSimilarProducts controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Lấy danh sách sản phẩm tương tự
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getSimilarProducts = async (req, res) => {
    try {
        const { productId } = req.params;

        const result = await getSimilarProductsService(productId);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error in getSimilarProducts controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Cập nhật lượt xem sản phẩm
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateProductView = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const result = await updateProductViewService(productId, userId);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error in updateProductView controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Lấy danh sách sản phẩm đã xem
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getViewedProducts = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const result = await getViewedProductsService(userId, page, limit);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error in getViewedProducts controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Tăng số lượng khách mua
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const incrementPurchaseCount = async (req, res) => {
    try {
        const { productId } = req.params;

        const result = await incrementPurchaseCountService(productId);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error in incrementPurchaseCount controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Tăng số lượng bình luận
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const incrementCommentCount = async (req, res) => {
    try {
        const { productId } = req.params;

        const result = await incrementCommentCountService(productId);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error in incrementCommentCount controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Cập nhật các số đếm của sản phẩm
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateProductCounts = async (req, res) => {
    try {
        const { productId } = req.params;
        const counts = req.body;

        const result = await updateProductCountsService(productId, counts);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error in updateProductCounts controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    // getProductsByCategory,
    getProducts,
    getAllCategories,
    fuzzySearch,
    // filter
    // Các chức năng mới
    addToFavorites,
    removeFromFavorites,
    getFavoriteProducts,
    updateSimilarProducts,
    getSimilarProducts,
    updateProductView,
    getViewedProducts,
    incrementPurchaseCount,
    incrementCommentCount,
    updateProductCounts
};