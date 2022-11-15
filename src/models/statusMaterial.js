const mongoose = require("mongoose");
const { Schema } = mongoose;

const statusMaterial = new Schema({
    item: {type: String},
    folio: {type: String},
    folioInspeccion: {type: String},
    propiedadInspeccion: {type: String},
    cantidadInspeccion: {type: String},
    fechaInspeccion: {type: String},
    tipoMaterialInspeccion: {type: String},
    recibioInspeccion: {type: String},
    loteInspeccion: {type: String},
    nombreInspeccion: {type: String},
    resultadoInspeccion: {type: String},
    etiqueta: {type: String},
    fecha: {type: String},
    descripcionMaterial: {type: String},
    rechazo: {type: String},
    nombre: {type: String},
    auditor: {type: String},
    supervisor: {type: String},
    descripcionDefecto: {type: String},
    cantidad: {type: String},
    tipoRechazo: {type: String},
    correccion: {type: String},
    clienteProveedor: {type: String},
    lote: {type: String},
    recibio: {type: String},
    turno: {type: String},
    propiedad: {type: String},
    liberacion: {type: String},
    descripcion: {type: String},
    comentarios: {type: String},
    condicion: {type: String},
    observaciones: {type: String}
}, {
    timestamps: true
});

module.exports = mongoose.model("StatusMaterial", statusMaterial, "StatusMaterial");
