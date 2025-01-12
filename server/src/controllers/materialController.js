const fs = require('fs');
const { HfInference } = require('@huggingface/inference');
const Material = require('../models/materialModel');
const Chunk = require('../models/chunkModel');
const path = require("path");
const pdfParse = require("pdf-parse");
const textract = require("textract");

let Octokit;

const hf = new HfInference(process.env.HUGGINGFACE_KEY);

(async () => {
    const { Octokit: ImportedOctokit } = await import("@octokit/rest");
    Octokit = ImportedOctokit;
  })();
  
  const getOctokitInstance = () => {
    if (!Octokit) {
      throw new Error("Octokit has not been initialized yet. Ensure it is imported dynamically.");
    }
  
    return new Octokit({
      auth: process.env.GITHUB_TOKEN, // Your GitHub personal access token
    });
  };

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

        const materials = await Material.find({ courseId, userId: req.user });
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

        const materials = await Material.find({ moduleId, userId: req.user });
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
        const userId = req.user;

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
      const { fileId, fileURL } = req.body;
  
      if (!fileId || !fileURL) {
        return res.status(400).json({ message: "Missing required parameters: fileId or fileURL." });
      }
  
      // Extract the relative file path
      const sanitizedPath = fileURL.split('/blob/main/')[1];
      if (!sanitizedPath) {
        return res.status(400).json({ message: "Invalid fileURL format." });
      }
      const decodedPath = decodeURIComponent(sanitizedPath);
  
      const octokit = getOctokitInstance();
  
      // Step 1: Fetch the file metadata to get the sha
      let fileSha;

      try {
        const { data } = await octokit.repos.getContent({
          owner: process.env.GITHUB_USER,
          repo: process.env.REPO,
          path: decodedPath,
          ref: process.env.BRANCH, // Optional, specify the branch if needed
        });
        fileSha = data.sha;
      } catch (metadataError) {
        console.error("Error fetching file metadata:", metadataError.message);
        return res.status(404).json({
          message: "Failed to fetch file metadata from GitHub. File may not exist.",
          error: metadataError.message,
        });
      }
  
      // Step 2: Delete the file from GitHub
      try {
        const response = await octokit.request(`DELETE /repos/${process.env.GITHUB_USER}/${process.env.REPO}/contents/${sanitizedPath}`,{
          owner: process.env.GITHUB_USER,
          repo: process.env.REPO,
          path: sanitizedPath, // Path to the file in the repository
          message: `Deleting ${fileId}`,
          branch: process.env.BRANCH, // Branch to delete from
          sha: fileSha, // SHA retrieved from getContent
        });
      
        console.log("GitHub file deleted successfully:", response.status);
      } catch (githubError) {
        console.error("Error deleting file from GitHub:", githubError.response?.data || githubError.message);
        throw githubError;
      }
  
      // Step 3: Delete the material record from MongoDB
      try {
        const deletedMaterial = await Material.findOneAndDelete({ _id: fileId, userId: req.user });
        if (!deletedMaterial) {
          return res.status(404).json({ message: "Material not found or unauthorized access." });
        }
      } catch (dbError) {
        console.error("Error deleting material from MongoDB:", dbError.message);
        return res.status(500).json({ message: "Failed to delete material from database.", error: dbError.message });
      }
  
      // Step 4: Send success response
      res.status(200).json({ message: "Material and file deleted successfully." });
    } catch (error) {
      console.error("Unexpected error in deleteMaterial:", error.message);
      res.status(500).json({ message: "An unexpected error occurred.", error: error.message });
      next(error);
    }
};

const chunkifyMaterial = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "Document ID is required" });
        }

        // Fetch the material from the database
        const material = await Material.findById(id);
        if (!material) {
            return res.status(404).json({ error: "Material not found" });
        }

        const filePath = material.filePath; // This is the GitHub URL of the file
        if (!filePath) {
            return res.status(400).json({ error: "No filePath provided in material" });
        }

        // Step 1: Fetch the file from GitHub
        const octokit = getOctokitInstance();
        const sanitizedPath = filePath.split("/blob/main/")[1];
        if (!sanitizedPath) {
            return res.status(400).json({ error: "Invalid GitHub file path" });
        }

        const { data: fileContent } = await octokit.request(
            `GET /repos/${process.env.GITHUB_USER}/${process.env.REPO}/contents/${sanitizedPath}`,
            {
                owner: process.env.GITHUB_USER,
                repo: process.env.REPO,
                path: filePath,
                ref: process.env.BRANCH,
            }
        );

        const fileBuffer = Buffer.from(fileContent.content, "base64");

        const decodedPath = decodeURIComponent(sanitizedPath);

        // Step 2: Save the file locally
        const localFilePath = path.join(__dirname, "../temp", path.basename(decodedPath));
        fs.writeFileSync(localFilePath, fileBuffer);

        // Step 3: Extract text
        const fileExtension = path.extname(localFilePath).toLowerCase();
        let extractedText = "";

        if (fileExtension === ".pdf") {
            // Extract text from PDF
            const fileData = fs.readFileSync(localFilePath);
            const pdfData = await pdfParse(fileData);
            extractedText = pdfData.text;
        } else if ([".doc", ".docx", ".ppt", ".pptx", ".txt"].includes(fileExtension)) {
            // Extract text from Word, PowerPoint, or plain text
            extractedText = await new Promise((resolve, reject) => {
                textract.fromFileWithPath(localFilePath, (error, text) => {
                    if (error) reject(error);
                    else resolve(text);
                });
            });
        } else {
            fs.unlinkSync(localFilePath); // Cleanup local file
            return res.status(400).json({ error: "Unsupported file type" });
        }

        // Step 4: Cleanup local file
        fs.unlinkSync(localFilePath);

        // Step 5: Chunk the text into paragraphs of ~80 words
        const chunks = [];
        const sentences = extractedText.match(/[^.!?]+[.!?]+/g) || [];

        let currentChunk = [];
        let currentWordCount = 0;

        for (const sentence of sentences) {
            const wordCount = sentence.trim().split(/\s+/).length;

            if (currentWordCount + wordCount > 80) {
                // Add the current chunk to the chunks array
                chunks.push(currentChunk.join(" ").trim());
                currentChunk = [];
                currentWordCount = 0;
            }

            currentChunk.push(sentence.trim());
            currentWordCount += wordCount;
        }

        // Add the last chunk if it has content
        if (currentChunk.length > 0) {
            chunks.push(currentChunk.join(" ").trim());
        }

        // Step 6: Store chunks in the database
        const userId = req.user; // Assuming user ID is available in the request
        for (const chunk of chunks) {
            await Chunk.create({
                materialId: material._id,
                chunk: chunk,
                userId: userId,
            });
        }

        // Step 7: Return a success response
        res.status(200).json({
            message: "Chunks created and stored successfully",
            totalChunks: chunks.length,
        });
    } catch (error) {
        console.error("Error processing material:", error);
        res.status(500).json({ error: "Internal server error", error });
    }
};
  
module.exports = { getMaterialById, getMaterialsByCourseId, getMaterialsByModuleId, uploadMaterial, deleteMaterial, chunkifyMaterial };