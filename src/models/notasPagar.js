const mongoose = require("mongoose");
const { Schema } = mongoose;

const notasPagar = new Schema({
    folio: { type: String },
    factura: { type: String },
    tipo: { type: String },
    concepto: { type: String },
    totalSinIva: { type: String },
    iva: { type: String },
    total: { type: String },
    sucursal: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("NotasPagar", notasPagar, "NotasPagar");
