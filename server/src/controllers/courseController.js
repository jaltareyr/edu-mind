const Course = require('../models/courseModel');

class CourseController {
    async get(req, res, next) {
        return Course.find({ userId: req.userToken?.userId })
            .then((courses) => {
                res.status(200).json(courses);
            })
            .catch((error) => {
                return next(error);
            });
    }

    async getById(req, res, next) {
        try {
            const course = await Course.findById(req.query.id);

            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }

            return res.status(200).json({ course });
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }

    async create(req, res, next) {
        const course = new Course({
            name: req.body.name,
            description: req.body.description || "",
            userId: req.userToken?.userId,
        });

        return course
            .save()
            .then((course) => {
                res.status(200).json(course);
            })
            .catch((error) => {
                return next(error);
            });
    }

    async updateModuleId(req, res, next) {
        try {
            const { courseId } = req.params;
            const { moduleId } = req.body;

            console.log(`Course ID: ${courseId}`);

            if (!moduleId) {
                return res.status(400).json({ message: "Module ID is required" });
            }

            const updatedCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { moduleIds: moduleId } },
                { new: true }
            );

            if (!updatedCourse) {
                return res.status(404).json({ message: "Course not found" });
            }

            res.status(200).json(updatedCourse);
        } catch (error) {
            return next(error);
        }
    }

    async delete(req, res, next) {
        const courseId = req.params.id;

        console.log(courseId);

        return Course.findByIdAndDelete(courseId)
            .then((deletedCourse) => {
                if (!deletedCourse) {
                    return res.status(404).json({ message: "Course not found" });
                }

                res.status(200).json({ message: "Course deleted successfully" });
            })
            .catch((error) => {
                return next(error);
            });
    }
}

module.exports = new CourseController();