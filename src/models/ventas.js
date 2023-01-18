const mongoose = require("mongoose");
const { Schema } = mongoose;

const ventas = new Schema({
    folio: { type: String },
    fechaElaboracion: { type: String },
    fechaEntrega: { type: String },
    cliente: { type: String },
    nombreCliente: {type: String},
    condicionesPago: { type: String },
    especificaciones: {type: String},
    incoterms: {type: String},
    moneda: {type: String},
    numeroPedido: {type: String }, 
    lugarEntrega: { type: String },
    cotizacion: {type: String},
    ordenCompra: {type: String},
    sucursal: {type: String},
    total: {type: String},
    productos: { type: Array, default: [] },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Ventas", ventas, "Ventas");
