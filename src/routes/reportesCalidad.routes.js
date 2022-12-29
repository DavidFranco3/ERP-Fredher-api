const express = require("express");
const router = express.Router();
const reportesCalidad = require("../models/calidad");

// Registro de reportes de calidad
router.post("/registro", async (req, res) => {
    const { folio } = req.body;

    // Inicia validacion para no registrar reportes de calidad con el mismo folio
    const busqueda = await reportesCalidad.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya se ha registrado un reporte de calidad con ese folio" });
    } else {
        const reportesCalidadRegistrar = reportesCalidad(req.body);
        await reportesCalidadRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso del reporte"
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }

});

// Obtener todos los reportes de calidad
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await reportesCalidad
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los reportes de calidad
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await reportesCalidad
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await reportesCalidad
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una reporte de calidad en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await reportesCalidad
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el actual de folio del reporte de calidad
router.get("/obtenerNoReportesCalidad", async (req, res) => {
    const registroreportesCalidad = await reportesCalidad.find().count();
    if (registroreportesCalidad === 0) {
        res.status(200).json({ folioReporte: "1" })
    } else {
        const ultimaReporte = await reportesCalidad.findOne().sort({ _id: -1 });
        const tempFolio = parseInt(ultimaReporte.folio) + 1
        res.status(200).json({ folioReporte: tempFolio.toString() })
    }
});

// Borrar una reporte
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await reportesCalidad
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Reporte eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del reporte
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { descripcion, noParte, noOrden, cantidad, turno, operador, supervisor, inspector } = req.body;

    await reportesCalidad
        .updateOne({ _id: id }, { $set: { descripcion, noParte, noOrden, cantidad, turno, operador, supervisor, inspector } })
        .then((data) => res.status(200).json({ mensaje: "Datos del reporte actualizados" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
