const mongoose = require("mongoose");
const { Schema } = mongoose;

const certificadosCalidad = new Schema({
    item: {type: String},
    folio: {type: String},
    fecha: {type: String},
    noOrdenInterna: {type: String},
    tamañoLote: {type: String},
    cliente: {type: String},
    descripcion: {type: String},
    numeroParte: {type: String},
    especificacionInforme: {type: String},
    revisionAtributos: {
        atributo1: {type: Array, default:[]},
        atributo2: {type: Array, default:[]},
        atributo3: {type: Array, default:[]},
        atributo4: {type: Array, default:[]},
        atributo5: {type: Array, default:[]},
        atributo6: {type: Array, default:[]},
        atributo7: {type: Array, default:[]},
        atributo8: {type: Array, default:[]},
        atributo9: {type: Array, default:[]},
        atributo10: {type: Array, default:[]},
    },
    observaciones: {type: String},
    resultadoDimensional: {
        resultado1: {type: Array, default:[]},
        resultado2: {type: Array, default:[]},
        resultado3: {type: Array, default:[]},
        resultado4: {type: Array, default:[]},
        resultado5: {type: Array, default:[]},
        resultado6: {type: Array, default:[]},
        resultado7: {type: Array, default:[]},
        resultado8: {type: Array, default:[]},
    },
    observacionesResultados: {type: String},
    equipoMedicion: {type: String},
    referencia: {type: String},
    realizo: {type: String},
    correo: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model("CertificadosCalidad", certificadosCalidad, "CertificadosCalidad");
