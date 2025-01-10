express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getMaterialById, uploadMaterial, getMaterialsByCourseId, getMaterialsByModuleId, deleteMaterial, chunkifyMaterial } = require('../controllers/materialController');
const { uploadMiddleware, uploadToGitHub } = require("../middlewares/multerMiddleware");
const router = express.Router();

// Apply authMiddleware to all routes
router.use(authMiddleware);

router.get("/getById", getMaterialById);
router.get("/getByCourseId", getMaterialsByCourseId);
router.get("/getByModuleId", getMaterialsByModuleId);
router.post("/upload", uploadMiddleware, uploadToGitHub, uploadMaterial);
router.post("/delete", deleteMaterial)
router.post("/chunkify", chunkifyMaterial)

module.exports = router;