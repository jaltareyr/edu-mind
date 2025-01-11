const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { genQuiz } = require('../controllers/genController');
const router = express.Router();

// Apply authMiddleware to all routes
// router.use(authMiddleware);

router.post('/genquiz', genQuiz);
// router.post('/gentasks', genTasks);


module.exports = router;