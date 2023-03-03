const express = require("express");
const router = express.Router();
const integracionVentasGastos = require("../models/integracionVentasGastos");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar pedidos de venta con el mismo folio
    const busqueda = await integracionVentasGastos.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una integracion de ventas y gastos con este folio" });
    } else {
        const integraciones = integracionVentasGastos(req.body);
        await integraciones
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado la integracion de ventas y gastos", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await integracionVentasGastos
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de venta
router.get("/obtenerFactura", async (req, res) => {
    const registroIntegracionVentasGastos = await integracionVentasGastos.find().count();
    if (registroIntegracionVentasGastos === 0) {
        res.status(200).json({ factura: "FAC-1" })
    } else {
        const ultimaIntegracion = await integracionVentasGastos.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaIntegracion.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ factura: "FAC-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar los pedidos de venta registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await integracionVentasGastos
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroIntegraciones = await integracionVentasGastos.find().count();
    if (registroIntegraciones === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await integracionVentasGastos
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
    await integracionVentasGastos
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await integracionVentasGastos
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un pedido de venta segun el folio
router.get("/obtenerDatosPedido/:folio", async (req, res) => {
    const { folio } = req.params;

    await integracionVentasGastos
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await integracionVentasGastos
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "integracion eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del pedido de venta
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await integracionVentasGastos
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Integración de ventas y gastos cancelada correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { fechaFactura, cliente, importe, iva, total, observaciones } = req.body;
    await integracionVentasGastos
        .updateOne({ _id: id }, { $set: { fechaFactura, cliente, importe, iva, total, observaciones } })
        .then((data) => res.status(200).json({ mensaje: "Información de la integracion de ventas y gastos actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
