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

    const extractTextFromFile = async (filePath, mimeType) => {
        try {
            if (mimeType === 'application/pdf') {
                const dataBuffer = fs.readFileSync(filePath);
                const pdfData = await pdfParse(dataBuffer);
                return pdfData.text;
            } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const dataBuffer = fs.readFileSync(filePath);
                const result = await mammoth.extractRawText({ buffer: dataBuffer });
                return result.value;
            } else if (mimeType === 'text/plain') {
                return fs.readFileSync(filePath, 'utf-8');
            } else {
                console.warn(`Unsupported file type: ${mimeType}`);
                return null;
            }
        } catch (error) {
            console.error("Error extracting text from file:", error);
            return null;
        }
    };

    const chunkTextWithRules = (text, maxChunkSize) => {
        const sentences = text.match(/[^.!?]+[.!?]*/g) || []; // Tokenize text into sentences
        const chunks = [];
        let currentChunk = "";
    
        for (const sentence of sentences) {
            // Check if adding this sentence exceeds the chunk size
            if (currentChunk.length + sentence.length <= maxChunkSize) {
                currentChunk += sentence; // Add sentence to the current chunk
            } else {
                // Push the current chunk and start a new one
                if (currentChunk.trim().length > 0) {
                    chunks.push(currentChunk.trim());
                }
                currentChunk = sentence; // Start new chunk with the current sentence
            }
        }
        // Add the last chunk if it has content
        if (currentChunk.trim().length > 0) {
            chunks.push(currentChunk.trim());
        }
        return chunks;
    };

    try {

        if (!req.file) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const { courseId } = req.body;
        const userId = req.user.userId;
        const uploadedMaterials = [];
        file = req.file
        const { originalname, mimetype, size, path: filePath } = file;

        const newMaterial = await Material.create({
            name: originalname,
            filePath: filePath,
            mimeType: mimetype,
            fileSize: size,
            courseId,
            userId,
        });

        uploadedMaterials.push({
            _id: newMaterial._id,
            name: newMaterial.name,
            mimeType: newMaterial.mimeType,
            fileSize: newMaterial.fileSize,
            courseId: newMaterial.courseId,
            userId: newMaterial.userId,
        });

        //2. Extract text from the file
        const fileContents = file.buffer.toString();
        if (!fileContents) {
            console.error(`Failed to extract text from file: ${originalname}`);
        }

        console.log(fileContents);

            // // 3. Chunk the text
            // const chunkSize = 500; // Define max chunk size
            // const chunks = chunkTextWithRules(textData, chunkSize);

            // for (const chunkText of chunks) {
            //     // Save the chunk in ChunksModel
            //     await Chunk.create({
            //         materialId: newMaterial._id,
            //         chunkText,
            //         userId: req.user.userId,
            //     });
            // }

        res.status(201).json({
            message: "Files uploaded and processed successfully",
            materials: uploadedMaterials,
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