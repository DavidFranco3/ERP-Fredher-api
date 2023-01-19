const mongoose = require("mongoose");
const { Schema } = mongoose;

const liberacionProductoProceso = new Schema({
    item: { type: String },
    folio: { type: String },
    cliente: { type: String },
    descripcionPieza: { type: String },
    noParteMolde: { type: String },
    procesoRealizado: { type: String },
    fechaElaboracion: { type: String },
    fechaArranqueMolde: { type: String },
    noMaquina: { type: String },
    hojaLiberacion: { type: String },
    elaboro: { type: String },
    turno: { type: String },
    sucursal: { type: String },
    proceso: { type: Array, default: [] },
    producto: { type: Array, default: [] },
    observaciones: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("liberacionProductoProceso", liberacionProductoProceso, "LiberacionProductoProceso");
