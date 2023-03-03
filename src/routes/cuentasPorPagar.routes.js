const express = require("express");
const router = express.Router();
const cuentasPorPagar = require("../models/cuentasPorPagar");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar cuentas por cobrar con el mismo folio
    const busqueda = await cuentasPorPagar.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una cuenta por pagar con este folio" });
    } else {
        const pedidos = cuentasPorPagar(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado la cuenta por pagar", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await cuentasPorPagar
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los pedidos
router.get("/listarPorProveedor", async (req, res) => {
    const { sucursal, proveedor } = req.query;

    await cuentasPorPagar
        .find({ sucursal, proveedor })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los pedidos
router.get("/listarActivas", async (req, res) => {
    const { sucursal } = req.query;

    await cuentasPorPagar
        .find({ sucursal, estado: "true" })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de cuenta
router.get("/obtenerNoCuentaPagar", async (req, res) => {
    const registroCuenta = await cuentasPorPagar.find().count();
    if (registroCuenta === 0) {
        res.status(200).json({ noCuenta: "CXP-1" })
    } else {
        const ultimaCuenta = await cuentasPorPagar.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaCuenta.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noCuenta: "CXP-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar las cuentas por cobrar registradas
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await cuentasPorPagar
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
    await cuentasPorPagar
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await cuentasPorPagar
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una cuenta por cobrar segun el folio
router.get("/obtenerDatosCuentaPagar/:folio", async (req, res) => {
    const { folio } = req.params;

    await cuentasPorPagar
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await cuentasPorPagar
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Cuenta por pagar eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado de la cuenta por cobrar
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await cuentasPorPagar
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Cuenta por pagar cancelada correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { ordenCompra, proveedor, nombreProveedor, fechaEmision, fechaVencimiento, nombreContacto, telefono, correo, productos, iva, ivaElegido, subtotal, total } = req.body;
    await cuentasPorPagar
        .updateOne({ _id: id }, { $set: { ordenCompra, proveedor, nombreProveedor, fechaEmision, fechaVencimiento, nombreContacto, telefono, correo, productos, iva, ivaElegido, subtotal, total } })
        .then((data) => res.status(200).json({ mensaje: "Información de la cuenta por pagar actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
