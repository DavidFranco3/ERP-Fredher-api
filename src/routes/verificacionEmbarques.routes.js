const express = require("express");
const router = express.Router();
const verificacionEmbarques = require("../models/verificacionEmbarques");

// Registro de verificacion de embarque
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar una verificación de embarque con el mismo folio
    const busqueda = await verificacionEmbarques.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una verificación de embarque con este folio" });
    } else {
        const verificacion = verificacionEmbarques(req.body);
        await verificacion
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado una verificación de embarque", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas las verificaciones de embarque
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await verificacionEmbarques
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el folio actual
router.get("/obtenerFolioActual", async (req, res) => {
    const registroVerificaciones = await verificacionEmbarques.find().count();
    if (registroVerificaciones === 0) {
        res.status(200).json({ noVerificacion: "1" })
    } else {
        const ultimaVerificacion = await verificacionEmbarques.findOne().sort({ _id: -1 });
        //console.log(ultimaVerificacion)
        const tempFolio = parseInt(ultimaVerificacion.folio) + 1
        res.status(200).json({ noVerificacion: tempFolio.toString() })
    }
});

// Listar paginando las verificaciones de embarque registradas
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await verificacionEmbarques
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await verificacionEmbarques
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una verificación de embarque en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await verificacionEmbarques
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una verificación de embarque segun el folio
router.get("/obtenerDatos/:folio", async (req, res) => {
    const { folio } = req.params;

    await verificacionEmbarques
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una verificación de embarque especifico
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await verificacionEmbarques
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Verificación de embarque eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la verificación de embarque
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { folio, cliente, remisionFactura, comentarios, encargadoEmbarque, vbCalidad, productos } = req.body;
    await verificacionEmbarques
        .updateOne({ _id: id }, { $set: { folio, cliente, remisionFactura, comentarios, encargadoEmbarque, vbCalidad, productos } })
        .then((data) => res.status(200).json({ mensaje: "Información de la verificación de embarque actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
