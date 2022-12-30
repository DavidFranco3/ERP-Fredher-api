const mongoose = require("mongoose");
const { Schema } = mongoose;

const gestionAlmacen = new Schema({
    nombre: {type: String},
    descripcion: {type: String},
    sucursal: {type: String},
    status: {type: String}
}, {
    timestamps: true
});

module.exports = mongoose.model("GestionAlmacen", gestionAlmacen, "GestionAlmacen");
