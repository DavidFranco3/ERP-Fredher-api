const mongoose = require("mongoose");
const { Schema } = mongoose;

const almacenmp = new Schema({
    item: {type: String},
    folioAlmacen: { type: String },
    nombreMP: {type: String},
    um: {type: String},
    fecha: {type: String},
    movimientos: { type: Array, default: [] },
    cantidadExistencia: {type: String},
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("AlmacenMP", almacenmp, "AlmacenMP");
