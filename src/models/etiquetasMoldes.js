const mongoose = require("mongoose");
const { Schema } = mongoose;

const etiquetasMoldes = new Schema({
    folio: { type: String },
    idInterno: { type: String },
    noInterno: { type: String },
    noParte: { type: String },
    sucursal: { type: String },
    cavidad: { type: String },
    descripcion: { type: String },
    cliente: { type: String },
    estado: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model("EtiquetasMoldes", etiquetasMoldes, "EtiquetasMoldes");