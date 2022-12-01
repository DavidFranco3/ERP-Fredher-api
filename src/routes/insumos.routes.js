const express = require("express");
const router = express.Router();
const insumo = require("../models/insumos");

// Para registrar insumos 
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)
    // Inicia validacion para no registrar productos con el mismo numero interno
    const busqueda = await insumo.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe registros del insumo" });
    } else {
        const insumoRegistrar = insumo(req.body);
        await insumoRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado el insumo" }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Para obtener el listado de insumos primas
router.get("/listar", async (req, res) => {
    await insumo
        .find()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroAsignacion = await insumo.find().count();
    if (registroAsignacion === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await insumo
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }
});

// Para listar paginando los insumos
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await insumo
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await insumo
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener datos de un insumo
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await insumo
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener los datos del insumo segun el folio
router.get("/obtenerPorFolio/:folio", async (req, res) => {
    const { folio } = req.params;
    //console.log("buscando")
    await insumo
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener el folio actual de insumo
router.get("/obtenerFolio", async (req, res) => {
    const registroInsumo = await insumo.find().count();
    if (registroInsumo === 0) {
        res.status(200).json({ noInsumo: "INS-1" })
    } else {
        const ultimoInsumo = await insumo.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimoInsumo.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noInsumo: "INS-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Para eliminar insumos
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await insumo
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Insumo eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar los datos de los insumos
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { descripcion, precio, proveedor } = req.body;
    await insumo
        .updateOne({ _id: id }, { $set: { descripcion, precio, proveedor } })
        .then((data) => res.status(200).json({ mensaje: "Insumo actualizado" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
