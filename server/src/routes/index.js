const express = require('express');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const courseRoutes = require('./courseRoutes');
const moduleRoutes = require('./moduleRoutes');
const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use("/course", courseRoutes);
router.use("/module", moduleRoutes);
// router.use("/materials", materialRouter);
// router.use("/assignments", assignmentRouter);
// router.use("/quizzes", quizzesRouter);

module.exports = router;