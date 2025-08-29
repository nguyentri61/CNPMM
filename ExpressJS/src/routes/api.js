const express = require('express');
const { createUser, handleLogin, getUser,
    getAccount }
    = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const router = express.Router();

router.use(auth);

router.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello wordddddd!"
    });
});

router.post("/register", createUser);
router.post("/login", handleLogin);
router.get("/get-user", getUser);
router.get("/account", delay, getAccount);

module.exports = router;    