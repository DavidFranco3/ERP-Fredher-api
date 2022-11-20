const mongoose = require("mongoose");
const { Schema } = mongoose;

const inspeccionPieza = new Schema({
    folio: {type: String},
    fechaElaboracion: {type: String},
    noOP: {type: String},
    fechaArranqueMaquina: {type: String},
    noMaquina: {type: String},
    cliente: {type: String},
    descripcionPieza: {type: String},
    noParte: {type: String},
    material: {type: String},
    cantidadLote: {type: String},
    turno1: {
        elaboro: {type: String},
        operador: {type: String},
        turno: {type: String},
        revisiones: {type: Array, default: []}
    }, 
    turno2: {
        elaboro: {type: String},
        operador: {type: String},
        revisiones: {type: Array, default: []}
    },
    motivoCancelacion: {type: String}, 
    status: {type: String}
}, {
    timestamps: true
});

module.exports = mongoose.model("IspeccionPieza", inspeccionPieza, "InspeccionPieza");
