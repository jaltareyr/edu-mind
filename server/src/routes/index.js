const express = require("express");
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const courseRoutes = require("./courseRoutes");
const moduleRoutes = require("./moduleRoutes");
const materialRoutes = require("./materialRoutes");
const generateRoutes = require("./generateRoutes");
const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/course", courseRoutes);
router.use("/module", moduleRoutes);
router.use("/material", materialRoutes);
router.use("/generate", generateRoutes);
// router.use("/assignments", assignmentRouter);
// router.use("/quizzes", quizzesRouter);

module.exports = router;
