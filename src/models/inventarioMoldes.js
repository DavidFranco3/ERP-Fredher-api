const mongoose = require("mongoose");
const { Schema } = mongoose;

const inventarioMoldes = new Schema({
    item: {type: String},
    noInterno: {type: String},
    cliente: {type: String},
    noMolde: {type: String},
    cavMolde: {type: String},
    noParte: {type: String},
    descripcion: {type: String},
    statusMolde: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model("InventarioMoldes", inventarioMoldes, "InventarioMoldes");