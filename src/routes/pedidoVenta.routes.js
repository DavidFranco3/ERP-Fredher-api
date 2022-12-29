const express = require("express");
const router = express.Router();
const pedidoVenta = require("../models/ventas");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar pedidos de venta con el mismo folio
    const busqueda = await pedidoVenta.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe un pedido de venta con este folio" });
    } else {
        const pedidos = pedidoVenta(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado el pedido de venta", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await pedidoVenta
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de venta
router.get("/obtenerNoVenta", async (req, res) => {
    const registroPedidosVenta = await pedidoVenta.find().count();
    if (registroPedidosVenta === 0) {
        res.status(200).json({ noVenta: "OV-1" })
    } else {
        const ultimaVenta = await pedidoVenta.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaVenta.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noVenta: "OV-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar los pedidos de venta registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await pedidoVenta
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un pedido en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await pedidoVenta
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await pedidoVenta
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un pedido de venta segun el folio
router.get("/obtenerDatosPedido/:folio", async (req, res) => {
    const { folio } = req.params;

    await pedidoVenta
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await pedidoVenta
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Pedido eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del pedido de venta
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await pedidoVenta
        .updateOne({ _id: id }, { $set: { status } })
        .then((data) => res.status(200).json({ mensaje: "Estado del pedido de venta actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { fechaElaboracion, fechaEntrega, cliente, nombreCliente, incoterms, especificaciones, condicionesPago, ordenCompra, cotizacion, numeroPedido, lugarEntrega, total, productos } = req.body;
    await pedidoVenta
        .updateOne({ _id: id }, { $set: { fechaElaboracion, fechaEntrega, cliente, nombreCliente, incoterms, especificaciones, condicionesPago, ordenCompra, cotizacion, numeroPedido, lugarEntrega, total, productos } })
        .then((data) => res.status(200).json({ mensaje: "Información del pedido de venta actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
