const mongoose = require("mongoose");
const { Schema } = mongoose;

const programaMantenimientoPreventivo = new Schema({
    item: { type: String },
    ident: { type: String },
    descripcion: { type: String },
    sucursal: { type: String },
    fechasProgramadas: {
        semana1: { type: String },
        semana2: { type: String },
        semana3: { type: String },
        semana4: { type: String },
    },
    fechasReales: {
        semana1: { type: String },
        semana2: { type: String },
        semana3: { type: String },
        semana4: { type: String },
    },
    comentarios: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("ProgramaMantenimientoPreventivo", programaMantenimientoPreventivo, "ProgramaMantenimientoPreventivo");