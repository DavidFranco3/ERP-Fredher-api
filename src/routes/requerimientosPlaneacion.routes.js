const express = require("express");
const router = express.Router();
const requerimientosPlaneacion = require("../models/requerimientosPlaneacion");
const { map } = require("lodash");

// Registro de las compras
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar acuses de recibo con el mismo folio
    const busqueda = await requerimientosPlaneacion.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe un requerimiento con este folio" });
    } else {
        const requerimiento = requerimientosPlaneacion(req.body);
        await requerimiento
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso del requerimiento", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
    //
});

// Obtener todos las compras
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await requerimientosPlaneacion
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los elementos de las compras
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await requerimientosPlaneacion
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await requerimientosPlaneacion
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una compras
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await requerimientosPlaneacion
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener los datos de una compra segun el folio
router.get("/obtenerDatosRequerimiento/:folio", async (req, res) => {
    const { folio } = req.params;

    await requerimientosPlaneacion
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerNoRequerimiento", async (req, res) => {
    const requerimiento = await requerimientosPlaneacion.find().count();
    if (requerimiento === 0) {
        res.status(200).json({ noRequerimiento: "REQ-1" })
    } else {
        const ultimoRequerimiento = await requerimientosPlaneacion.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimoRequerimiento.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noRequerimiento: "REQ-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroRequerimiento = await requerimientosPlaneacion.find().count();
    if (registroRequerimiento === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await requerimientosPlaneacion
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }

});

// Borrar una compra
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await requerimientosPlaneacion
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Requerimiento eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await requerimientosPlaneacion
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado del requerimiento actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de orden de compra
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { requerimiento, planeacion, bom, datosRequisicion } = req.body;
    await requerimientosPlaneacion
        .updateOne({ _id: id }, { $set: { requerimiento, planeacion, bom, datosRequisicion } })
        .then((data) => res.status(200).json({ mensaje: "Informacion del requerimiento actualizada", datos: data }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
