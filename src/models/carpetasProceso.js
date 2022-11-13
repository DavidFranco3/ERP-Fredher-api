const mongoose = require("mongoose");
const { Schema } = mongoose;

const carpetasProceso = new Schema({
    item: {type: String},
    folio: {type: String},
    fecha: {type: String},
    nombre: {type: String},
    descripcion: {type: String},
    generalidades: {
        cliente: {type: String},
        descripcion: {type: String},
        imagenProducto: {type: String},
    },
     encabezado: {
         molde: {type: String},
         operadores: {type: String},
         cavidades: {type: String},
         proceso: {type: String},
         material: {type: String},
         tiempoCiclo: {type: String},
         piezasHora: {type: String},
         piezasTurno: {type: String},
         peso: {type: String},
         noParte: {type: String},
     },
     herramientasEquipos: {type: Array, default: [] },
     equiposProteccionPersonal: {type: Array, default: [] },
     pasosProteccion: {type: Array, default: [] },
     elaboro: {type: String},
     reviso: {type: String},
     autorizo: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model("CarpetasProceso", carpetasProceso, "CarpetasProceso");