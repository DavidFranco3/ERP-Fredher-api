const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificaciones = new Schema({
    titulo: { type: String },
    url: { type: String },
    detalles: { type: String },
    departamentoEmite: { type: String },
    departamentoDestino: { type: String },
    estadoNotificacion: { type: String },
    status: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Notificaciones", notificaciones, "Notificaciones");
