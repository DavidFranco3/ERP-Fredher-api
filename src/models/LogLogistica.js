const mongoose = require("mongoose");
const { Schema } = mongoose;

const logLogistica = new Schema({
    descripcion: { type: String },
    imagenes: { type: Array, default: [] },
    liberado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("LogLogistica", logLogistica, "LogLogistica");
