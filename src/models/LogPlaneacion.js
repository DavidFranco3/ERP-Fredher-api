const mongoose = require("mongoose");
const { Schema } = mongoose;

const logPlaneacion = new Schema({
    descripcion: { type: String },
    imagenes: { type: Array, default: [] },
    liberado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("LogPlaneacion", logPlaneacion, "LogPlaneacion");
