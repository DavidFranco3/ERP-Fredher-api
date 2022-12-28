const mongoose = require("mongoose");
const { Schema } = mongoose;

const embarques = new Schema({
    unidadAlmacen: { type: String },
    unidadTransporte: { type: String },
    fechaCarga: { type: Date },
    sucursal: {type: String},
    fechaPartida: { type: Date }
}, {
    timestamps: true
});

module.exports = mongoose.model("Embarques", embarques, "Embarques");
