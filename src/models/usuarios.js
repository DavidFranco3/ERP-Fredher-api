const mongoose = require("mongoose");
const { Schema } = mongoose;

const usuarios = new Schema({
    nombre: { type: String },
    nss: { type: String },
    rfc: { type: String },
    telefonoCelular: { type: String },
    telefonoFijo: { type: String },
    direccion : {
        calle: { type: String },
        numeroExterior: { type: String },
        numeroInterior: { type: String },
        colonia: { type: String },
        municipio: { type: String },
        estado: { type: String },
    },
    departamento: { type: String },
    fechaIngreso: { type: String },
    correo: { type: String },
    password: { type: String },
    estadoUsuario: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Usuarios", usuarios, "Usuarios");
