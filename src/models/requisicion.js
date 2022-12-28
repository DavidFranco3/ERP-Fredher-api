const mongoose = require("mongoose");
const { Schema } = mongoose;

const requisicion = new Schema({
    item: { type: String },
    folio: { type: String },
    fechaElaboracion: { type: String },
    fechaRequisicion: {type: String},
    solicitante: { type: String },
    aprobo: { type: String },
    comentarios: { type: String },
    departamento: { type: String },
    tipoRequisicion: {type: String},
    tipoAplicacion: {type: String},
    sucursal: {type: String},
    productosSolicitados: { type: Array, default: [] },
    status: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Requisicion", requisicion, "Requisicion");
