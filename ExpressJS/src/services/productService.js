const Product = require("../models/Product");
const Fuse = require("fuse.js");

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

        // Nếu có search thì dùng Fuse lọc thêm
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

module.exports = {
    // getProductsByCategoryService,
    getAllCategoriesService,
    // fuzzySearchProducts,
    getProductsService
    // filterProducts
};