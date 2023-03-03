const express = require("express");
const router = express.Router();
const planeacion = require("../models/planeacion");

// Registro de planeación
router.post("/registro", async (req, res) => {
    const { folio } = req.body;

    // Inicia validacion para no registrar planeaciones con el mismo folio
    const busqueda = await planeacion.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una planeación con este folio" });
    } else {
        const pedidos = planeacion(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado la planeación", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas las planeaciones
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await planeacion
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el folio de la planeación
router.get("/obtenerFolio", async (req, res) => {
    const registroPedidosVenta = await planeacion.find().count();
    if (registroPedidosVenta === 0) {
        res.status(200).json({ noPlaneacion: "P-1" })
    } else {
        const ultimaPlaneacion = await planeacion.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaPlaneacion.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noPlaneacion: "P-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar las planeaciones registradas paginandolas
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await planeacion
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await planeacion
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una planeacion en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await planeacion
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una planeación segun el folio
router.get("/obtenerDatos/:folio", async (req, res) => {
    const { folio } = req.params;

    await planeacion
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una planeación segun un orden de venta
router.get("/obtenxOrdenVenta/:ordenVenta", async (req, res) => {
    const { ordenVenta } = req.params;

    await planeacion
        .findOne({ ordenVenta })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una planeación
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await planeacion
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Planeación eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar, dando visto bueno a planeación, por producto
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { productos, detalles, estado } = req.body;
    await planeacion
        .updateOne({ _id: id }, { $set: { productos, detalles, estado } })
        .then((data) => res.status(200).json({ mensaje: "Cambio de estado de aprobacion completado" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
