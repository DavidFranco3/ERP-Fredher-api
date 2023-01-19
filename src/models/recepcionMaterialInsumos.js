const mongoose = require("mongoose");
const { Schema } = mongoose;

const recepcionMaterialInsumos = new Schema({
    folio: { type: String },
    fechaRecepcion: { type: String },
    ordenCompra: { type: String },
    proveedor: { type: String },
    nombreProveedor: { type: String },
    precio: { type: String },
    cantidad: { type: String },
    valorTotal: { type: String },
    sucursal: { type: String },
    productos: { type: Array, default: [] },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("RecepcionMaterialInsumoss", recepcionMaterialInsumos, "RecepcionMaterialInsumos");
