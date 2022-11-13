const mongoose = require("mongoose");
const { Schema } = mongoose;

const cotizacion = new Schema({
    folio: { type: String },
    fechaCreacion: { type: String },
    vendedor: { type: String },
    referencia: { type: String },
    cliente: { type: String },
    comentarios: { type: String },
    status: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Cotizacion", cotizacion, "Cotizacion");
