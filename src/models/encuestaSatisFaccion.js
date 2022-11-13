const mongoose = require("mongoose");
const { Schema } = mongoose;

const encuestaSatisfaccion = new Schema({
    folio: { type: String },
    datosCliente: {
        nombre: { type: String },
        cargo: { type: String },
        empresa: { type: String },
        fecha: { type: String }
    },
    encuesta: {
        pregunta1: { type: String },
        pregunta2: { type: String },
        pregunta3: { type: String },
        pregunta5: { type: String },
        comentarios: { type: String },
        adjunto: { type: String }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("EncuestaSatisfaccion", encuestaSatisfaccion, "EncuestaSatisfaccion");
