const express = require('express');
const coursesController = require('../controllers/courses.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/get', authMiddleware, coursesController.get);
router.get('/getById', authMiddleware, coursesController.getById);
router.post('/create', authMiddleware, coursesController.create);
router.delete('/:id', authMiddleware, coursesController.delete);
router.patch('/updateModuleId/:courseId', authMiddleware, coursesController.updateModuleId);

module.exports = router;