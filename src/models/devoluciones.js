const mongoose = require("mongoose");
const { Schema } = mongoose;

const devoluciones = new Schema({
    folio: { type: String },
    factura: { type: String },
    empresa: { type: String },
    cliente: { type: String },
    rfc: { type: String },
    almacen: { type: String },
    razonSocial: { type: String },
    comentario: { type: String },
    vendedor: { type: String },
    domicilio: { type: String },
    productos: { type: Array, default: [] },
    totales: {
        cantidad: { type: String },
        costo: { type: String },
        importe: { type: String },
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Devoluciones", devoluciones, "Devoluciones");
