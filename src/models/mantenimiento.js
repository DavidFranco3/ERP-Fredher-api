const mongoose = require("mongoose");
const { Schema } = mongoose;

const mantenimiento = new Schema({
    nombreEquipo: { type: String },
    departamento: { type: String },
    planMantenimiento: { type: String },
    descripcion: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Mantenimiento", mantenimiento, "Mantenimiento");
