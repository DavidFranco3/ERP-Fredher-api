const mongoose = require("mongoose");
const { Schema } = mongoose;

const InspeccionMaterial = new Schema({
    item: { type: String },
    folio: { type: String },
    ordenVenta: { type: String },
    fecha: { type: String },
    lote: { type: String },
    propiedad: { type: String },
    tipoMaterial: { type: String },
    nombre: { type: String },
    cantidad: { type: String },
    unidadMedida: { type: String },
    nombreRecibio: { type: String },
    estadoMateriaPrima: { type: String },
    contaminacion: { type: String },
    presentaHumedad: { type: String },
    certificadoCalidad: { type: String },
    empaqueDañado: { type: String },
    resultadoFinalInspeccion: { type: String },
    etiqueta: { type: String },
    sucursal: { type: String },
    estado: {type: String},
    observaciones: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("InspeccionMaterial", InspeccionMaterial, "InspeccionMaterial");