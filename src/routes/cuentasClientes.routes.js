const express = require("express");
const router = express.Router();
const cuentasClientes = require("../models/cuentasClientes");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { cliente } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar cuentas por cobrar con el mismo folio
    const busqueda = await cuentasClientes.findOne({ cliente });

    if (busqueda && busqueda.cliente === cliente) {
        return res.status(401).json({ mensaje: "Ya existe una cuenta para este cliente" });
    } else {
        const pedidos = cuentasClientes(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado la cuenta del cliente", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await cuentasClientes
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los pedidos
router.get("/listarActivas", async (req, res) => {
    const { sucursal } = req.query;

    await cuentasClientes
        .find({ sucursal, estado: "true" })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de cuenta
router.get("/obtenerNoCuenta", async (req, res) => {
    const registroCuenta = await cuentasClientes.find().count();
    if (registroCuenta === 0) {
        res.status(200).json({ noCuenta: "CC-1" })
    } else {
        const ultimaCuenta = await cuentasClientes.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaCuenta.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noCuenta: "CC-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar las cuentas por cobrar registradas
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await cuentasClientes
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un pedido en especifico
router.get("/obtener/:cliente", async (req, res) => {
    const { cliente } = req.params;
    console.log(cliente)
    //console.log("buscando")
    await cuentasClientes
        .findOne({cliente})
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await cuentasClientes
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una cuenta por cobrar segun el folio
router.get("/obtenerDatosCuenta/:folio", async (req, res) => {
    const { folio } = req.params;

    await cuentasClientes
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await cuentasClientes
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Cuenta eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado de la cuenta por cobrar
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await cuentasClientes
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Cuenta por cobrar cancelada correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:cliente", async (req, res) => {
    const { cliente } = req.params;
    const { total } = req.body;
    await cuentasClientes
        .updateOne({ cliente: cliente }, { $set: { total } })
        .then((data) => res.status(200).json({ mensaje: "Información de la cuenta del cliente actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
