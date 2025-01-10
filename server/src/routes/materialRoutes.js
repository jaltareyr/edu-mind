express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getMaterialById, uploadMaterial, getMaterialsByCourseId, getMaterialsByModuleId, deleteMaterial } = require('../controllers/materialController');
const multer = require('multer');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Apply authMiddleware to all routes
router.use(authMiddleware);

router.get("/getById", getMaterialById);
router.get("/getByCourseId", getMaterialsByCourseId);
router.get("/getByModuleId", getMaterialsByModuleId);
router.post("/upload", upload.single('file'), uploadMaterial);
router.route("/:fileId", deleteMaterial)

module.exports = router;