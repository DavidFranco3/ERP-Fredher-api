const mongoose = require("mongoose");
const { Schema } = mongoose;

const verificacionEmbarques = new Schema({
    folio: { type: String },
    cliente: { type: String },
    remisionFactura: { type: String },
    fecha: { type: String },
    comentarios: { type: String },
    sucursal: {type: String},
    encargadoEmbarque: { type: String },
    vbCalidad: { type: String },
    productos: { type: Array, default: [] }
}, {
    timestamps: true
});

module.exports = mongoose.model("VerificacionEmbarques", verificacionEmbarques, "VerificacionEmbarques");
