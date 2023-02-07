const express = require("express");
const router = express.Router();
const programaMantenimientoPreventivo = require("../models/programaMantenimientoPreventivo");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { item } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar pedidos de venta con el mismo folio
    const busqueda = await programaMantenimientoPreventivo.findOne({ item });

    if (busqueda && busqueda.item === item) {
        return res.status(401).json({ mensaje: "Ya existe un programa de mantenimiento preventivo con este ITEM" });
    } else {
        const inventarios = programaMantenimientoPreventivo(req.body);
        await inventarios
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado el programa de mantenimiento preventivo", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await programaMantenimientoPreventivo
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar los pedidos de venta registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await programaMantenimientoPreventivo
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroInventario = await programaMantenimientoPreventivo.find().count();
    if (registroInventario === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await programaMantenimientoPreventivo
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }
});

// Obtener un pedido en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await programaMantenimientoPreventivo
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await programaMantenimientoPreventivo
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await programaMantenimientoPreventivo
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Programa de mantenimiento preventivo eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del pedido de venta
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await programaMantenimientoPreventivo
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Programa de mantenimiento preventivo cancelado correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { ident, descripcion, fechasProgramadas, fechasReales, comentarios } = req.body;
    await programaMantenimientoPreventivo
        .updateOne({ _id: id }, { $set: { ident, descripcion, fechasProgramadas, fechasReales, comentarios } })
        .then((data) => res.status(200).json({ mensaje: "Información del programa de mantenimiento preventivo actualizado correctamente" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
