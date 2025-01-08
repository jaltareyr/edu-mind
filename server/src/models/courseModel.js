const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CourseSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: false },
    moduleId: [{ type: Schema.Types.ObjectId, ref: "Material" }],
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = model("Course", CourseSchema);