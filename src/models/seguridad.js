const mongoose = require("mongoose");
const { Schema } = mongoose;

const seguridadHigiene = new Schema({
    incidencias: {
        nombre: { type: String },
        departamento: { type: String },
        descripcion: { type: String },
    },
    sucursal: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model("SeguridadHigiente", seguridadHigiene, "SeguridadHigiente");
