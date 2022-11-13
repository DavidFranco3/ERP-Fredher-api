const mongoose = require("mongoose");
const { Schema } = mongoose;

const planeacion = new Schema({
    folio: { type: String },
    ordenVenta: { type: String },
    productos: { type: Array, default: [] },
    detalles: { type: Array, default: [] },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Planeacion", planeacion, "Planeacion");
