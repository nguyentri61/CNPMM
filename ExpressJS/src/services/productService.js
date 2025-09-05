const Product = require("../models/Product");

/**
 * Lấy danh sách sản phẩm theo danh mục với phân trang
 * @param {string} category - Danh mục sản phẩm
 * @param {number} page - Số trang hiện tại
 * @param {number} limit - Số sản phẩm trên mỗi trang
 * @returns {Object} - Kết quả bao gồm danh sách sản phẩm và thông tin phân trang
 */
const getProductsByCategoryService = async (category, page = 1, limit = 10) => {
    try {
        // Chuyển đổi tham số sang số
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        
        // Tính toán số lượng sản phẩm cần bỏ qua
        const skip = (pageNumber - 1) * limitNumber;
        
        // Tìm kiếm sản phẩm theo danh mục
        let query = {};
        if (category && category !== 'all') {
            query.category = category;
        }
        
        // Thực hiện truy vấn với phân trang
        const products = await Product.find(query)
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất
        
        // Đếm tổng số sản phẩm thỏa mãn điều kiện
        const totalProducts = await Product.countDocuments(query);
        
        // Tính toán tổng số trang
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
        console.error("Error fetching products by category:", error);
        return {
            success: false,
            message: "Error fetching products",
            error: error.message
        };
    }
};

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

module.exports = {
    getProductsByCategoryService,
    getAllCategoriesService
};