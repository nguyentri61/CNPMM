const express = require('express');
const { createUser, handleLogin, getUser,
    getAccount }
    = require('../controllers/userController');
const { getProductsByCategory, getAllCategories, fuzzySearch, filter } = require('../controllers/productController');
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



// Product routes
router.get("/products", getProductsByCategory);
router.get("/categories", getAllCategories);

// Fuzzy Search & Filter
router.get("/search", fuzzySearch);
router.get("/filter", filter);

router.use(auth);
router.get("/get-user", getUser);
router.get("/account", delay, getAccount);

module.exports = router;