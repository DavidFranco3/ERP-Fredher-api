const mongoose = require("mongoose");
const { Schema } = mongoose;

const RequerimientosPlaneacion = new Schema({
    item: { type: String },
    folio: { type: String },
    sucursal: { type: String },
    requerimiento: {
        semana: { type: String },
        producto: { type: String },
        nombreProducto: { type: String },
        um: { type: String },
        ov: { type: String },
        almacenProductoTerminado: { type: String },
        nombreProveedor: { type: String },
        ordenVenta: { type: Array, default: [] },
        totalProducir: { type: String },
    },
    planeacion: {
        numeroMolde: { type: String },
        numeroCavidades: { type: String },
        opcionesMaquinaria: { type: Array, default: [] }
    },
    bom: {
        material: { type: String },
        idMaterial: { type: String },
        folioMaterial: { type: String },
        precioMaterial: { type: String },
        molido: { type: String },
        pesoPieza: { type: String },
        pesoColada: { type: String },
        kgMaterial: { type: String },
        pigmento: { type: String },
        idPigmento: { type: String },
        folioPigmento: { type: String },
        precioPigmento: { type: String },
        aplicacion: { type: String },
        pigMb: { type: String },
        materialxTurno: { type: String },
        merma: { type: String },
        empaque: { type: String },
        idEmpaque: { type: String },
        folioEmpaque: { type: String },
        precioEmpaque: { type: String },
        bolsasCajasUtilizar: { type: String },
    },
    datosRequisicion: {
        material: {type: String},
        kgMaterial: { type: String },
        almacenMP: { type: String },
        cantidadSugerida: { type: String },
        cantidadPedir: { type: String },

        pigmentoMB: {type: String},
        kgPigMB: { type: String },
        MbAlmacen: { type: String },
        cantidadSugeridaMB: { type: String },
        cantidadPedirMB: { type: String },

        empaque: {type: String},
        empaquesNecesarios: { type: String },
        empaquesAlmacen: { type: String },
        cantidadSugeridaEmpaques: { type: String },
        cantidadPedirEmpaques: { type: String }
    },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("RequerimientosPlaneacion", RequerimientosPlaneacion, "RequerimientosPlaneacion");
