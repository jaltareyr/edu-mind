const { jwtVerify } = require("jose");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.session;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const secretKey = process.env.JWT_SECRET;
        const encodedKey = new TextEncoder().encode(secretKey);

        const { payload } = await jwtVerify(token, encodedKey, {
            algorithms: ["HS256"],
        });

        req.user = payload;

        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = authMiddleware;