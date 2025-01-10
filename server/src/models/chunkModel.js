const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ChunksSchema = new mongoose.Schema({
    materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
    chunkText: String,
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model('Chunk', ChunksSchema);