const express = require("express");
const router = express.Router();
const fichasTecnicas = require("../models/fichasTecnicas");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar pedidos de venta con el mismo folio
    const busqueda = await fichasTecnicas.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una ficha tecnica con este folio" });
    } else {
        const fichas = fichasTecnicas(req.body);
        await fichas
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado la ficha tecnica", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await fichasTecnicas
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de venta
router.get("/obtenerNoEtiqueta", async (req, res) => {
    const registroFichaTecnica = await fichasTecnicas.find().count();
    if (registroFichaTecnica === 0) {
        res.status(200).json({ noFicha: "FCT-1" })
    } else {
        const ultimaFicha = await fichasTecnicas.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaFicha.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noFicha: "FCT-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar los pedidos de venta registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await fichasTecnicas
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroFichaTecnica = await fichasTecnicas.find().count();
    if (registroFichaTecnica === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await fichasTecnicas
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }
});

// Obtener un pedido en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await fichasTecnicas
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await fichasTecnicas
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un pedido de venta segun el folio
router.get("/obtenerDatosPedido/:folio", async (req, res) => {
    const { folio } = req.params;

    await fichasTecnicas
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await fichasTecnicas
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Ficha tecnica eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del pedido de venta
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await fichasTecnicas
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Ficha tecnica cancelada correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { descripcion, fechaElaboracion, realizo, autorizo, fichas } = req.body;
    await fichasTecnicas
        .updateOne({ _id: id }, { $set: { descripcion, fechaElaboracion, realizo, autorizo, fichas } })
        .then((data) => res.status(200).json({ mensaje: "Información de la ficha tecnica actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
