const mongoose = require("mongoose");
const { Schema } = mongoose;

const tiquet = new Schema({
    pedidoVenta: {
        numero: { type: String },
        descripcion: { type: String }
    },
    ordenCompra: {
        numero: { type: String },
        descripcion: { type: String }
    },
    ordenProduccion: {
        numero: { type: String },
        descripcion: { type: String }
    },
    almacen: {
        numero: { type: String },
        descripcion: { type: String }
    },
    embarque: {
        numero: { type: String },
        descripcion: { type: String }
    },
    logistica: {
        numero: { type: String },
        descripcion: { type: String }
    },
    sucursal: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model("Tiquets", tiquet, "Tiquets");
