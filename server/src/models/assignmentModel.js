const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const AssignmentSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    content: { type: String, trim: true },
    link: { type: String, trim: true },
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = model("Assignment", AssignmentSchema);