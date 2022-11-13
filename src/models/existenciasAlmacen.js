const mongoose = require("mongoose");
const { Schema } = mongoose;

const existenciasAlmacen = new Schema({
    clave: { type: String },
    descripcion: { type: String },
    um: { type: String },
    inventarioInicial: { type: String },
    movimientos: { type: Array, default: [] }
}, {
    timestamps: true
});

module.exports = mongoose.model("ExistenciasAlmacen", existenciasAlmacen, "ExistenciasAlmacen");
