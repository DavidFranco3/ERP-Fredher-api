const mongoose = require("mongoose");
const { Schema } = mongoose;

const maquinas = new Schema({
    numeroMaquina: {type: String},
    marca: {type: String},
    tonelaje: {type: String},
    lugar: {type: String},
    status: {type: String}
}, {
    timestamps: true
});

module.exports = mongoose.model("Maquinas", maquinas, "Maquinas");