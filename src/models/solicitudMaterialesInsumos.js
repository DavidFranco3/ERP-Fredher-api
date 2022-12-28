const mongoose = require("mongoose");
const { Schema } = mongoose;

const solicitudMaterialesInsumos = new Schema({
    item: {type: String},
    folio: {type: String},
    queSolicita: {type: String},
    fechaElaboracion: {type: String},
    nombreSolicitante: {type: String},
    fechaRequiere: {type: String},
    areaSolicitante: {type: String},
    productos: {type: Array, default:[]},
    sucursal: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model("SolicitudesMaterialesInsumos", solicitudMaterialesInsumos, "SolicitudesMaterialesInsumos");
