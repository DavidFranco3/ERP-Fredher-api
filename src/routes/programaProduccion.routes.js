const express = require("express");
const router = express.Router();
const programaProduccion = require("../models/programaProduccion");
const { map } = require("lodash");

// Registro de las compras
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar acuses de recibo con el mismo folio
    const busqueda = await programaProduccion.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe un programa de produccion con este folio" });
    } else {
        const programa = programaProduccion(req.body);
        await programa
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso del programa de produccion", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
    //
});

// Obtener todos las compras
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await programaProduccion
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

    await programaProduccion
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await programaProduccion
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
    await programaProduccion
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener los datos de una compra segun el folio
router.get("/obtenerDatosPrograma/:folio", async (req, res) => {
    const { folio } = req.params;

    await programaProduccion
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerNoPrograma", async (req, res) => {
    const programa = await programaProduccion.find().count();
    if (programa === 0) {
        res.status(200).json({ noPrograma: "PRP-1" })
    } else {
        const ultimoPrograma = await programaProduccion.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimoPrograma.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noPrograma: "PRP-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroPrograma = await programaProduccion.find().count();
    if (registroPrograma === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await programaProduccion
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
    await programaProduccion
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Programa de producción eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para cambiar el estado de la compra
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await programaProduccion
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado del programa de producción actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de orden de compra
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { folioOP, ordenProduccion, programa } = req.body;
    await programa
        .updateOne({ _id: id }, { $set: { folioOP, ordenProduccion, programa } })
        .then((data) => res.status(200).json({ mensaje: "Informacion del programa de producción actualizada", datos: data }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
