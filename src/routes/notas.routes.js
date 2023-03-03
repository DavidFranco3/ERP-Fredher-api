const express = require("express");
const router = express.Router();
const notas = require("../models/notas");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar notas con el mismo folio
    const busqueda = await notas.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una nota con este folio" });
    } else {
        const pedidos = notas(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado la nota", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await notas
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los pedidos por tipo
router.get("/listarPorTipo", async (req, res) => {
    const { tipo, sucursal } = req.query;

    await notas
        .find({ tipo, sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los pedidos
router.get("/listarActivas", async (req, res) => {
    const { sucursal } = req.query;

    await notas
        .find({ sucursal, estado: "true" })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de nota de credito
router.get("/obtenerNoNotaCredito", async (req, res) => {
    const registroNotas = await notas.find().count();
    if (registroNotas === 0) {
        res.status(200).json({ noNota: "NCRE-1" })
    } else {
        const ultimaNota = await notas.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaNota.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noNota: "NCRE-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Obtener el numero de nota de cargo
router.get("/obtenerNoNotaCargo", async (req, res) => {
    const registroNotas = await notas.find().count();
    if (registroNotas === 0) {
        res.status(200).json({ noNota: "NCAR-1" })
    } else {
        const ultimaNota = await notas.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaNota.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noNota: "NCAR-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Obtener el numero de nota de devolucion
router.get("/obtenerNoNotaDevolucion", async (req, res) => {
    const registroNotas = await notas.find().count();
    if (registroNotas === 0) {
        res.status(200).json({ noNota: "NDEV-1" })
    } else {
        const ultimaNota = await notas.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaNota.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noNota: "NDEV-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar las notas registradas
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await notas
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
    await notas
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await notas
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una nota segun el folio
router.get("/obtenerDatosNota/:folio", async (req, res) => {
    const { folio } = req.params;

    await notas
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una nota
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await notas
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Pedido eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado de la nota
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await notas
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Nota cancelada correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { factura, concepto, totalSinIva, iva, total } = req.body;
    await notas
        .updateOne({ _id: id }, { $set: { factura, concepto, totalSinIva, iva, total } })
        .then((data) => res.status(200).json({ mensaje: "Información de la nota actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
