const express = require("express");
const router = express.Router();
const inventarioMaquinas = require("../models/inventarioMaquinas");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { item } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar pedidos de venta con el mismo folio
    const busqueda = await inventarioMaquinas.findOne({ item });

    if (busqueda && busqueda.item === item) {
        return res.status(401).json({ mensaje: "Ya existe un inventario con este ITEM" });
    } else {
        const inventarios = inventarioMaquinas(req.body);
        await inventarios
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado el inventario de maquina", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await inventarioMaquinas
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

    await inventarioMaquinas
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroInventario = await inventarioMaquinas.find().count();
    if (registroInventario === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await inventarioMaquinas
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
    await inventarioMaquinas
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await inventarioMaquinas
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await inventarioMaquinas
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "inventario eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del pedido de venta
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await inventarioMaquinas
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Inventario de maquina cancelado correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { tipo, codigo, noMaquina, descripcion, capacidad, unidades, marca, modelo, noSerie, fechaAdquisicion } = req.body;
    await inventarioMaquinas
        .updateOne({ _id: id }, { $set: { tipo, codigo, noMaquina, descripcion, capacidad, unidades, marca, modelo, noSerie, fechaAdquisicion } })
        .then((data) => res.status(200).json({ mensaje: "Información del inventario de maquina actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
