require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { name } = require("ejs");
const e = require("express");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { success: false, message: "User already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: "user"
        });

        await newUser.save();
        return { success: true, message: "User created successfully" };

    }
    catch (error) {
        console.error("Error creating user:", error);
        return { success: false, message: "Error creating user" };
    }
}

const loginService = async (email, password) => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log("User not found with email:", email);
            return {
                EC: 1,
                EM: "User not found"
            };
        }
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (user) {
            if (!isMatchPassword) {
                return {
                    EC: 2,
                    EM: "Email or password is incorrect"
                };
            }
            else {
                const payload =
                {
                    email: user.email,
                    name: user.name,
                }

                const accessToken = jwt.sign(payload,
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    }
                );

                return {
                    EC: 0,
                    accessToken,
                    user:
                    {
                        email: user.email,
                        name: user.name
                    }
                };
            }
        }
        else {
            return {
                EC: 1,
                EM: "User not found"
            };
        }

    }
    catch (error) {
        console.error("Error during login:", error);
        return { success: false, message: "Error during login" };
    }
}

const getUserSevice = async () => {
    try {
        let results = await User.find({}).select('-password');
        return results;
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return null;
    }
}

module.exports = { createUserService, loginService, getUserSevice };