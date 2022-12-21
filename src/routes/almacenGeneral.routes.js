const express = require("express");
const router = express.Router();
const almacenGeneral = require("../models/almacenGeneral");

// Registro inicial en almacen general
router.post("/registroInicial", async (req, res) => {
    const { folioAlmacen } = req.body;

    // Inicia validacion para no registrar datos con el mismo folio
    const busqueda = await almacenGeneral.findOne({ folioAlmacen });

    if (busqueda && busqueda.folioAlmacen === folioAlmacen) {
        return res.status(401).json({ mensaje: "Ya existe un registro con este folio" });
    } else {
        const pedidos = almacenGeneral(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado correctamente el artículo en el almacén general", datos: data }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Registro inicial en almacen general
router.post("/registroGestion", async (req, res) => {
    const { folioInsumo } = req.body;

    // Inicia validacion para no registrar datos con el mismo folio
    const busqueda = await almacenGeneral.findOne({ folioInsumo });

    if (busqueda && busqueda.folioInsumo === folioInsumo) {
        return res.status(401).json({ mensaje: "Ya existe un registro con este folio" });
    } else {
        const pedidos = almacenGeneral(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado correctamente el artículo en el almacén general", datos: data }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los registros del almacén general
router.get("/listar", async (req, res) => {
    await almacenGeneral
        .find()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el folio actual
router.get("/obtenerFolio", async (req, res) => {
    const registroalmacenGeneral = await almacenGeneral.find().count();
    if (registroalmacenGeneral === 0) {
        res.status(200).json({ folio: "AG-1" })
    } else {
        const ultimaAlmacen = await almacenGeneral.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaAlmacen.folioAlmacen.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ folio: "AG-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar paginando los datos del almacén general
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await almacenGeneral
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await almacenGeneral
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un articulo del almacen general en especifico segun el id especificado
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;

    await almacenGeneral
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una materia prima segun el folio de la materia prima
router.get("/obtenerDatosAG/:folioAlmacen", async (req, res) => {
    const { folioMP } = req.params;

    await almacenGeneral
        .findOne({ folioMP })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get("/obtenerDatosFolioInsumo/:folioInsumo", async (req, res) => {
    const { folioInsumo } = req.params;

    await almacenGeneral
        .findOne({ folioInsumo })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener el listado de movimientos de un articulo del almacen general, segun el folio del almacen
router.get("/listarMovimientosAG/:folioAlmacen", async (req, res) => {
    const { folioAlmacen } = req.params;

    await almacenGeneral
        .findOne({ folioAlmacen })
        .then((data) => {
            res.status(200).json(data.movimientos.reverse())
        })
        .catch((error) => res.json({ message: error }));
});

// Borrar un articulo del almacen general
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await almacenGeneral
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Atención!, Materia artículo eliminado del almacén general" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar estado de artículo del almacén general
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, um, tipo, estado } = req.body;
    await almacenGeneral
        .updateOne({ _id: id }, { $set: { nombre, descripcion, um, tipo, estado } })
        .then((data) => res.status(200).json({ mensaje: "Artículo del almacén general actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Registro de entrada y salida de almacen de materias primas
router.put("/registraMovimientos/:id", async (req, res) => {
    const { id } = req.params;
    const { movimientos, existenciasOV, existenciasStock, existenciasTotales } = req.body;
    await almacenGeneral
        .updateOne({ _id: id }, { $set: { movimientos, existenciasOV, existenciasStock, existenciasTotales } })
        .then((data) => res.status(200).json({ mensaje: "Se ha registrado un movimiento de PT del almacén", datos: data }))
        .catch((error) => res.json({ message: error }));
});

// Modifica existencias de PT del almacen
router.put("/modificaExistencias/:id", async (req, res) => {
    const { id } = req.params;
    const { existenciasOV, existenciasStock, existenciasTotales } = req.body;
    await almacenGeneral
        .updateOne({ _id: id }, { $set: { existenciasOV, existenciasStock, existenciasTotales } })
        .then((data) => res.status(200).json({ mensaje: "Existencias del artículo en almacén general actualizadas" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
