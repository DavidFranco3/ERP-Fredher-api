const mongoose = require("mongoose");
const { Schema } = mongoose;

const requerimientosEspecificos = new Schema({
    folio: { type: String },
    nombreProducto: { type: String },
    fecha: { type: String },
    cliente: { type: String },
    nombreQuienElabora: { type: String },
    especificacionesProducto: { type: Array, default: [] },
    materiales: { type: Array, default: [] },
    maquinaria: { type: Array, default: [] },
    herramental: { type: Array, default: [] },
    empaques: { type: Array, default: [] },
    entregas: {
        lugarEntrega: { type: String },
        horario: { type: String },
        especificacionesSeguridad: { type: String },
        notas: { type: String }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("RequerimientosEspecificos", requerimientosEspecificos, "RequerimientosEspecificos");
