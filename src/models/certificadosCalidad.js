const mongoose = require("mongoose");
const { Schema } = mongoose;

const certificadosCalidad = new Schema({
    item: { type: String },
    folio: { type: String },
    fecha: { type: String },
    noOrdenInterna: { type: String },
    tamañoLote: { type: String },
    sucursal: { type: String },
    cliente: { type: String },
    descripcion: { type: String },
    numeroParte: { type: String },
    especificacionInforme: { type: String },
    revisionAtributos: { type: Array, default: [] },
    resultadoDimensional: { type: Array, default: [] },
    observacionesResultados: { type: String },
    equipoMedicion: { type: String },
    referencia: { type: String },
    realizo: { type: String },
    correo: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("CertificadosCalidad", certificadosCalidad, "CertificadosCalidad");
