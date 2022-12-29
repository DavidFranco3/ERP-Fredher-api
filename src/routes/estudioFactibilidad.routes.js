const express = require("express");
const router = express.Router();
const estudioFactibilidad = require("../models/estudiosFactibilidad");

// Registro de estudios de factibilidad
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar pedidos de venta con el mismo folio
    const busqueda = await estudioFactibilidad.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe un estudio de factibilidad con este folio" });
    } else {
        const pedidos = estudioFactibilidad(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado el estudio de factibilidad", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los estudios de factibilidad
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await estudioFactibilidad
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el folio actual
router.get("/obtenerFolioActual", async (req, res) => {
    const registroEstudiosFactibilidad = await estudioFactibilidad.find().count();
    if (registroEstudiosFactibilidad === 0) {
        res.status(200).json({ noEstudio: "1" })
    } else {
        const ultimoEstudio = await estudioFactibilidad.findOne().sort({ _id: -1 });
        //console.log(ultimaEstudio)
        const tempFolio = parseInt(ultimoEstudio.folio) + 1
        res.status(200).json({ noEstudio: tempFolio.toString() })
    }
});

// Listar paginando los estudios registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await estudioFactibilidad
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await estudioFactibilidad
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un estudio en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await estudioFactibilidad
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un estudio de factibilidad segun el folio
router.get("/obtenerDatos/:folio", async (req, res) => {
    const { folio } = req.params;

    await estudioFactibilidad
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un estudio de factibilidad
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await estudioFactibilidad
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Estudio de factibilidad eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del estudio de factibilidad
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { folio, cliente, fechaCreacion, noParte, nombreProducto, seccion1, seccion2, seccion3, seccion4, seccion5, resultados } = req.body;
    await estudioFactibilidad
        .updateOne({ _id: id }, { $set: { folio, cliente, fechaCreacion, noParte, nombreProducto, seccion1, seccion2, seccion3, seccion4, seccion5, resultados } })
        .then((data) => res.status(200).json({ mensaje: "Información del estudio de factibilidad actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
