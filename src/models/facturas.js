const mongoose = require("mongoose");
const { Schema } = mongoose;

const facturas = new Schema({
    folio: { type: String },
    ordenVenta: { type: String },
    cliente: { type: String },
    nombreCliente: { type: String },
    sucursal: { type: String },
    fechaEmision: { type: String },
    fechaVencimiento: { type: String },
    nombreContacto: { type: String },
    telefono: { type: String },
    correo: { type: String },
    productos: { type: Array, default: [] },
    iva: { type: String },
    ivaElegido: { type: String },
    subtotal: { type: String },
    total: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Facturas", facturas, "Facturas");
