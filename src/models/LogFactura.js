const mongoose = require("mongoose");
const { Schema } = mongoose;

const logFactura = new Schema({
    descripcion: { type: String },
    sucursal: {type: String},
    imagenes: { type: Array, default: [] },
    liberado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("LogFactura", logFactura, "LogFactura");
