const mongoose = require("mongoose");
const { Schema } = mongoose;

const MatrizProductos = new Schema({
    noInterno: { type: String },
    cliente: { type: String },
    nombreCliente: { type: String },
    sucursal: { type: String },
    datosMolde: {
        noMolde: { type: String },
        cavMolde: { type: String },
    },
    noParte: { type: String },
    descripcion: { type: String },
    precioVenta: { type: String },
    um: { type: String },
    datosPieza: {
        pesoPiezas: { type: String },
        pesoColada: { type: String },
        pesoTotalInyeccion: { type: String },
        porcentajeScrap: { type: String },
        porcentajeMolido: { type: String }
    },
    materiaPrima: {
        idMaterial: { type: String },
        folioMaterial: { type: String },
        descripcion: { type: String },
        precioMaterial: { type: String },
        umMaterial: {type: String},
    },
    pigmentoMasterBach: {
        idPigmento: { type: String },
        folioPigmento: { type: String },
        descripcion: { type: String },
        precioPigmento: { type: String },
        umPigmento: {type: String},
        aplicacionGxKG: { type: String },
        proveedor: { type: String },
        nombreProveedor: { type: String },
    },
    tiempoCiclo: { type: String },
    noOperadores: { type: String },
    piezasxHora: { type: String },
    piezasxTurno: { type: String },
    materialEmpaque: {
        idEmpaque: { type: String },
        folioEmpaque: { type: String },
        descripcionBolsa: { type: String },
        precioEmpaque: { type: String },
        umEmpaque: {type: String},
        noPiezasxEmpaque: { type: String }
    },
    opcionMaquinaria: { type: Array, default: [] },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("MatrizProductos", MatrizProductos, "MatrizProductos");
