const express = require("express");
const router = express.Router();
const remisiones = require("../models/remisiones");

// Registro de remisiones
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar remisiones con el mismo folio
    const busqueda = await remisiones.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una remisión con este folio" });
    } else {
        const datosRemision = remisiones(req.body);
        await datosRemision
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado la remisión", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas la remisiones
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await remisiones
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de remision actual
router.get("/obtenerNoRemision", async (req, res) => {
    const registroRemisiones = await remisiones.find().count();
    if (registroRemisiones === 0) {
        res.status(200).json({ noRemision: "1" })
    } else {
        const ultimaRemision = await remisiones.findOne().sort({ _id: -1 });
        //console.log(ultimaRemision)
        const tempFolio = parseInt(ultimaRemision.folio) + 1
        res.status(200).json({ noRemision: tempFolio.toString() })
    }
});

// Listar las remisiones paginandolas
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await remisiones
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await remisiones
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una remisión en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await remisiones
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una remisión
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await remisiones
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Remisión eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la remisión
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { idOrdenVenta, idCliente, productos, subtotales, impuestos, descuentos, total } = req.body;
    await remisiones
        .updateOne({ _id: id }, { $set: { idOrdenVenta, idCliente, productos, subtotales, impuestos, descuentos, total } })
        .then((data) => res.status(200).json({ mensaje: "Información de la remisión actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
