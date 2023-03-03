const express = require("express");
const router = express.Router();
const almacenMPRoutes = require("../models/almacenMP");

// Registro inicial de MP en almacen
router.post("/registroInicial", async (req, res) => {
    const { folioAlmacen } = req.body;

    // Inicia validacion para no registrar una materia prima con el mismo folio
    const busqueda = await almacenMPRoutes.findOne({ folioAlmacen });

    if (busqueda && busqueda.folioAlmacen === folioAlmacen) {
        return res.status(401).json({ mensaje: "Ya existe una materia prima con este folio" });
    } else {
        const pedidos = almacenMPRoutes(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado la materia prima", datos: data }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Registro inicial de MP en almacen
router.post("/registroGestion", async (req, res) => {
    const { folioMP } = req.body;

    // Inicia validacion para no registrar una materia prima con el mismo folio
    const busqueda = await almacenMPRoutes.findOne({ folioMP });

    if (busqueda && busqueda.folioMP === folioMP) {
        return res.status(401).json({ mensaje: "Esta materia prima ya esta registrada" });
    } else {
        const pedidos = almacenMPRoutes(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado la materia prima", datos: data }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas las materias primas del almacen
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await almacenMPRoutes
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el folio actual de las materis primas
router.get("/obtenerFolio", async (req, res) => {
    const registroAlmacenMP = await almacenMPRoutes.find().count();
    if (registroAlmacenMP === 0) {
        res.status(200).json({ noAlmacen: "AMP-1" })
    } else {
        const ultimaAlmacen = await almacenMPRoutes.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaAlmacen.folioAlmacen.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noAlmacen: "AMP-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroAlmacenMP = await almacenMPRoutes.find().count();
    if (registroAlmacenMP === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await almacenMPRoutes
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }
});

// Listar las materias primas registradas paginandolas
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await almacenMPRoutes
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await almacenMPRoutes
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una materia prima en especifico segun el id especificado
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await almacenMPRoutes
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una materia prima segun el folio de la materia prima
router.get("/obtenerDatosFolioMP/:folioAlmacen", async (req, res) => {
    const { folioAlmacen } = req.params;

    await almacenMPRoutes
        .findOne({ folioAlmacen })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una materia prima segun el folio de la materia prima
router.get("/obtenerDatosMP/:folioMP", async (req, res) => {
    const { folioMP } = req.params;

    await almacenMPRoutes
        .findOne({ folioMP })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener el listado de movimientos de una materia prima
router.get("/listarMovimientosMP/:folioAlmacen", async (req, res) => {
    const { folioAlmacen } = req.params;

    await almacenMPRoutes
        .findOne({ folioAlmacen })
        .then((data) => {
            res.status(200).json(data.movimientos.reverse())
        })
        .catch((error) => res.json({ message: error }));
});

// Borrar una materia prima
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await almacenMPRoutes
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Atención!, Materia prima eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar estado de la materia prima
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { descripcion, um, estado } = req.body;
    await almacenMPRoutes
        .updateOne({ _id: id }, { $set: { descripcion, um, estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la materia prima actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Registro de entrada y salida de almacen de materias primas
router.put("/registraMovimientos/:id", async (req, res) => {
    const { id } = req.params;
    const { fecha, movimientos, cantidadExistencia } = req.body;
    await almacenMPRoutes
        .updateOne({ _id: id }, { $set: { fecha, movimientos, cantidadExistencia } })
        .then((data) => res.status(200).json({ mensaje: "Se ha registrado un movimiento de materia prima", datos: data }))
        .catch((error) => res.json({ message: error }));
});

// Modifica existencias de materia prima
router.put("/modificaExistencias/:id", async (req, res) => {
    const { id } = req.params;
    const { nombreMP, um } = req.body;
    await almacenMPRoutes
        .updateOne({ _id: id }, { $set: { nombreMP, um } })
        .then((data) => res.status(200).json({ mensaje: "Existencias de materia prima actualizadas" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
