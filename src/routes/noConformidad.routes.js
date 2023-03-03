const express = require("express");
const router = express.Router();
const noConformidad = require("../models/noConformidad");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar pedidos de venta con el mismo folio
    const busqueda = await noConformidad.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una no conformidad con este folio" });
    } else {
        const fichas = noConformidad(req.body);
        await fichas
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado la no conformidad", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await noConformidad
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de venta
router.get("/obtenerNoEtiqueta", async (req, res) => {
    const registroNoConformidad = await noConformidad.find().count();
    if (registroNoConformidad === 0) {
        res.status(200).json({ noControl: "PNC-1" })
    } else {
        const ultimaConformidad = await noConformidad.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaConformidad.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noControl: "PNC-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar los pedidos de venta registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await noConformidad
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroAlertaCalidad = await noConformidad.find().count();
    if (registroAlertaCalidad === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await noConformidad
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
    await noConformidad
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await noConformidad
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un pedido de venta segun el folio
router.get("/obtenerDatosPedido/:folio", async (req, res) => {
    const { folio } = req.params;

    await noConformidad
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await noConformidad
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "No conformidad eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del pedido de venta
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await noConformidad
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Control de no conformidad cancelado correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { descripcionNoConformidad, correccion, analisisCausaRaiz, causaRaiz, diagrama, accionCorrectiva, fecha, status, responsables, fechaCierre, statusFinal, evidencia } = req.body;
    await noConformidad
        .updateOne({ _id: id }, { $set: { descripcionNoConformidad, correccion, analisisCausaRaiz, causaRaiz, diagrama, accionCorrectiva, fecha, status, responsables, fechaCierre, statusFinal, evidencia } })
        .then((data) => res.status(200).json({ mensaje: "Información de la no conformidad actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
