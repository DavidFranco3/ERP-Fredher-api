const mongoose = require("mongoose");
const { Schema } = mongoose;

const logProduccionSchema = new Schema({
    descripcion: { type: String },
    imagenes: { type: Array, default: [] },
    sucursal: {type: String},
    liberado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("LogProduccion", logProduccionSchema, "LogProduccion");
