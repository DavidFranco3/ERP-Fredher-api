const mongoose = require("mongoose");
const { Schema } = mongoose;

const materiaPrima = new Schema({
    item: {type: String},
    folio: { type: String },
    producto: {type: String},
    cantidadProducir: {type: String},
    material: {type: String},
    umMaterial: {type: String},
    materialUnidades: {type: String},
    materialNecesario: {type: String},
    reservado: {type: String},
    fechaReservado: {type: String},
    tiempoespera: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model("MateriasPrimas", materiaPrima, "MateriasPrimas");
