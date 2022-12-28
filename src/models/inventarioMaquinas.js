const mongoose = require("mongoose");
const { Schema } = mongoose;

const inventarioMaquinas = new Schema({
    item: {type: String},
    tipo: {type: String},
    codigo: {type: String},
    noMaquina: {type: String},
    descripcion: {type: String},
    capacidad: {type: String},
    unidades: {type: String},
    marca: {type: String},
    modelo: {type: String},
    noSerie: {type: String},
    sucursal: {type: String},
    fechaAdquisicion: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model("InventarioMaquinas", inventarioMaquinas, "InventarioMaquinas");