const mongoose = require("mongoose");
const { Schema } = mongoose;

const productosOV = new Schema({
    ordenVenta: { type: String },
    numeroParte: { type: String },
    descripcion: { type: String },
    cantidad: { type: String },
    um: { type: String },
    precioUnitario: { type: String },
    total: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("ProductosOV", productosOV, "ProductosOV");
