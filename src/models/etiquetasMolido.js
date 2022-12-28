const mongoose = require("mongoose");
const { Schema } = mongoose;

const etiquetasMolido = new Schema({
    item: {type: String},
    folio: {type: String},
    fecha: {type: String},
    turno: {type: String},
    sucursal: {type: String},
    descripcion: {type: String},
    color: {type: String},
    peso: {type: String},
    nombreMolinero: {type: String}
}, {
    timestamps: true
});

module.exports = mongoose.model("EtiquetasMolido", etiquetasMolido, "EtiquetasMolido");