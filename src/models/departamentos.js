const mongoose = require("mongoose");
const { Schema } = mongoose;

const departamentos = new Schema({
    nombre: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Departamentos", departamentos, "Departamentos");
