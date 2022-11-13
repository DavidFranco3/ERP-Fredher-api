const mongoose = require("mongoose");
const { Schema } = mongoose;

const logSeguridadHigieneSchema = new Schema({
    descripcion: { type: String },
    imagenes: { type: Array, default: [] },
}, {
    timestamps: true
});

module.exports = mongoose.model("LogSeguridadHigiene", logSeguridadHigieneSchema, "LogSeguridadHigiene");
