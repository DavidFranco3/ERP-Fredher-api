const mongoose = require("mongoose");
const { Schema } = mongoose;

const logEmbarque = new Schema({
    descripcion: { type: String },
    imagenes: { type: Array, default: [] },
    liberado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("LogEmbarque", logEmbarque, "LogEmbarque");
