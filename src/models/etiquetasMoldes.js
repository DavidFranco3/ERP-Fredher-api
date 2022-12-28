const mongoose = require("mongoose");
const { Schema } = mongoose;

const etiquetasMoldes = new Schema({
    folio: {type: String},
    idInterno: {type: String},
    noIterno: {type: String},
    sucursal: {type: String},
    cavidad: {type: String},
    descripcion: {type: String},
    cliente: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model("EtiquetasMoldes", etiquetasMoldes, "EtiquetasMoldes");