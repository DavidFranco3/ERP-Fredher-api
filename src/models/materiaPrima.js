const mongoose = require("mongoose");
const { Schema } = mongoose;

const materiaPrima = new Schema({
    item: {type: String},
    folio: { type: String },
    descripcion: {type: String},
    precio: {type: String},
    um: {type: String},
    sucursal: {type: String},
    proveedor: {type: String}
}, {
    timestamps: true
});

module.exports = mongoose.model("MateriasPrimas", materiaPrima, "MateriasPrimas");
