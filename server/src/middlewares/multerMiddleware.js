const multer = require("multer");
const moment = require("moment");

let Octokit; // Placeholder for the dynamically imported module

(async () => {
  const { Octokit: ImportedOctokit } = await import("@octokit/rest");
  Octokit = ImportedOctokit;
})();

// Wait for Octokit to be initialized
const getOctokitInstance = () => {
  if (!Octokit) {
    throw new Error(
      "Octokit has not been initialized yet. Ensure it is imported dynamically.",
    );
  }

  return new Octokit({
    auth: process.env.GITHUB_TOKEN, // Your GitHub personal access token from the .env file
  });
};

// Multer Storage Configuration
const storage = multer.memoryStorage(); // Store files in memory buffer

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["text/plain", "application/pdf", "application/msword"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error(
        "Invalid file type. Allowed file types are .txt, .pdf, and .doc",
      ),
    );
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
  fileFilter,
});

// Function to Upload File to GitHub
const uploadFileToGitHub = async (file) => {
  const octokit = getOctokitInstance();
  const timestamp = moment().format("YYYYMMDDHHmmss");
  const fileName = `uploaded_file_${timestamp}${file.originalname}`;
  const filePath = `uploads/${fileName}`; // Path in the GitHub repository

  // Convert the file buffer to Base64
  const fileContent = file.buffer.toString("base64");

  // Create or update the file in GitHub
  const response = await octokit.repos.createOrUpdateFileContents({
    owner: process.env.GITHUB_USER, // Replace with your GitHub username
    repo: process.env.REPO, // Replace with your repository name
    path: filePath,
    message: `Upload ${fileName}`, // Commit message
    content: fileContent,
    branch: process.env.BRANCH, // Replace with your branch name
  });

  return response.data.content.html_url; // URL of the uploaded file
};

// Middleware for Uploading Files
const uploadToGitHub = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Upload the file to GitHub
    const fileUrl = await uploadFileToGitHub(req.file);

    // Pass the file URL to the next middleware or response
    req.fileUrl = fileUrl;
    next();
  } catch (error) {
    console.error("Error uploading file to GitHub:", error.message);
    res.status(500).json({ error: "Failed to upload file to GitHub" });
  }
};

// Export the Multer middleware and GitHub upload middleware
const uploadMiddleware = upload.single("file");

module.exports = { uploadMiddleware, uploadToGitHub };
