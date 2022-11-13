const mongoose = require("mongoose");
const { Schema } = mongoose;

const RequerimientosPlaneacion = new Schema({
    item: {type: String},
    folio: {type: String},
    requerimiento: {
        semana: {type: String},
        producto: {type: String},
        um: {type: String},
        almacenProductoTerminado: {type: String},
        ordenVenta: { type: Array, default: [] },
        totalProducir: {type: String},
    },
    planeacion: {
        numeroMolde: {type: String},
        numeroCavidades: {type: String},
        opcionesMaquinaria: {type: Array, default: [] }
    },
    bom: {
        material: {type: String},
        molido: {type: String},
        pesoPieza: {type: String},
        pesoColada: {type: String},
        kgMaterial: {type: String},
        pigmento: {type: String},
        aplicacion: {type: String},
        pigMb: {type: String},
        materialxTurno: {type: String},
        merma: {type: String},
        empaque: {type: String},
        bolsasCajasUtilizar: {type: String},
    },
    estado: {type: String}
}, {
    timestamps: true
});

module.exports = mongoose.model("RequerimientosPlaneacion", RequerimientosPlaneacion, "RequerimientosPlaneacion");
