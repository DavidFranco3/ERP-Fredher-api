const mongoose = require("mongoose");
const { Schema } = mongoose;

const compras = new Schema({
    item: {type: String},
    folio: { type: String },
    proveedor: { type: String },
    requisicion: {type: String},
    nombreProveedor: {type: String},
    fechaSolicitud: { type: String },
    fechaEntrega: { type: String },
    tipoCompra: {type: String},
    autoriza: { type: String },
    departamento: {type: String},
    productos: { type: Array, default: [] },
    subtotal: { type: String },
    iva: { type: String },
    total: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Compras", compras, "Compras");
