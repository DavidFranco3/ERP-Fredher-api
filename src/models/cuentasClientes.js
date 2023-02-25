const mongoose = require("mongoose");
const { Schema } = mongoose;

const cuentasClientes = new Schema({
    folio: { type: String },
    cliente: { type: String },
    nombreCliente: { type: String },
    sucursal: { type: String },
    total: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model("CuentasClientes", cuentasClientes, "CuentasClientes");