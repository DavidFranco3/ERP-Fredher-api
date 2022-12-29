const express = require("express");
const router = express.Router();
const primeraPieza = require("../models/etiquetaPrimeraPieza");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar pedidos de venta con el mismo folio
    const busqueda = await primeraPieza.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una pieza con este folio" });
    } else {
        const piezas = primeraPieza(req.body);
        await piezas
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado la pieza", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await primeraPieza
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de venta
router.get("/obtenerNoEtiqueta", async (req, res) => {
    const registroPrimeraPieza = await primeraPieza.find().count();
    if (registroPrimeraPieza === 0) {
        res.status(200).json({ noEtiqueta: "PPZ-1" })
    } else {
        const ultimaPieza = await primeraPieza.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaPieza.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noEtiqueta: "PPZ-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar los pedidos de venta registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await primeraPieza
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroPrimeraPieza = await primeraPieza.find().count();
    if (registroPrimeraPieza === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await primeraPieza
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
    await primeraPieza
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await primeraPieza
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un pedido de venta segun el folio
router.get("/obtenerDatosPedido/:folio", async (req, res) => {
    const { folio } = req.params;

    await primeraPieza
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await primeraPieza
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Primera pieza eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del pedido de venta
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await primeraPieza
        .updateOne({ _id: id }, { $set: { status } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la primera pieza actualizada" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { fecha, noMaquina, descripcion, cliente, peso, noCavidades, turno, inspector, supervisor } = req.body;
    await primeraPieza
        .updateOne({ _id: id }, { $set: { fecha, noMaquina, descripcion, cliente, peso, noCavidades, turno, inspector, supervisor } })
        .then((data) => res.status(200).json({ mensaje: "Información de la primera pieza actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
