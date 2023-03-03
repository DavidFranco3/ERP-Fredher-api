const express = require("express");
const router = express.Router();
const almacenPT = require("../models/almacenPT");

// Registro inicial de PT en almacen
router.post("/registroInicial", async (req, res) => {
    const { folioAlmacen } = req.body;

    // Inicia validacion para no registrar datos con el mismo folio
    const busqueda = await almacenPT.findOne({ folioAlmacen });

    if (busqueda && busqueda.folioAlmacen === folioAlmacen) {
        return res.status(401).json({ mensaje: "Ya existe un registro con este folio" });
    } else {
        const pedidos = almacenPT(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado correctamente el producto terminado", datos: data }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los registros de PT del almacen
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await almacenPT
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get("/obtenerFolio", async (req, res) => {
    const registroAlmacenPT = await almacenPT.find().count();
    if (registroAlmacenPT === 0) {
        res.status(200).json({ noAlmacen: "APT-1" })
    } else {
        const ultimaAlmacen = await almacenPT.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaAlmacen.folioAlmacen.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noAlmacen: "APT-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar paginando el PT del almacen
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await almacenPT
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await almacenPT
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un PT en el almacén en específico segun el id especificado
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;

    await almacenPT
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un PT segun el folio de la materia prima
router.get("/obtenerDatosFolioMP/:folioMP", async (req, res) => {
    const { folioMP } = req.params;

    await almacenPT
        .findOne({ folioMP })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener el listado de movimientos de una materia prima
router.get("/listarMovimientosPT/:folioMP", async (req, res) => {
    const { folioMP } = req.params;

    await almacenPT
        .findOne({ folioMP })
        .then((data) => {
            res.status(200).json(data.movimientos.reverse())
        })
        .catch((error) => res.json({ message: error }));
});

// Borrar un PT del almacen
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await almacenPT
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Atención!, Materia PT eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar estado del PT
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { descripcion, um, estado } = req.body;
    await almacenPT
        .updateOne({ _id: id }, { $set: { descripcion, um, estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado del PT actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Registro de entrada y salida de almacen de materias primas
router.put("/registraMovimientos/:id", async (req, res) => {
    const { id } = req.params;
    const { movimientos, existenciasOV, existenciasStock, existenciasTotales } = req.body;
    await almacenPT
        .updateOne({ _id: id }, { $set: { movimientos, existenciasOV, existenciasStock, existenciasTotales } })
        .then((data) => res.status(200).json({ mensaje: "Se ha registrado un movimiento de PT del almacén", datos: data }))
        .catch((error) => res.json({ message: error }));
});

// Modifica existencias de PT del almacen
router.put("/modificaExistencias/:id", async (req, res) => {
    const { id } = req.params;
    const { existenciasOV, existenciasStock, existenciasTotales } = req.body;
    await almacenPT
        .updateOne({ _id: id }, { $set: { existenciasOV, existenciasStock, existenciasTotales } })
        .then((data) => res.status(200).json({ mensaje: "Existencias de PT del almacén actualizadas" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
