const mongoose = require("mongoose");
const { Schema } = mongoose;

const integracionVentasGastos = new Schema({
    item: {type: String},
    folio: {type: String},
    fechaFactura: {type: String},
    cliente: {type: String},
    importe: {type: String},
    iva: {type: String},
    total: {type: String},
    sucursal: {type: String},
    estado: {type: String},
    observaciones: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model("IntegracionVentasGastos", integracionVentasGastos, "IntegracionVentasGastos");
