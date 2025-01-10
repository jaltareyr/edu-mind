const fs = require('fs');
const { HfInference } = require('@huggingface/inference');
const Material = require('../models/materialModel');
const Chunk = require('../models/chunkModel');

const hf = new HfInference(process.env.HUGGINGFACE_KEY);

// Get material by ID
const getMaterialById = async (req, res, next) => {
    try {
        const { _id } = req.query;
        if (!_id) {
            return res.status(400).json({ error: "Material ID is required", _id });
        }

        const material = await Material.findById(_id);
        if (!material) {
            console.log("No material found for the given ID");
            return res.status(200).json([]);
        }

        res.status(200).json(material);
    } catch (error) {
        next(error);
    }
};

// Get materials by course ID
const getMaterialsByCourseId = async (req, res, next) => {
    try {
        const { courseId } = req.query;
        if (!courseId) {
            return res.status(400).json({ error: "Course ID is required", courseId });
        }

        const materials = await Material.find({ courseId, userId: req.user.userId });
        if (!materials || materials.length === 0) {
            console.log("No material found for the given course ID");
            return res.status(200).json([]);
        }

        res.status(200).json(materials);
    } catch (error) {
        next(error);
    }
};

// Get materials by module ID
const getMaterialsByModuleId = async (req, res, next) => {
    try {
        const { moduleId } = req.query;
        if (!moduleId) {
            return res.status(400).json({ error: "Module ID is required", moduleId });
        }

        const materials = await Material.find({ moduleId, userId: req.user.userId });
        if (!materials || materials.length === 0) {
            console.log("No material found for the given module ID");
            return res.status(200).json([]);
        }

        res.status(200).json(materials);
    } catch (error) {
        next(error);
    }
};

// Upload a new material
const uploadMaterial = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const { courseId } = req.body;
        const userId = req.user.userId;

        const file = req.file;
        const { originalname, mimetype, size } = file;

        // Assume `req.fileUrl` contains the GitHub URL of the uploaded file
        const fileUrl = req.fileUrl;

        // Save the file details, including the GitHub URL, in MongoDB
        const newMaterial = await Material.create({
            name: originalname,
            filePath: fileUrl, // Save the GitHub file URL
            mimeType: mimetype,
            fileSize: size,
            courseId,
            userId,
        });

        res.status(201).json({
            message: "File uploaded and saved successfully",
            material: {
                _id: newMaterial._id,
                name: newMaterial.name,
                filePath: newMaterial.filePath, // GitHub file URL
                mimeType: newMaterial.mimeType,
                fileSize: newMaterial.fileSize,
                courseId: newMaterial.courseId,
                userId: newMaterial.userId,
            },
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        next(error);
    }
};

// Delete a material
const deleteMaterial = async (req, res, next) => {
    try {
        const materialId = req.params.fileId;

        const deletedMaterial = await Material.findOneAndDelete({ _id: materialId, userId: req.user.userId });
        if (!deletedMaterial) {
            return res.status(404).json({ message: "Material not found" });
        }

        res.status(200).json({ message: "Material deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = { getMaterialById, getMaterialsByCourseId, getMaterialsByModuleId, uploadMaterial, deleteMaterial };