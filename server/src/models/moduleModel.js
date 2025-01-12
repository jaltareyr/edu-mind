const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ModuleSchema = new Schema({
  name: { type: String, required: true, trim: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = model("Module", ModuleSchema);
