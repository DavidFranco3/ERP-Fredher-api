const express = require("express");
const router = express.Router();
const etiquetasIdentificacionPT = require("../models/etiquetasIdentificacionPT");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar etiquetas con el mismo folio
    const busqueda = await etiquetasIdentificacionPT.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una etiqueta con este folio" });
    } else {
        const etiquetas = etiquetasIdentificacionPT(req.body);
        await etiquetas
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado la etiqueta", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await etiquetasIdentificacionPT
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener de etiqueta
router.get("/obtenerNoEtiquetaPT", async (req, res) => {
    const registroEtiqueta = await etiquetasIdentificacionPT.find().count();
    if (registroEtiqueta === 0) {
        res.status(200).json({ noEtiqueta: "EIPT-1" })
    } else {
        const ultimaEtiqueta = await etiquetasIdentificacionPT.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaEtiqueta.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noEtiqueta: "EIPT-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroEtiquetas = await etiquetasIdentificacionPT.find().count();
    if (registroEtiquetas === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await etiquetasIdentificacionPT
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }
});

// Listar las etiquetasa registradas
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await etiquetasIdentificacionPT
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un pedido en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await etiquetasIdentificacionPT
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await etiquetasIdentificacionPT
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener unA etiqueta segun el folio
router.get("/obtenerDatosEtiquetaPT/:folio", async (req, res) => {
    const { folio } = req.params;

    await etiquetasIdentificacionPT
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await etiquetasIdentificacionPT
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Pedido eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado de la etiqueta
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await etiquetasIdentificacionPT
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Etiqueta de identificación de PT cancelada correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { fecha, descripcion, noParte, noOrden, cantidad, turno, operador, supervisor, inspector } = req.body;
    await etiquetasIdentificacionPT
        .updateOne({ _id: id }, { $set: { fecha, descripcion, noParte, noOrden, cantidad, turno, operador, supervisor, inspector } })
        .then((data) => res.status(200).json({ mensaje: "Información de la etiqueta actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
