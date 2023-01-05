const mongoose = require("mongoose");
const { Schema } = mongoose;

const almacenes = new Schema({
    item: { type: String },
    folio: { type: String },
    idArticulo: { type: String },
    folioArticulo: { type: String },
    nombreArticulo: { type: String },
    tipo: { type: String },
    sucursal: { type: String },
    almacen: { type: String },
    fecha: { type: String },
    um: { type: String },
    descripcion: { type: String },
    movimientos: { type: Array, default: [] },
    cantidadExistencia: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Almacenes", almacenes, "Almacenes");
