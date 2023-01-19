const mongoose = require("mongoose");
const { Schema } = mongoose;

const fichasTecnicas = new Schema({
    item: { type: String },
    folio: { type: String },
    descripcion: { type: String },
    fechaElaboracion: { type: String },
    realizo: { type: String },
    autorizo: { type: String },
    sucursal: { type: String },
    fichas: { type: Array, default: [] },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("FichasTecnicas", fichasTecnicas, "FichasTecnicas");
