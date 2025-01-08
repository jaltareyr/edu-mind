const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const QuizSchema = new Schema({
    name: { type: String, required: true, trim: true },
    filepath: { type: String, required: true },
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = model("Quiz", QuizSchema);