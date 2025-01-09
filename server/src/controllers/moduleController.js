const moduleModel = require("../models/moduleModel");

// Get modules by course ID
const getByCourseId = async (req, res, next) => {
    try {
        const { courseId } = req.query;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        const modules = await moduleModel.find({ courseId });

        if (!modules || modules.length === 0) {
            return res.status(200).json([]); // No modules found, return empty array
        }

        res.status(200).json(modules);
    } catch (error) {
        next(error);
    }
};

// Get module by ID
const getById = async (req, res, next) => {
    try {
        const module = await moduleModel.findById(req.query.id);

        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        res.status(200).json(module);
    } catch (error) {
        next(error);
    }
};

// Create a new module
const create = async (req, res, next) => {
    try {
        const { name, courseId } = req.body;

        if (!name || !courseId) {
            return res.status(400).json({ message: "Name and Course ID are required" });
        }

        const module = new moduleModel({
            name,
            courseId,
            userId: req.user.userId, // Assuming `authMiddleware` attaches user info to req.user
        });

        const savedModule = await module.save();
        res.status(201).json(savedModule);
    } catch (error) {
        next(error);
    }
};

// Delete a module by ID
const deleteModule = async (req, res, next) => {
    try {
        const moduleId = req.params.id;

        if (!moduleId) {
            return res.status(400).json({ message: "Module ID is required" });
        }

        const deletedModule = await moduleModel.findByIdAndDelete(moduleId);

        if (!deletedModule) {
            return res.status(404).json({ message: "Module not found" });
        }

        res.status(200).json({ message: "Module deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = { getByCourseId, getById, create, deleteModule };