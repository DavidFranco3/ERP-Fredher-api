const mongoose = require("mongoose");
const { Schema } = mongoose;

const liberacionProductoProceso = new Schema({
    item: {type: String},
    folio: {type: String},
    cliente: {type: String},
    descripcionPieza: {type: String},
    noParteMolde: {type: String},
    proceso: {type: String},
    fechaElaboracion: {type: String},
    fechaArranqueMolde: {type: String},
    noMaquina: {type: String},
    hojaLiberacion: {type: String},
    elaboro: {type: String},
    turno: {type: String},
    proceso: {
        condicion1: {type: Array, default: []},
        condicion2: {type: Array, default: []},
        condicion3: {type: Array, default: []},
        condicion4: {type: Array, default: []},
        condicion5: {type: Array, default: []},
        condicion6: {type: Array, default: []},
        condicion7: {type: Array, default: []},
    },
    producto: {
        condicion1: {type: Array, default: []},
        condicion2: {type: Array, default: []},
        condicion3: {type: Array, default: []},
        condicion4: {type: Array, default: []},
        condicion5: {type: Array, default: []},
        condicion6: {type: Array, default: []},
        condicion7: {type: Array, default: []},
        condicion8: {type: Array, default: []},
    },
    observaciones: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model("liberacionProductoProceso", liberacionProductoProceso, "LiberacionProductoProceso");
