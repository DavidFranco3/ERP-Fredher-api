const express = require("express");
const router = express.Router();
const tiquets = require("../models/tiquet");

// Registro de tiquets
router.post("/registro", async (req, res) => {
    const nuevoTiquet = tiquets(req.body);
    await nuevoTiquet
        .save()
        .then((nombre) =>
            res.status(200).json(
                {
                    mensaje: "Registro exitoso del tiquet"
                }
            ))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los tiquets
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await tiquets
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los tiquets
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await tiquets
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un tiquet en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await tiquets
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un usuario tiquet
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await tiquets
        .remove({ _id: id })
        .then((data) => res.status(200).json({ status: "Tiquet eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del tiquet
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { pedidoVenta: { numeroPedido, descripcionPedido }, ordenCompra: { numeroCompra, descripcionCompra }, ordenProduccion: { numeroOrden, descripcionOrden }, almacen: { numeroAlmacen, descripcionAlmacen }, embarque: { numeroEmbarque, descripcionEmbarque }, logistica: { descripcionLogistica, numeroLogistica } } = req.body;
    await tiquets
        .updateOne({ _id: id }, { $set: { pedidoVenta: { numero: numeroPedido, descripcion: descripcionPedido }, ordenCompra: { numero: numeroCompra, descripcion: descripcionCompra }, ordenProduccion: { numero: numeroOrden, descripcion: descripcionOrden }, almacen: { numero: numeroAlmacen, descripcion: descripcionAlmacen }, embarque: { numero: numeroEmbarque, descripcion: descripcionEmbarque }, logistica: { numero: descripcionLogistica, descripcion: numeroLogistica } } })
        .then((data) => res.status(200).json({ status: "Datos actualizados" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
