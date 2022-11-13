const mongoose = require("mongoose");
const { Schema } = mongoose;

const ordenProduccion = new Schema({
    noInterno: { type: String },
    nombreProducto: { type: String },
    noParte: { type: String },
    cliente: { type: String },
    planeacion: {
        op: { type: String },
        fecha: { type: String },
        noMolde: { type: String },
        noCavidades: { type: String },
        cantidadFabricar: { type: String },
        noMaquina: { type: String },
        maquina: { type: String },
        ciclo: { type: String },
        piezasxTurno: { type: String },
        piezasxCajaBolsa: { type: String },
        opcion1: { type: String },
        opcion2: { type: String },
        opcion3: { type: String }
    },
    BOM: {
        material: { type: String },
        molido: { type: String },
        pesoxPieza: { type: String },
        pesoColada: { type: String },
        kgMaterial: { type: String },
        pigmento: { type: String },
        aplicacion: { type: String },
        kgPIGoMB: { type: String },
        materialxTurno: { type: String },
        porcentajeMerma: { type: String },
        empaque: { type: String },
        bolsasCajasxUtilizar: { type: String }
    },
    piezas: { type: Array, default: [] },
    materiaPrima: { type: Array, default: [] },
    notasImportantes: { type: String },
    elaboro: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("OrdenProduccion", ordenProduccion, "OrdenProduccion");
