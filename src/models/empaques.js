const mongoose = require("mongoose");
const { Schema } = mongoose;

const empaques = new Schema({
    folio: { type: String },
    nombre: {type: String},
    um: {type: String},
    precio: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model("Empaques", empaques, "Empaques");
