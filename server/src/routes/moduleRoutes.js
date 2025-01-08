const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getByCourseId, getById, create, deleteModule } = require('../controllers/moduleController');
const router = express.Router();

// Apply authMiddleware to all routes
router.use(authMiddleware);

// Define routes
router.get("/getByCourseId", getByCourseId); // GET http://localhost:5000/api/module/getByCourseId?courseId=courseId
router.get("/getById", getById); // GET http://localhost:5000/api/module/getById?id=moduleId
router.post("/create", create); // POST http://localhost:5000/api/module/create
router.delete("/:id", deleteModule); // DELETE http://localhost:5000/api/module/:id

module.exports = router;