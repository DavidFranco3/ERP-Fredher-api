const mongoose = require("mongoose");
const { Schema } = mongoose;

const cuentasPorPagar = new Schema({
    folio: { type: String },
    ordenCompra: { type: String },
    proveedor: { type: String },
    nombreProveedor: { type: String },
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

module.exports = mongoose.model("CuentasPorPagar", cuentasPorPagar, "CuentasPorPagar");
