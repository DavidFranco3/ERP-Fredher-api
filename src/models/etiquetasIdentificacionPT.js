const mongoose = require("mongoose");
const { Schema } = mongoose;

const etiquetasIdentificacionPT = new Schema({
    item: {type: String},
    folio: {type: String},
    fecha: {type: String},
    descripcion: {type: String},
    sucursal: {type: String},
    noParte: {type: String},
    noOrden: {type: String},
    cantidad: {type: String},
    turno: {type: String},
    operador: {type: String},
    supervisor: {type: String},
    inspector: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model("EtiquetasIdentificacionPT", etiquetasIdentificacionPT, "EtiquetasIdentificacionPT");