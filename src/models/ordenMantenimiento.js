const mongoose = require("mongoose");
const { Schema } = mongoose;

const ordenMantenimiento = new Schema({
    item: {type: String},
    folio: {type: String},
    solicitud: {
        fecha: {type: String},
        hora: {type: String},
        solicitante: {type: String},
        departamento: {type: String},
        tipoMantenimiento: {type: String},
        noMaquina: {type: String},
        nombreMaquina: {type: String},
    },
    recepcion: {
        nombre: {type: String},
        hora: {type: String},
        fecha: {type: String},
    },
    ejecucion: {
        descripcion: {type: String},
        reporte: {type: String},
        refacciones: {type: String},
    },
    conformidad: {
        conformidad: {type: String},
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("OrdenMantenimiento", ordenMantenimiento, "OrdenMantenimiento");