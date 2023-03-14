const express = require("express");
const router = express.Router();
const cuentasProveedores = require("../models/cuentasProveedores");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { proveedor } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar cuentas por cobrar con el mismo folio
    const busqueda = await cuentasProveedores.findOne({ proveedor });

    if (busqueda && busqueda.proveedor === proveedor) {
        return res.status(401).json({ mensaje: "Ya existe una cuenta para este proveedor" });
    } else {
        const pedidos = cuentasProveedores(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado la cuenta del proveedor", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await cuentasProveedores
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los pedidos
router.get("/listarActivas", async (req, res) => {
    const { sucursal } = req.query;

    await cuentasProveedores
        .find({ sucursal, estado: "true" })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de cuenta
router.get("/obtenerNoCuenta", async (req, res) => {
    const registroCuenta = await cuentasProveedores.find().count();
    if (registroCuenta === 0) {
        res.status(200).json({ noCuenta: "CP-1" })
    } else {
        const ultimaCuenta = await cuentasProveedores.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaCuenta.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noCuenta: "CP-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar las cuentas por cobrar registradas
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await cuentasProveedores
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un pedido en especifico
router.get("/obtener/:proveedor", async (req, res) => {
    const { proveedor } = req.params;
    //console.log("buscando")
    await cuentasProveedores
        .findOne({ proveedor })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await cuentasProveedores
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una cuenta por cobrar segun el folio
router.get("/obtenerDatosCuenta/:folio", async (req, res) => {
    const { folio } = req.params;

    await cuentasProveedores
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await cuentasProveedores
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Cuenta eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado de la cuenta por cobrar
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await cuentasProveedores
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Cuenta por cobrar cancelada correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:proveedor", async (req, res) => {
    const { proveedor } = req.params;
    const { total } = req.body;
    await cuentasProveedores
        .updateOne({ proveedor: proveedor }, { $set: { total } })
        .then((data) => res.status(200).json({ mensaje: "Información de la cuenta del proveedor actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
