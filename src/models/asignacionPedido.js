const mongoose = require("mongoose");
const { Schema } = mongoose;

const AsignacionPedido = new Schema({
    item: { type: String },
    folio: { type: String },
    cliente: { type: String },
    fechaPedido: { type: String },
    fechaEntrega: { type: String },
    sucursal: { type: String },
    producto: { type: String },
    um: { type: String },
    cantidadPedida: { type: String },
    plantaAsignada: { type: String },
    cantidadAsignada: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("AsignacionPedido", AsignacionPedido, "AsignacionPedido");
