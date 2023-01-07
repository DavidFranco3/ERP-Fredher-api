const mongoose = require("mongoose");
const { Schema } = mongoose;

const clasificacionMateriales = new Schema({
    nombre: { type: String },
    descripcion: {type: String},
    sucursal: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("ClasificacionMateriales", clasificacionMateriales, "ClasificacionMateriales");
