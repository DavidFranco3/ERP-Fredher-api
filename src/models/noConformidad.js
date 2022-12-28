const mongoose = require("mongoose");
const { Schema } = mongoose;

const noConformidad = new Schema({
    item: {type: String},
    folio: {type: String},
    descripcionNoConformidad: {type: String},
    correccion: {type: String},
    analisisCausaRaiz: {type: String},
    diagrama: {type: String},
    accionCorrectiva: {type: String},
    fecha: {type: String},
    status: {type: String},
    responsables: {type: String},
    fechaCierre: {type: String},
    statusFinal: {type: String},
    sucursal: {type: String},
    evidencia: {
        imagen1: {type: String},
        imagen2: {type: String},
        imagen3: {type: String},
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("NoConformidad", noConformidad, "NoConformidad");
