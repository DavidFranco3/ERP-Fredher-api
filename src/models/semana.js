const mongoose = require("mongoose");
const { Schema } = mongoose;

const semana = new Schema({
    folio: { type: String },
    fechaInicial: { type: String },
    fechaFinal: { type: String },
    sucursal: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Semana", semana, "Semana");
