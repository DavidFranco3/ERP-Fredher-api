const mongoose = require("mongoose");
const { Schema } = mongoose;

const clientes = new Schema({
    nombre: { type: String },
    apellidos: { type: String },
    razonSocial: { type: String },
    rfc: { type: String },
    direccion : {
        calle: { type: String },
        numeroExterior: { type: String },
        numeroInterior: { type: String },
        colonia: { type: String },
        municipio: { type: String },
        estado: { type: String },
        pais: { type: String }
    },
    tipo: { type: String },
    correo: { type: String },
    telefonoCelular: { type: String },
    telefonoFijo: { type: String },
    foto: { type: String },
    estadoCliente: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Clientes", clientes, "Clientes");
