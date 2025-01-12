const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getCourses,
  getCourseById,
  createCourse,
  updateModuleId,
  deleteCourse,
  editCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.use(authMiddleware);

router.get("/get", getCourses);
router.get("/getById", getCourseById);
router.post("/create", createCourse);
router.patch("/updateModuleId", updateModuleId);
router.delete("/:id", deleteCourse);
router.patch("/edit/:id", editCourse);

module.exports = router;
