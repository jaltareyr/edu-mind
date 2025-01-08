const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getCourses, getCourseById, createCourse, updateModuleId, deleteCourse } = require('../controllers/courseController');
const router = express.Router();

// Apply authMiddleware to all routes
router.use(authMiddleware);

router.get('/get', getCourses); //GET http://localhost:5000/api/course/get
router.get('/getById', getCourseById); //GET http://localhost:5000/api/course/getById?id=courseId
router.post('/create', createCourse); //POST http://localhost:5000/api/course/create
router.patch('/updateModuleId', updateModuleId); //PATCH http://localhost:5000/api/course/updateModuleId
router.delete('/:id', deleteCourse); //DELETE http://localhost:5000/api/course/:id

module.exports = router;