const mongoose = require("mongoose");
const { Schema } = mongoose;

const almacen = new Schema({
    folio: { type: String },
    factura: { type: String },
    entradaSinfactura: { type: String },
    fechaEntrada: { type: String },
    fechaSalida: { type: String },
    proveedor: { type: String },
    almacen: { type: String },
    empresa: { type: String },
    clase: { type: String },
    referenciaCalidad: { type: String },
    productos: { type: Array, default: [] }
}, {
    timestamps: true
});

module.exports = mongoose.model("Almacen", almacen, "Almacen");
