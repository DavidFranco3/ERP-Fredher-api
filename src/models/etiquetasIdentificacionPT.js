const mongoose = require("mongoose");
const { Schema } = mongoose;

const etiquetasIdentificacionPT = new Schema({
    item: {type: String},
    fecha: {type: String},
    descripcion: {type: String},
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