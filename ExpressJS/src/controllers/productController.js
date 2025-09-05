const { getProductsByCategoryService, getAllCategoriesService } = require('../services/productService');

/**
 * Lấy danh sách sản phẩm theo danh mục với phân trang
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getProductsByCategory = async (req, res) => {
    try {
        const { category = 'all', page = 1, limit = 10 } = req.query;
        
        const result = await getProductsByCategoryService(category, page, limit);
        
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error in getProductsByCategory controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

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

module.exports = {
    getProductsByCategory,
    getAllCategories
};