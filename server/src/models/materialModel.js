const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MaterialSchema = new Schema({
    name: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true },
    filePath: { type: String, required: true },
    fileSize: { type: Number, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },
    moduleId: { type: Schema.Types.ObjectId, ref: "Module" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = model("Material", MaterialSchema);