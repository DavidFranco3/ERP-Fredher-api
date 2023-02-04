const express = require("express");
const router = express.Router();
const etiquetaMoldes = require("../models/etiquetasMoldes");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar etiquetas de molde con el mismo folio
    const busqueda = await etiquetaMoldes.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una etiqueta con este folio" });
    } else {
        const etiquetas = etiquetaMoldes(req.body);
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

    await etiquetaMoldes
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de venta
router.get("/obtenerNoEtiqueta", async (req, res) => {
    const registroEtiqueta = await etiquetaMoldes.find().count();
    if (registroEtiqueta === 0) {
        res.status(200).json({ noEtiqueta: "EIMM-1" })
    } else {
        const ultimaEtiqueta = await etiquetaMoldes.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaEtiqueta.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noEtiqueta: "EIMM-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Listar los pedidos de venta registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await etiquetaMoldes
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroEtiqueta = await etiquetaMoldes.find().count();
    if (registroEtiqueta === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await etiquetaMoldes
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
    await etiquetaMoldes
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await etiquetaMoldes
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener un pedido de venta segun el folio
router.get("/obtenerDatosEtiqueta/:folio", async (req, res) => {
    const { folio } = req.params;

    await etiquetaMoldes
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await etiquetaMoldes
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Etiqueta de molde eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del pedido de venta
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await etiquetaMoldes
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Etiqueta de identificación de molde cancelada correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { idInterno, noInterno, cavidad, descripcion, cliente } = req.body;
    await etiquetaMoldes
        .updateOne({ _id: id }, { $set: { idInterno, noInterno, cavidad, descripcion, cliente } })
        .then((data) => res.status(200).json({ mensaje: "Información de la etiqueta de molde actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
