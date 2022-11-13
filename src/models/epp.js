const mongoose = require("mongoose");
const { Schema } = mongoose;

const epp = new Schema({
    nombre: { type: String },
    descripcion: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("EPP", epp, "EPP");
