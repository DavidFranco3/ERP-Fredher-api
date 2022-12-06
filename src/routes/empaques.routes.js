const express = require("express");
const router = express.Router();
const empaques = require("../models/empaques");

// Para registrar empaques
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)
    // Inicia validacion para no registrar productos con el mismo numero interno
    const busqueda = await empaques.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe registros del empaque" });
    } else {
        const empaquesRegistrar = empaques(req.body);
        await empaquesRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado el empaque" }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Para obtener el listado de empaques
router.get("/listar", async (req, res) => {
    await empaques
        .find()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroAsignacion = await empaques.find().count();
    if (registroAsignacion === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await empaques
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }
});

// Para listar paginando los empaques
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await empaques
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await empaques
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener datos de un empaque
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await empaques
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener los datos del empaque segun el folio
router.get("/obtenerPorFolio/:folio", async (req, res) => {
    const { folio } = req.params;
    //console.log("buscando")
    await empaques
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener el folio actual de empaque
router.get("/obtenerFolio", async (req, res) => {
    const registroAlmacenMP = await empaques.find().count();
    if (registroAlmacenMP === 0) {
        res.status(200).json({ noEmpaque: "EMP-1" })
    } else {
        const ultimaMP = await empaques.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaMP.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noEmpaque: "EMP-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Para eliminar empaques
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await empaques
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Empaque eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar los datos de los empaques
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, um } = req.body;
    await empaques
        .updateOne({ _id: id }, { $set: { nombre, precio, um } })
        .then((data) => res.status(200).json({ mensaje: "Empaque actualizado" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
