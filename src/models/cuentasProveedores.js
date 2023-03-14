const mongoose = require("mongoose");
const { Schema } = mongoose;

const cuentasProveedores = new Schema({
    folio: { type: String },
    proveedor: { type: String },
    nombreProveedor: { type: String },
    sucursal: { type: String },
    total: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model("CuentasProveedores", cuentasProveedores, "CuentasProveedores");