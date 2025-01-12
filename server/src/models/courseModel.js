const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CourseSchema = new Schema({
  name: { type: String, required: true, trim: true },
  courseId: { type: String, trim: false },
  description: { type: String, trim: false },
  instructor: { type: String, trim: false },
  term: { type: String, trim: false },
  moduleId: [{ type: Schema.Types.ObjectId, ref: "Material" }],
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = model("Course", CourseSchema);
