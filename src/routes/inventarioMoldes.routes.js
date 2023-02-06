const express = require("express");
const router = express.Router();
const inventarioMoldes = require("../models/inventarioMoldes");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { item } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar pedidos de venta con el mismo folio
    const busqueda = await inventarioMoldes.findOne({ item });

    if (busqueda && busqueda.item === item) {
        return res.status(401).json({ mensaje: "Ya existe un inventario con este ITEM" });
    } else {
        const inventarios = inventarioMoldes(req.body);
        await inventarios
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado el inventario de molde", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await inventarioMoldes
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

    await inventarioMoldes
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroInventario = await inventarioMoldes.find().count();
    if (registroInventario === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await inventarioMoldes
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
    await inventarioMoldes
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await inventarioMoldes
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await inventarioMoldes
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "inventario eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del pedido de venta
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await inventarioMoldes
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Inventario de molde cancelado correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { noInterno, cliente, noMolde, cavMolde, noParte, descripcion, statusMolde } = req.body;
    await inventarioMoldes
        .updateOne({ _id: id }, { $set: { noInterno, cliente, noMolde, cavMolde, noParte, descripcion, statusMolde } })
        .then((data) => res.status(200).json({ mensaje: "Información del inventario de molde actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
