const mongoose = require("mongoose");
const { Schema } = mongoose;

const productosRechazados = new Schema({
    folio: { type: String },
    idRemision: { type: String },
    productos: { type: Array, default: [] },
    sucursal: {type: String},
    cantidadRechazada: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("ProductosRechazados", productosRechazados, "ProductosRechazados");
