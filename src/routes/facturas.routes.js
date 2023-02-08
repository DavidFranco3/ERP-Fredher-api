const express = require("express");
const router = express.Router();
const facturas = require("../models/facturas");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar cuentas por cobrar con el mismo folio
    const busqueda = await facturas.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una factura con este folio" });
    } else {
        const pedidos = facturas(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado la factura", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await facturas
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los pedidos
router.get("/listarPorCliente", async (req, res) => {
    const { sucursal, cliente } = req.query;

    await facturas
        .find({ sucursal, cliente })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los pedidos
router.get("/listarActivas", async (req, res) => {
    const { sucursal } = req.query;

    await facturas
        .find({ sucursal, estado: "true" })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de cuenta
router.get("/obtenerNoFactura", async (req, res) => {
    const registroFactura = await facturas.find().count();
    if (registroFactura === 0) {
        res.status(200).json({ noFactura: "FACT-1" })
    } else {
        const ultimaCuenta = await facturas.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaCuenta.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noFactura: "FACT-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar las cuentas por cobrar registradas
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await facturas
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
    await facturas
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await facturas
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una cuenta por cobrar segun el folio
router.get("/obtenerDatosFactura/:folio", async (req, res) => {
    const { folio } = req.params;

    await facturas
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await facturas
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Cuenta eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado de la cuenta por cobrar
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await facturas
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Cuenta por cobrar cancelada correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { ordenVenta, cliente, nombreCliente, fechaEmision, fechaVencimiento, nombreContacto, telefono, correo, productos, iva, ivaElegido, subtotal, total } = req.body;
    await facturas
        .updateOne({ _id: id }, { $set: { ordenVenta, cliente, nombreCliente, fechaEmision, fechaVencimiento, nombreContacto, telefono, correo, productos, iva, ivaElegido, subtotal, total } })
        .then((data) => res.status(200).json({ mensaje: "Información de la cuenta por cobrar actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
