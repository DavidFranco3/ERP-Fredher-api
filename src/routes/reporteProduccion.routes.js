const express = require("express");
const router = express.Router();
const reportesProduccion = require("../models/reporteProduccion");

// Registro de reportes de producción
router.post("/registro", async (req, res) => {
    const { folio } = req.body;

    // Inicia validation para no registrar reportes de producción con el mismo folio
    const busqueda = await reportesProduccion.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya se ha registrado un reporte de producción con ese folio" });
    } else {
        const datosReporteProduccion = reportesProduccion(req.body);
        await datosReporteProduccion
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso del reporte de producción"
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }

});

// Obtener todos los reportes de producción
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await reportesProduccion
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los reportes de producción
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await reportesProduccion
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await reportesProduccion
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un reporte de producción en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await reportesProduccion
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el actual de folio del reporte de producción
router.get("/obtenerNoReporte", async (req, res) => {
    const registroReportesProduccion = await reportesProduccion.find().count();
    if (registroReportesProduccion === 0) {
        res.status(200).json({ folio: "1" })
    } else {
        const ultimoReporte = await reportesProduccion.findOne().sort({ _id: -1 });
        const tempFolio = parseInt(ultimoReporte.folio) + 1
        res.status(200).json({ folio: tempFolio.toString() })
    }
});

// Para actualizar el estado del pedido de venta
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await reportesProduccion
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Reporte de producción cancelado" }))
        .catch((error) => res.json({ message: error }));
});

// Borrar un reporte de producción
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await reportesProduccion
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Reporte de producción eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del reporte de producción
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { supervisor, turno, asistencias, faltas, fecha, registros, eficienciaGeneralMaquinas, observacionesTurno } = req.body;

    await reportesProduccion
        .updateOne({ _id: id }, { $set: { supervisor, turno, asistencias, faltas, fecha, registros, eficienciaGeneralMaquinas, observacionesTurno } })
        .then((data) => res.status(200).json({ mensaje: "Datos del reporte de producción actualizados" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
