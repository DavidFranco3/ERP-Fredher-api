const mongoose = require("mongoose");
const { Schema } = mongoose;

const proveedores = new Schema({
    item: {type: String},
    folio: { type: String },
    nombre: { type: String },
    rfc: { type: String },
    tipo: { type: String },
    productoServicio: { type: String },
    categoria: { type: String },
    personalContacto: { type: String },
    telefono: { type: String },
    correo: { type: String },
    tiempoCredito: { type: String },
    tiempoRespuesta: { type: String },
    lugarRecoleccion: { type: String },
    horario: { type: String },
    comentarios: { type: String },
    sucursal: {type: String},
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Proveedores", proveedores, "Proveedores");
