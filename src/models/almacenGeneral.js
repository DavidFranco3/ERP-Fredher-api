const mongoose = require("mongoose");
const { Schema } = mongoose;

const almacenGeneral = new Schema({
    folioAlmacen: { type: String },
    nombre: { type: String },
    descripcion: { type: String },
    um: { type: String },
    tipo: { type: String },
    movimientos: { type: Array, default: [] },
    existenciasOV: { type: String },
    existenciasStock: { type: String },
    existenciasTotales: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("AlmacenGeneral", almacenGeneral, "AlmacenGeneral");
