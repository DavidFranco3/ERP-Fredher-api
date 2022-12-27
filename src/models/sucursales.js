const mongoose = require("mongoose");
const { Schema } = mongoose;

const sucursales = new Schema({
    nombre: { type: String },
    direccion : {
        calle: { type: String },
        numeroExterior: { type: String },
        numeroInterior: { type: String },
        colonia: { type: String },
        municipio: { type: String },
        estado: { type: String },
        otro: {type: String},
        pais: {type: String},
    },
    estadoSucursal: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Sucursales", sucursales, "Sucursales");
