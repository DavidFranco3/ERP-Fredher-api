const express = require("express");
const router = express.Router();
const pigmento = require("../models/pigmento");

// Para registrar pigmentos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)
    // Inicia validacion para no registrar productos con el mismo numero interno
    const busqueda = await pigmento.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe registros del pigmento" });
    } else {
        const pigmentoRegistrar = pigmento(req.body);
        await pigmentoRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado el pigmento" }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Para obtener el listado de pigmento
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await pigmento
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroAsignacion = await pigmento.find().count();
    if (registroAsignacion === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await pigmento
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }
});

// Para listar paginando los pigmentos
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await pigmento
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await pigmento
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener datos de un pigmento
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await pigmento
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener los datos del pigmento segun el folio
router.get("/obtenerPorFolio/:folio", async (req, res) => {
    const { folio } = req.params;
    //console.log("buscando")
    await pigmento
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener el folio actual de pigmento
router.get("/obtenerFolio", async (req, res) => {
    const registroAlmacenMP = await pigmento.find().count();
    if (registroAlmacenMP === 0) {
        res.status(200).json({ noPigmento: "PMB-1" })
    } else {
        const ultimaMP = await pigmento.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaMP.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noPigmento: "PMB-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Para eliminar pigmentos
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await pigmento
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Pigmento eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar los datos de los pigmentos
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, um } = req.body;
    await pigmento
        .updateOne({ _id: id }, { $set: { nombre, precio, um } })
        .then((data) => res.status(200).json({ mensaje: "Pigmento actualizado" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
