const mongoose = require("mongoose");
const { Schema } = mongoose;

const acusesRecibo = new Schema({
    folio: { type: String },
    idRemision: { type: String },
    productos: { type: Array, default: [] },
    cantidadAceptada: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("AcusesRecibo", acusesRecibo, "AcusesRecibo");
