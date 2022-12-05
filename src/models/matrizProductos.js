const mongoose = require("mongoose");
const { Schema } = mongoose;

const MatrizProductos = new Schema({
    noInterno: { type: String },
    cliente: { type: String },
    nombreCliente: { type: String },
    datosMolde: {
        noMolde: { type: String },
        cavMolde: { type: String },
    },
    noParte: { type: String },
    descripcion: { type: String },
    precioVenta: {type: String},
    datosPieza: {
        pesoPiezas: { type: String },
        pesoColada: { type: String },
        pesoTotalInyeccion: { type: String },
        porcentajeScrap: { type: String },
        porcentajeMolido: { type: String }
    },
    materiaPrima: {
        idMaterial: {type: String},
        descripcion: { type: String }
    },
    pigmentoMasterBach: {
        descripcion: { type: String },
        aplicacionGxKG: { type: String },
        proveedor: { type: String },
        nombreProveedor: {type: String},
    },
    tiempoCiclo: { type: String },
    noOperadores: { type: String },
    piezasxHora: { type: String },
    piezasxTurno: { type: String },
    materialEmpaque: {
        descripcionBolsa: { type: String },
        noPiezasxEmpaque: { type: String }
    },
    opcionMaquinaria: { type: Array, default: [] },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("MatrizProductos", MatrizProductos, "MatrizProductos");
