const express = require("express");
const router = express.Router();
const inspeccionMaterial = require("../models/inspeccionMaterial");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar inspeccion de material con el mismo folio
    const busqueda = await inspeccionMaterial.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una inspeccion de material con este folio" });
    } else {
        const inspecciones = inspeccionMaterial(req.body);
        await inspecciones
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado la inspeccion del material", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await inspeccionMaterial
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los pedidos
router.get("/listarActivos", async (req, res) => {
    const { sucursal } = req.query;

    await inspeccionMaterial
        .find({ sucursal, estado: "true" })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de la inspeccion de material
router.get("/obtenerNoInspeccion", async (req, res) => {
    const RegistroInspeccion = await inspeccionMaterial.find().count();
    if (RegistroInspeccion === 0) {
        res.status(200).json({ noInspeccion: "RM-1" })
    } else {
        const ultimaInspeccion = await inspeccionMaterial.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaInspeccion.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noInspeccion: "RM-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const RegistroInspeccion = await inspeccionMaterial.find().count();
    if (RegistroInspeccion === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await inspeccionMaterial
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }
});
// Listar las inspecciones de material registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await inspeccionMaterial
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
    await inspeccionMaterial
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await inspeccionMaterial
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una inspeccion segun el folio
router.get("/obtenerDatosInspeccion/:folio", async (req, res) => {
    const { folio } = req.params;

    await inspeccionMaterial
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await inspeccionMaterial
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Inspección de calidad del material eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado de la inspeccion
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await inspeccionMaterial
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Inspección de calidad del material cancelada correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { ordenVenta, fecha, nombre, lote, cantidad, propiedad, unidadMedida, tipoMaterial, nombreRecibio, estadoMateriaPrima, contaminacion, presentaHumedad, certificadoCalidad, empaqueDañado, resultadoFinalInspeccion, etiqueta, rechazo, nombreExterno, turno, auditor, supervisor, descripcionDefecto, cantidadNoConforme, tipoRechazo, correccion, condicion, observaciones } = req.body;
    await inspeccionMaterial
        .updateOne({ _id: id }, { $set: { ordenVenta, fecha, nombre, lote, cantidad, propiedad, unidadMedida, tipoMaterial, nombreRecibio, estadoMateriaPrima, contaminacion, presentaHumedad, certificadoCalidad, empaqueDañado, resultadoFinalInspeccion, etiqueta, rechazo, nombreExterno, turno, auditor, supervisor, descripcionDefecto, cantidadNoConforme, tipoRechazo, correccion, condicion, observaciones } })
        .then((data) => res.status(200).json({ mensaje: "Información de la inspeccion de calidad de material actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
