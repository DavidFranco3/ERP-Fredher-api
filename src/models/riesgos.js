const mongoose = require("mongoose");
const { Schema } = mongoose;

const riesgos = new Schema({
    nombre: { type: String },
    departamento: { type: String },
    descripcion: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model("Riesgos", riesgos, "Riesgos");
