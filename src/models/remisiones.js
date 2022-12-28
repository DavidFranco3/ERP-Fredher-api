const mongoose = require("mongoose");
const { Schema } = mongoose;

const remisiones = new Schema({
    folio: { type: String },
    idOrdenVenta: { type: String },
    idCliente: { type: String },
    productos: { type: Array, default: [] },
    sucursal: {type: String},
    subtotales: {
        cantidad: { type: String },
        precio: { type: String },
        total: { type: String }
    },
    impuestos: { type: String },
    descuentos: { type: String },
    total: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Remisiones", remisiones, "Remisiones");
