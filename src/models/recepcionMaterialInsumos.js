const mongoose = require("mongoose");
const { Schema } = mongoose;

const recepcionMaterialInsumos = new Schema({
    folio: { type: String },
    fechaRecepcion: {type: String},
    precio: {type: String},
    cantidad: {type: String},
    valorTotal: {type: String},
    productos: { type: Array, default: [] }
}, {
    timestamps: true
});

module.exports = mongoose.model("RecepcionMaterialInsumoss", recepcionMaterialInsumos, "RecepcionMaterialInsumos");
