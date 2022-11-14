const mongoose = require("mongoose");
const { Schema } = mongoose;

const reporteProduccion = new Schema({
    folio: { type: String },
    fecha: { type: String},
    asistencias: {type: String},
    faltas: {type: String},
    supervisor: { type: String },
    turno: { type: String },
    registros: { type: Array, default: [] },
    eficienciaGeneralMaquinas: { type: String },
    observacionesTurno: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("ReporteProduccion", reporteProduccion, "ReporteProduccion");
