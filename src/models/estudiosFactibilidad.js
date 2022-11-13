const mongoose = require("mongoose");
const { Schema } = mongoose;

const estudiosFactibilidad = new Schema({
    folio: { type: String },
    cliente: { type: String },
    fechaCreacion: { type: String },
    noParte: { type: String },
    nombreProducto: { type: String },
    seccion1: {
        precioProducto: { type: String },
        utilidadProducto: { type: String },
        rentable: { type: String },
        comentarios: { type: String },
        elaboro: { type: String }
    },
    seccion2: {
        pregunta1: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta2: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta3: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta4: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta5: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta6: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta7: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        observaciones: { type: String },
        elaboro: { type: String }
    },
    seccion3: {
        pregunta1: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta2: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta3: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta4: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta5: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta6: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        observaciones: { type: String },
        elaboro: { type: String }
    },
    seccion4: {
        pregunta1: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta2: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta3: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta4: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta5: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        observaciones: { type: String },
        elaboro: { type: String }
    },
    seccion5: {
        pregunta1: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta2: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta3: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta4: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta5: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta6: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta7: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta8: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta9: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta10: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta11: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        pregunta12: {
            si: { type: String },
            no: { type: String },
            na: { type: String }
        },
        observaciones: { type: String },
        elaboro: { type: String }
    },
    resultados: {
        resultadoFactible1: { type: String },
        resultadoFactible2: { type: String },
        resultadoNOFactible: { type: String },
        comentarios: { type: String },
        producto: { type: String },
        ambientales: { type: String }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("EstudiosFactibilidad", estudiosFactibilidad, "EstudiosFactibilidad");
