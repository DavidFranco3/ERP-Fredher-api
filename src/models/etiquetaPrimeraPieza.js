const mongoose = require("mongoose");
const { Schema } = mongoose;

const etiquetasPrimeraPieza = new Schema({
    folio: {type: String},
    fecha: {type: String},
    noMaquina: {type: String},
    descripcionProducto: {type: String},
    sucursal: {type: String},
    cliente: {type: String},
    peso: {type: String},
    noCavidades: {type: String},
    turno: {type: String},
    inspector: {type: String},
    supervisor: {type: String},
    estado: {type: String}
}, {
    timestamps: true
});

module.exports = mongoose.model("EtiquetasPrimeraPieza", etiquetasPrimeraPieza, "EtiquetasPrimeraPieza");
