const Course = require("../models/courseModel");
const User = require("../models/userModel");

// Get all courses
const getCourses = async (req, res, next) => {
  try {
    // Check if the user is authenticated
    if (!req.auth) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Retrieve Clerk user ID
    const clerkUserId = req.auth.userid;
    // Find MongoDB user using Clerk user ID
    const user = await User.findOne({ clerkid: clerkUserId });
    if (!user) {
      return res.status(404).json({ error: "User not found in MongoDB." });
    }

    // Fetch courses associated with the MongoDB user ID
    const courses = await Course.find({ userId: user._id });

    // Respond with the list of courses
    res.status(200).json(courses);
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};

// Get a course by ID
const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.query;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    next(error);
  }
};

// Create a new course
const createCourse = async (req, res, next) => {
  try {
    const course = new Course({
      name: req.body.name,
      description: req.body.description || "",
      courseId: req.body.courseId,
      term: req.body.term,
      instructor: req.body.instructor,
      userId: req.user,
    });

    const savedCourse = await course.save();
    res.status(200).json(savedCourse);
  } catch (error) {
    next(error);
  }
};

// Update course with a new module ID
const updateModuleId = async (req, res, next) => {
  try {
    const { courseId } = req.query;
    const { moduleId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    if (!moduleId) {
      return res.status(400).json({ message: "Module ID is required" });
    }

    // Find the course to check if moduleId already exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.moduleId.includes(moduleId)) {
      return res
        .status(400)
        .json({ message: "Module ID already exists in the course" });
    }

    // Add moduleId to the course if it does not exist
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { $push: { moduleIds: moduleId } }, // Ensure the correct field is updated
      { new: true },
    );

    res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

// Delete a course
const deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const editCourse = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the course ID from route params
    const { name, courseId, instructor, term, description } = req.body; // Extract the updated fields

    // Find the course and update the fields
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { name, courseId, instructor, term, description },
      { new: true }, // Return the updated document
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(updatedCourse); // Return the updated course
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateModuleId,
  deleteCourse,
  editCourse,
};
