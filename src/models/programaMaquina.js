const mongoose = require("mongoose");
const { Schema } = mongoose;

const programaMaquina = new Schema({
    item: {type: String},
    ordenProduccion: {type: String},
    noInterno: {type: String},
    cliente: {type: String},
    descripcion: {type: String},
    cantidadFabricar: {type: String},
    acumulado: {type: String},
    pendiente: {type: String},
    ciclo: {type: String},
    stdTurno: {type: String},
    turnosRequeridos: {type: String},
    fechaInicial: {type: String},
    fechaFinal: {type: String}
}, {
    timestamps: true
});

module.exports = mongoose.model("ProgramaMaquina", programaMaquina, "ProgramaMaquina");
