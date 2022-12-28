const mongoose = require("mongoose");
const { Schema } = mongoose;

const incidencias = new Schema({
    nombre: { type: String },
    departamento: { type: String },
    descripcion: { type: String },
    sucursal: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model("Incidencias", incidencias, "Incidencias");
