const mongoose = require("mongoose");
const { Schema } = mongoose;

const tracking = new Schema({
    folio: { type: String },
    ordenVenta: { type: String },
    cliente: { type: String },
    fechaElaboracion: { type: String },
    fechaEntrega: { type: String },
    status: { type: String },
    sucursal: {type: String},
    indicador: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Tracking", tracking, "Tracking");
