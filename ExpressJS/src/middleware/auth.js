require("dotenv").config();

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const white_lists = ["/", "/register", "/login"];
    const path = req.originalUrl.replace(/\/+$/, ""); // remove trailing slash

    if (white_lists.some(item => '/v1/api' + item === path)) {
        return next();
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token malformed" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user0 = { email: decoded.email, name: decoded.name };
        console.log(">>> check token", decoded);
        next();
    } catch (err) {
        console.log(">>> Error verify token:", err);
        return res.status(401).json({ message: "Invalid token" });
    }
};



module.exports = auth;