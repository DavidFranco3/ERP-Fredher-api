const express = require("express");
const router = express.Router();
const semana = require("../models/semana");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar meses con el mismo folio
    const busqueda = await semana.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una semana con este folio" });
    } else {
        const pedidos = semana(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado la semana", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await semana
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los pedidos
router.get("/listarPorSemana", async (req, res) => {
    const { sucursal, folio } = req.query;

    await semana
        .find({ sucursal, folio })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de mes
router.get("/obtenerNoSemana", async (req, res) => {
    const registroSemana = await semana.find().count();
    if (registroSemana === 0) {
        res.status(200).json({ noSemana: "Semana-1" })
    } else {
        const ultimoMes = await semana.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimoMes.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noSemana: "Semana-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar los meses registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await semana
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
    await semana
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await semana
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un mes segun el folio
router.get("/obtenerDatosSemana/:folio", async (req, res) => {
    const { folio } = req.params;

    await semana
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await semana
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Semana eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del mes
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await semana
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Semana cancelada correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { fechaInicial, fechaFinal } = req.body;
    await semana
        .updateOne({ _id: id }, { $set: { fechaInicial, fechaFinal } })
        .then((data) => res.status(200).json({ mensaje: "Información de la semana actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
