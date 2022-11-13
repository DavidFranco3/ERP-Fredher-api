const mongoose = require("mongoose");
const { Schema } = mongoose;

const reporteDevoluciones = new Schema({
    folio: { type: String },
    fechaInicio: { type: String },
    fechaTermino: { type: String },
    empresa: { type: String },
    factura: { type: String },
    devoluciones: { type: Array, default: [] },
    pdf: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("ReporteDevoluciones", reporteDevoluciones, "ReporteDevoluciones");
