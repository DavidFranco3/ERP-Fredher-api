const mongoose = require("mongoose");
const { Schema } = mongoose;

const maquinas = new Schema({
    numeroMaquina: { type: String },
    tipoMaquina: { type: String },
    nombre: { type: String },
    marca: { type: String },
    modelo: { type: String },
    noSerie: { type: String },
    lugar: { type: String },
    sucursal: { type: String },
    fechaAdquisicion: { type: String },
    status: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Maquinas", maquinas, "Maquinas");