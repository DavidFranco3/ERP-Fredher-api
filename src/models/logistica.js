const mongoose = require("mongoose");
const { Schema } = mongoose;

const logistica = new Schema({
    embarqueEnviado: { type: String },
    fechaPartida: { type: Date },
    costos: {
        costoIda: { type: String },
        costoVuelta: { type: String },
    },
    ubicacionVehiculo: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Logistica", logistica, "Logistica");
