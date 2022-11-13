const mongoose = require("mongoose");
const { Schema } = mongoose;

const programaMantenimientoPreventivo = new Schema({
    item: {type: String},
    folio: {type: String},
    tipo: {type: String},
    fecha: {type: String},
    producto: {type: String},
    cliente: {type: String},
    noMoldeInterno: {type: String},
    noCavidades: {type: String},
    tipoColada: {type: String},
    dimensionesMoldes: {type: String},
    condicion1: {type: Array, default: [] },
    condicion2: {type: Array, default: [] },
    condicion3: {type: Array, default: [] },
    condicion4: {type: Array, default: [] },
    condicion5: {type: Array, default: [] },
    condicion6: {type: Array, default: [] },
    condicion7: {type: Array, default: [] },
    condicion8: {type: Array, default: [] },
    condicion9: {type: Array, default: [] },
    condicion10: {type: Array, default: [] },
    condicion11: {type: Array, default: [] },
    condicion12: {type: Array, default: [] },
    condicion13: {type: Array, default: [] },
    condicion14: {type: Array, default: [] },
    condicion15: {type: Array, default: [] },
    condicion16: {type: Array, default: [] },
    condicion17: {type: Array, default: [] },
    condicion18: {type: Array, default: [] },
    comentarios: {type: String},
    realizo: {type: String},
    jefeProduccion: {type: String},
    fechaInicio: {type: String},
    fechaFinal: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model("ProgramaMantenimientoPreventivo", programaMantenimientoPreventivo, "ProgramaMantenimientoPreventivo");