const mongoose = require("mongoose");
const { Schema } = mongoose;

const unidadesMedida = new Schema({
    nombre: { type: String },
    sucursal: { type: String },
    estadoUM: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("UnidadesMedida", unidadesMedida, "UnidadesMedida");
