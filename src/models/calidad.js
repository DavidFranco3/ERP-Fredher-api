const mongoose = require("mongoose");
const { Schema } = mongoose;

const calidad = new Schema({
    folio: { type: String },
    descripcion: { type: String },
    noParte: { type: String },
    noOrden: { type: String },
    cantidad: { type: String },
    turno: { type: String },
    operador: { type: String },
    supervisor: { type: String },
    inspector: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Calidad", calidad, "Calidad");
