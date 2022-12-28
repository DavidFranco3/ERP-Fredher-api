const mongoose = require("mongoose");
const { Schema } = mongoose;

const logMantenimiento = new Schema({
    descripcion: { type: String },
    imagenes: { type: Array, default: [] },
    sucursal: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model("LogMantenimiento", logMantenimiento, "LogMantenimiento");
