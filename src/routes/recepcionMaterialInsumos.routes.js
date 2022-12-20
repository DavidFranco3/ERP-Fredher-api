const express = require("express");
const router = express.Router();
const requerimiento = require("../models/recepcionMaterialInsumos");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar requerimientos con el mismo folio
    const busqueda = await requerimiento.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe un pedido de requerimiento con este folio" });
    } else {
        const requerimientos = requerimiento(req.body);
        await requerimientos
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado el requerimiento", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    await requerimiento
        .find()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de requerimiento
router.get("/obtenerNoRecepcion", async (req, res) => {
    const registroRequerimiento = await requerimiento.find().count();
    if (registroRequerimiento === 0) {
        res.status(200).json({ noRequerimiento: "RMI-1" })
    } else {
        const ultimoRequerimiento = await requerimiento.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimoRequerimiento.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noRequerimiento: "RMI-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar los requerimientos registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await requerimiento
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
    await requerimiento
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await requerimiento
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un requerimiento segun el folio
router.get("/obtenerDatosRecepcion/:folio", async (req, res) => {
    const { folio } = req.params;

    await requerimiento
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await requerimiento
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Recepcion eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del requerimiento
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await requerimiento
        .updateOne({ _id: id }, { $set: { status } })
        .then((data) => res.status(200).json({ mensaje: "Estado del requerimiento actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { folio, fechaRecepcion, proveedor, nombreProveedor, ordenCompra, precio, cantidad, valorTotal, productos } = req.body;
    await requerimiento
        .updateOne({ _id: id }, { $set: { folio, fechaRecepcion, proveedor, nombreProveedor, ordenCompra, precio, cantidad, valorTotal, productos } })
        .then((data) => res.status(200).json({ mensaje: "Información del requerimiento actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
