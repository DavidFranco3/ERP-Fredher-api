const mongoose = require("mongoose");
const { Schema } = mongoose;

const productosRechazados = new Schema({
    folio: { type: String },
    idRemision: { type: String },
    productos: { type: Array, default: [] },
    cantidadRechazada: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("ProductosRechazados", productosRechazados, "ProductosRechazados");
