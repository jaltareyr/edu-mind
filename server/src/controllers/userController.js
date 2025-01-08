const User = require('../models/userModel');

class UserController {
    // Get all users
    async get(req, res, next) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            return next(error);
        }
    }

    // Create a new user
    async create(req, res, next) {
        try {
            const user = await User.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = new UserController();