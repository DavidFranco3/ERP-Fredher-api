const mongoose = require("mongoose");
const { Schema } = mongoose;

const recepcionMaterialInsumos = new Schema({
    folio: { type: String },
    fechaRecepcion: {type: String},
    proveedor: {type: String},
    materialInsumo: {type: String},
    precio: {type: String},
    cantidad: {type: String},
    productos: { type: Array, default: [] }
}, {
    timestamps: true
});

module.exports = mongoose.model("RecepcionMaterialInsumoss", recepcionMaterialInsumos, "RecepcionMaterialInsumos");
