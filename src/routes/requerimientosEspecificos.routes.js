const express = require("express");
const router = express.Router();
const requerimientosEspecificos = require("../models/requerimientosEspecificos");

// Registro de requerimientos especificos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar un requerimiento especifico con el mismo folio
    const busqueda = await requerimientosEspecificos.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe un requerimiento con este folio" });
    } else {
        const requerimiento = requerimientosEspecificos(req.body);
        await requerimiento
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado un requerimiento", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los requerimientos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await requerimientosEspecificos
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el folio actual
router.get("/obtenerFolioActual", async (req, res) => {
    const registroRequerimientos = await requerimientosEspecificos.find().count();
    if (registroRequerimientos === 0) {
        res.status(200).json({ noRequerimiento: "1" })
    } else {
        const ultimoRequerimiento = await requerimientosEspecificos.findOne().sort({ _id: -1 });
        //console.log(ultimoRequerimiento)
        const tempFolio = parseInt(ultimoRequerimiento.folio) + 1
        res.status(200).json({ noRequerimiento: tempFolio.toString() })
    }
});

// Listar paginando los requerimientos registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await requerimientosEspecificos
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await requerimientosEspecificos
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una requerimiento en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await requerimientosEspecificos
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un requerimiento especifico segun el folio
router.get("/obtenerDatos/:folio", async (req, res) => {
    const { folio } = req.params;

    await requerimientosEspecificos
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un requerimiento especifico
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await requerimientosEspecificos
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Requerimiento especifico eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del requerimiento
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { folio, nombreProducto, cliente, nombreQuienElabora, especificacionesProducto, materiales, maquinaria, herramental, empaques, entregas } = req.body;
    await requerimientosEspecificos
        .updateOne({ _id: id }, { $set: { folio, nombreProducto, cliente, nombreQuienElabora, especificacionesProducto, materiales, maquinaria, herramental, empaques, entregas } })
        .then((data) => res.status(200).json({ mensaje: "Información del requerimiento actualizado" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
