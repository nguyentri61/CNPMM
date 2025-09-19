import axios from "./axios.customize";

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = { name, email, password };
    return axios.post(URL_API, data);
}

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = { email, password };
    return axios.post(URL_API, data);
}

const getUserApi = () => {
    const URL_API = "/v1/api/get-user";
    return axios.get(URL_API);
}

// const getProductsByCategoryApi = (category = 'all', page = 1, limit = 10) => {
//     const URL_API = `/v1/api/products?category=${category}&page=${page}&limit=${limit}`;
//     return axios.get(URL_API);
// }

const getAllCategoriesApi = () => {
    const URL_API = "/v1/api/categories";
    return axios.get(URL_API);
}

const getProductsApi = (params = {}) => {
    return axios.get("/v1/api/products", { params });
};

// /**
//  * Fuzzy Search API
//  * @param {string} keyword - từ khóa cần tìm
//  */
// const fuzzySearchApi = (keyword) => {
//     const URL_API = `/v1/api/search?search=${encodeURIComponent(keyword)}`;
//     return axios.get(URL_API);
// }

// /**
//  * Filter API
//  * @param {object} filters - các điều kiện lọc, ví dụ { category: 'shoes', priceMin: 100, priceMax: 500 }
//  */
// const filterApi = (filters) => {
//     const queryString = new URLSearchParams(filters).toString();
//     const URL_API = `/v1/api/filter?${queryString}`;
//     return axios.get(URL_API);
// }

// Product Favorites APIs
const addToFavoritesApi = (productId) => {
    const URL_API = `/v1/api/products/${productId}/favorite`;
    return axios.post(URL_API);
};

const removeFromFavoritesApi = (productId) => {
    const URL_API = `/v1/api/products/${productId}/favorite`;
    return axios.delete(URL_API);
};

const getFavoriteProductsApi = (page = 1, limit = 10) => {
    const URL_API = `/v1/api/products/favorites?page=${page}&limit=${limit}`;
    return axios.get(URL_API);
};

// Product Similar APIs
const getSimilarProductsApi = (productId) => {
    const URL_API = `/v1/api/products/${productId}/similar`;
    return axios.get(URL_API);
};

const updateSimilarProductsApi = (productId) => {
    const URL_API = `/v1/api/products/${productId}/similar/update`;
    return axios.post(URL_API);
};

// Product View APIs
const updateProductViewApi = (productId) => {
    const URL_API = `/v1/api/products/${productId}/view`;
    return axios.get(URL_API);
};

const getViewedProductsApi = (page = 1, limit = 10) => {
    const URL_API = `/v1/api/products/viewed?page=${page}&limit=${limit}`;
    return axios.get(URL_API);
};

// Product Count APIs
const incrementPurchaseCountApi = (productId) => {
    const URL_API = `/v1/api/products/${productId}/purchase`;
    return axios.post(URL_API);
};

const incrementCommentCountApi = (productId) => {
    const URL_API = `/v1/api/products/${productId}/comment`;
    return axios.post(URL_API);
};

const updateProductCountsApi = (productId, counts) => {
    const URL_API = `/v1/api/products/${productId}/counts`;
    return axios.put(URL_API, counts);
};

export { 
    createUserApi, 
    loginApi, 
    getUserApi, 
    getProductsApi, 
    getAllCategoriesApi,
    // Favorites
    addToFavoritesApi,
    removeFromFavoritesApi,
    getFavoriteProductsApi,
    // Similar Products
    getSimilarProductsApi,
    updateSimilarProductsApi,
    // Product Views
    updateProductViewApi,
    getViewedProductsApi,
    // Product Counts
    incrementPurchaseCountApi,
    incrementCommentCountApi,
    updateProductCountsApi
};