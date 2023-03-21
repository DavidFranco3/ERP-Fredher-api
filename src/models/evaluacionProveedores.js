const mongoose = require("mongoose");
const { Schema } = mongoose;

const evaluacionProveedores = new Schema({
    item: {type: String},
    folio: { type: String },
    nombre: { type: String },
    rfc: { type: String },
    tipoPersona: { type: String },
    regimenFiscal: { type: String },
    productoServicio: { type: String },
    personalContacto: { type: String },
    direccion: {
        calle: { type: String },
        numeroExterior: { type: String },
        numeroInterior: { type: String },
        colonia: { type: String },
        municipio: { type: String },
        estado: { type: String },
        pais: { type: String },
        codigoPostal: { type: String }
    },
    telefonoCelular: { type: String },
    telefonoFijo: { type: String },
    correo: { type: String },
    diasCredito: { type: String },
    tiempoRespuesta: { type: String },
    lugarRecoleccion: { type: String },
    horario: { type: String },
    comentarios: { type: String },
    sucursal: {type: String},
    productos: { type: Array, default: [] },
    servicioProporcionado: {type: String},
    estadoProveedor: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("EvaluacionProveedores", evaluacionProveedores, "EvaluacionProveedores");
