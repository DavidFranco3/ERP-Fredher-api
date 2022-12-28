const mongoose = require("mongoose");
const { Schema } = mongoose;

const logCompras = new Schema({
    descripcion: { type: String },
    sucursal: {type: String},
    imagenes: { type: Array, default: [] },
    liberado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("LogCompras", logCompras, "LogCompras");
