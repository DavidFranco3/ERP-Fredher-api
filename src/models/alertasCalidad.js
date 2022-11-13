const mongoose = require("mongoose");
const { Schema } = mongoose;

const alertasCalidad = new Schema({
    item: {type: String},
    folio: {type: String},
    fecha: {type: String},
    cliente: {type: String},
    descripcionPieza: {type: String},
    descripcionNoConformidad: {type: String},
    cantidadPiezasCondicion: {type: String},
    referencia: {type: String},
    accionContencion: {type: String},
    accionCorrectiva: {type: String},
    autorizo: {type: String},
    elaboro: {type: String},
    observaciones: {type: String},
    listaFirmas: {type: String},
    referenciaNoConformidad: {type: String},
    condicionIncorrecta: {
        imagen1: {type: String},
        imagen2: {type: String},
        imagen3: {type: String},
        imagen4: {type: String},
    },
    condicionCorrecta: {
        imagen1: {type: String},
        imagen2: {type: String},
        imagen3: {type: String},
        imagen4: {type: String},
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("AlertasCalidad", alertasCalidad, "AlertasCalidad");
