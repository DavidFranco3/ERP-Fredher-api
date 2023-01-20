const express = require("express");
const router = express.Router();
const alertasCalidad = require("../models/alertasCalidad");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar pedidos de venta con el mismo folio
    const busqueda = await alertasCalidad.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una alerta de calidad con este folio" });
    } else {
        const fichas = alertasCalidad(req.body);
        await fichas
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado la alerta de calidad", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await alertasCalidad
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de venta
router.get("/obtenerNoEtiqueta", async (req, res) => {
    const registroAlertaCalidad = await alertasCalidad.find().count();
    if (registroAlertaCalidad === 0) {
        res.status(200).json({ noAlerta: "ALC-1" })
    } else {
        const ultimaAlerta = await alertasCalidad.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaAlerta.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noFicha: "ALC-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar los pedidos de venta registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await alertasCalidad
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroAlertaCalidad = await alertasCalidad.find().count();
    if (registroAlertaCalidad === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await alertasCalidad
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
    await alertasCalidad
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await alertasCalidad
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un pedido de venta segun el folio
router.get("/obtenerDatosPedido/:folio", async (req, res) => {
    const { folio } = req.params;

    await alertasCalidad
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await alertasCalidad
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Alerta de calidad eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del pedido de venta
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await alertasCalidad
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la alerta de calidad actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { fecha, cliente, descripcionPieza, descripcionNoConformidad, cantidadPiezasCondicion, referencia, accionContencion, accionCorrectiva, autorizo, elaboro, observaciones, listaFirmas, referenciaNoConformidad, condicionIncorrecta, condicionCorrecta } = req.body;
    await alertasCalidad
        .updateOne({ _id: id }, { $set: { fecha, cliente, descripcionPieza, descripcionNoConformidad, cantidadPiezasCondicion, referencia, accionContencion, accionCorrectiva, autorizo, elaboro, observaciones, listaFirmas, referenciaNoConformidad, condicionIncorrecta, condicionCorrecta  } })
        .then((data) => res.status(200).json({ mensaje: "Información de la alerta de calidad actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
