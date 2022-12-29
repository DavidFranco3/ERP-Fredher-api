const express = require("express");
const router = express.Router();
const tracking = require("../models/tracking");

// Registro de nuevo tracking
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar tracking con el mismo folio
    const busqueda = await tracking.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe un tracking con este folio" });
    } else {
        const pedidos = tracking(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado el tracking", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los tracking
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await tracking
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de tracking actual
router.get("/obtenerNoTracking", async (req, res) => {
    const registroTracking = await tracking.find().count();
    if (registroTracking === 0) {
        res.status(200).json({ noTracking: "1" })
    } else {
        const ultimoTracking = await tracking.findOne().sort({ _id: -1 });
        console.log(ultimoTracking)
        const tempFolio = parseInt(ultimoTracking.folio) + 1
        res.status(200).json({ noTracking: tempFolio.toString() })
    }
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await tracking
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar los tracking paginandolos
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await tracking
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un tracking en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await tracking
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener los datos de un tracking segun el orden de venta solicitado
router.get("/obtenerTracking/:ordenVenta", async (req, res) => {
    const { ordenVenta } = req.params;

    await tracking
        .findOne({ ordenVenta })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un tracking
router.delete("/eliminar/:ordenVenta", async (req, res) => {
    const { ordenVenta } = req.params;
    await tracking
        .remove({ ordenVenta: ordenVenta })
        .then((data) => res.status(200).json({ status: "Tracking eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del tracking
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { status, indicador } = req.body;
    await tracking
        .updateOne({ _id: id }, { $set: { status, indicador } })
        .then((data) => res.status(200).json({ mensaje: "Estado del tracking actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:ordenVenta", async (req, res) => {
    const { ordenVenta } = req.params;
    const { status, indicador } = req.body;
    await tracking
        .updateOne({ ordenVenta: ordenVenta }, { $set: { status, indicador } })
        .then((data) => res.status(200).json({ mensaje: "Información del tracking" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
