const mongoose = require("mongoose");
const { Schema } = mongoose;

const razonesSociales = new Schema({
    nombre: { type: String },
    rfc: { type: String },
    tipoPersona: { type: String },
    regimenFiscal: { type: String },
    sucursal: { type: String },
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
    correo: { type: String },
    telefonoCelular: { type: String },
    telefonoFijo: { type: String },
    estadoRazonSocial: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("RazonesSociales", razonesSociales, "RazonesSociales");
