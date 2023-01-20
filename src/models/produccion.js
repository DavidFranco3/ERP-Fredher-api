const mongoose = require("mongoose");
const { Schema } = mongoose;

const produccion = new Schema({
    item: { type: String },
    folio: { type: String },
    sucursal: { type: String },
    generalidades: {
        ordenVenta: { type: String },
        folioPlaneacion: {type: String},
        noInterno: { type: String },
        noParte: { type: String },
        idProducto: { type: String },
        producto: { type: String },
        cliente: { type: String },
        nombreCliente: { type: String }
    },
    planeacion: {
        ordenProduccion: { type: String },
        fecha: { type: String },
        noParte: { type: String },
        noCavidades: { type: String },
        cantidadProducir: { type: String },
        opcionesMaquinaria: { type: Array, default: [] }
    },
    bom: {
        material: { type: String },
        molido: { type: String },
        pesoPieza: { type: String },
        pesoColada: { type: String },
        kgMaterial: { type: String },
        pigmento: { type: String },
        aplicacion: { type: String },
        pigMb: { type: String },
        materialxTurno: { type: String },
        merma: { type: String },
        empaque: { type: String },
        bolsasCajasUtilizar: { type: String },
        notas: { type: String },
        elaboro: { type: String },
    },
    resultados: { type: Array, default: [] },
    materiaPrima: { type: Array, default: [] },
    observaciones: { type: String },
    estado: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model("Produccion", produccion, "Produccion");
