const mongoose = require("mongoose");
const { Schema } = mongoose;

const usoEmpaque = new Schema({
    clave: { type: String },
    descripcion: { type: String },
    inventarioInicial: { type: String },
    productos: { type: Array, default: [] },
    cantidadxUM: { type: Array, default: [] }
}, {
    timestamps: true
});

module.exports = mongoose.model("UsoEmpaque", usoEmpaque, "UsoEmpaque");
