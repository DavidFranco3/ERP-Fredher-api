const mongoose = require("mongoose");
const { Schema } = mongoose;

const logCalidad = new Schema({
    descripcion: { type: String },
    imagenes: { type: Array, default: [] },
}, {
    timestamps: true
});

module.exports = mongoose.model("LogCalidad", logCalidad, "LogCalidad");
