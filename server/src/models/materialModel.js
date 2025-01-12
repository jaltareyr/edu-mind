const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const MaterialSchema = new Schema({
  name: { type: String, required: true, trim: true },
  mimeType: { type: String, required: true },
  filePath: { type: String },
  fileSize: { type: Number, required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course" },
  isProcessed: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = model("Material", MaterialSchema);
