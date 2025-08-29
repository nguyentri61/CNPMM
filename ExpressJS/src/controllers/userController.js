const { createUserService, loginService, getUserService } = require('../services/userService'); require('../services/userService');

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await createUserService(name, email, password);
    return res.status(201).json(user);
};

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    return res.status(200).json(data);
}

const getUser = async (req, res) => {
    const user = await getUserService();
    return res.status(200).json(user);
}

const getAccount = async (req, res) => {
    return res.status(200).json(req.user);
}

module.exports = {
    createUser,
    handleLogin,
    getUser,
    getAccount
};