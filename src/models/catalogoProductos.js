const mongoose = require("mongoose");
const { Schema } = mongoose;

const productos = new Schema({
    noInterno: { type: String },
    cliente: { type: String },
    sucursal: {type: String},
    datosMolde: {
        noMolde: { type: String },
        cavMolde: { type: String },
    },
    noParte: { type: String },
    descripcion: { type: String },
    datosPieza: {
        pesoPiezas: { type: String },
        pesoColada: { type: String },
        pesoTotalInyeccion: { type: String },
        porcentajeScrap: { type: String },
        porcentajeMolido: { type: String }
    },
    materiaPrima: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("CatalogoProductos", productos, "CatalogoProductos");
