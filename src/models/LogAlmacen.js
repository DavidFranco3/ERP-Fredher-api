const mongoose = require("mongoose");
const { Schema } = mongoose;

const logAlmacen = new Schema({
    descripcion: { type: String },
    imagenes: { type: Array, default: [] },
    liberado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("LogAlmacen", logAlmacen, "LogAlmacen");
