const express = require('express');
const { createUser, handleLogin, getUser,
    getAccount }
    = require('../controllers/userController');
const { 
    getProductsByCategory, 
    getAllCategories, 
    fuzzySearch, 
    filter, 
    getProducts,
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
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello wordddddd!"
    });
});

router.post("/register", createUser);
router.post("/login", handleLogin);



// Product routes (public)
router.get("/products", getProducts);
router.get("/categories", getAllCategories);
router.get("/products/:productId/similar", getSimilarProducts);
router.get("/products/:productId/view", updateProductView);

// Fuzzy Search & Filter
// router.get("/search", fuzzySearch);
// router.get("/filter", filter);

// Protected routes (require authentication)
router.use(auth);
router.get("/get-user", getUser);
router.get("/account", delay, getAccount);

// Product favorites routes
router.post("/products/:productId/favorite", addToFavorites);
router.delete("/products/:productId/favorite", removeFromFavorites);
router.get("/products/favorites", getFavoriteProducts);

// Product viewed routes
router.get("/products/viewed", getViewedProducts);

// Product counts routes
router.post("/products/:productId/purchase", incrementPurchaseCount);
router.post("/products/:productId/comment", incrementCommentCount);
router.put("/products/:productId/counts", updateProductCounts);

// Product similar products management
router.post("/products/:productId/similar/update", updateSimilarProducts);

module.exports = router;