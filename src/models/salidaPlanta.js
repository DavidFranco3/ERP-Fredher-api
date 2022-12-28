const mongoose = require("mongoose");
const { Schema } = mongoose;

const salidaPlanta = new Schema({
    folio: { type: String },
    sp: { type: String },
    fechaSalida: { type: String },
    destino: { type: String },
    autoriza: { type: String },
    fechaEntrega: { type: String },
    sucursal: {type: String},
    articulos: { type: Array, default: [] }
}, {
    timestamps: true
});

module.exports = mongoose.model("SalidaPlanta", salidaPlanta, "SalidaPlanta");
