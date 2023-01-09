const mongoose = require("mongoose");
const { Schema } = mongoose;

const clasificacionMaquinaria = new Schema({
    nombre: { type: String },
    descripcion: {type: String},
    sucursal: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("ClasificacionMaquinaria", clasificacionMaquinaria, "ClasificacionMaquinaria");
