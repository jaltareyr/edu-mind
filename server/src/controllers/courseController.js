const Course = require('../models/courseModel');

// Get all courses
const getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({ userId: req.user.id });
        res.status(200).json(courses);
    } catch (error) {
        next(error);
    }
};

// Get a course by ID
const getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.query.id);
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
            userId: req.user.id,
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
        const { courseId } = req.query; // Get courseId from query
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
            return res.status(400).json({ message: "Module ID already exists in the course" });
        }

        // Add moduleId to the course if it does not exist
        const updatedCourse = await Course.findOneAndUpdate(
            { _id: courseId },
            { $push: { moduleIds: moduleId } }, // Ensure the correct field is updated
            { new: true }
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

module.exports = { getCourses, getCourseById, createCourse, updateModuleId, deleteCourse };