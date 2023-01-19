const express = require("express");
const router = express.Router();
const almacenes = require("../models/almacenes");
const { map } = require("lodash");

// Registro inicial de MP en almacen
router.post("/registroInicial", async (req, res) => {
    const { folio } = req.body;

    // Inicia validacion para no registrar una materia prima con el mismo folio
    const busqueda = await almacenes.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe un registro en almacen con este folio" });
    } else {
        const pedidos = almacenes(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado registrado el articulo en el almacen", datos: data }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Registro inicial de MP en almacen
router.post("/registroGestion", async (req, res) => {
    const { folioMP } = req.body;

    // Inicia validacion para no registrar una materia prima con el mismo folio
    const busqueda = await almacenes.findOne({ folioMP });

    if (busqueda && busqueda.folioArticulo === folioArticulo) {
        return res.status(401).json({ mensaje: "Este articulo ya esta registrado" });
    } else {
        const pedidos = almacenes(req.body);
        await pedidos
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado registrado el articulo en el almacen", datos: data }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas las materias primas del almacen
router.get("/listar", async (req, res) => {
    const { sucursal, almacen } = req.query;

    await almacenes
        .find({ sucursal, almacen })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todas las materias primas del almacen
router.get("/listarGeneral", async (req, res) => {
    const { sucursal } = req.query;

    await almacenes
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el folio actual de las materis primas
router.get("/obtenerFolio", async (req, res) => {
    const registroAlmacenMP = await almacenes.find().count();
    if (registroAlmacenMP === 0) {
        res.status(200).json({ noAlmacen: "ALM-1" })
    } else {
        const ultimoAlmacen = await almacenes.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimoAlmacen.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noAlmacen: "ALM-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroAlmacenMP = await almacenes.find().count();
    if (registroAlmacenMP === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await almacenes
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

    await almacenes
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await almacenes
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
    await almacenes
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una materia prima segun el folio de la materia prima
router.get("/obtenerDatosFolio/:folio", async (req, res) => {
    const { folio } = req.params;

    await almacenes
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una materia prima segun el folio de la materia prima
router.get("/obtenerDatosArticulo/:idArticulo", async (req, res) => {
    const { idArticulo } = req.params;

    await almacenes
        .find({ idArticulo })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener el listado de movimientos de una materia prima
router.get("/listarMovimientosArticulos/:folio", async (req, res) => {
    const { folio } = req.params;

    await almacenes
        .findOne({ folio })
        .then((data) => {
            res.status(200).json(data.movimientos.reverse())
        })
        .catch((error) => res.json({ message: error }));
});

router.get("/listarMovimientos", async (req, res) => {
    const { sucursal, almacen } = req.query;
    
    await almacenes
        .find({ sucursal, almacen })
        .sort({ _id: -1 })
        .then((data) => {
            // res.json(data)
            let datosMovimientos = []

            map(data, (articulo, indexPrincipal) => {
                //console.log(data)
                map(articulo.movimientos, (movimientos, index) => {
                    const { fecha, articulo, sucursal, um, tipo, almacen, descripcion, lote, cantidadExistencia } = movimientos;
                    console.log(movimientos)
                    datosMovimientos.push({ fecha: fecha, articulo: articulo, sucursal: sucursal, um: um, tipo: tipo, almacen: almacen, descripcion: descripcion, lote, cantidadExistencia: cantidadExistencia })
                    console.log(datosMovimientos)
                })
            })
            res.status(200).json(datosMovimientos)
        })
        .catch((error) => res.json({ message: error }));
});

// Borrar una materia prima
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await almacenes
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Atención!, Articulo eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar estado de la materia prima
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await almacenes
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado del articulo actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Registro de entrada y salida de almacen de materias primas
router.put("/registraMovimientos/:id", async (req, res) => {
    const { id } = req.params;
    const { fecha, movimientos, cantidadExistencia } = req.body;
    await almacenes
        .updateOne({ _id: id }, { $set: { fecha, movimientos, cantidadExistencia } })
        .then((data) => res.status(200).json({ mensaje: "Se ha registrado un movimiento del articulo", datos: data }))
        .catch((error) => res.json({ message: error }));
});

// Modifica existencias de materia prima
router.put("/modificaExistencias/:id", async (req, res) => {
    const { id } = req.params;
    const { idArticulo, folioArticulo, nombreArticulo, tipo, fecha, descripcion, um, cantidadExistencia } = req.body;
    await almacenes
        .updateOne({ _id: id }, { $set: { idArticulo, folioArticulo, nombreArticulo, tipo, fecha, descripcion, um, cantidadExistencia } })
        .then((data) => res.status(200).json({ mensaje: "Articulo actualizado" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
