const express = require("express");
const router = express.Router();
const existenciasAlmacen = require("../models/existenciasAlmacen");

// Registro de existencias en almacen
router.post("/registro", async (req, res) => {
    const { clave } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar existencias de almacen con la misma clave
    const busqueda = await existenciasAlmacen.findOne({ clave });

    if (busqueda && busqueda.clave === clave) {
        return res.status(401).json({ mensaje: "Ya existe una existencia en almacen con esta clave" });
    } else {
        const salida = existenciasAlmacen(req.body);
        await salida
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado una existencia en almacen", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas las existencias de almacen
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await existenciasAlmacen
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando las existencias de almacen
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await existenciasAlmacen
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await existenciasAlmacen
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una existencia de almacen en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await existenciasAlmacen
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una existencia de almacen segun la clave
router.get("/obtenerDatos/:clave", async (req, res) => {
    const { clave } = req.params;

    await existenciasAlmacen
        .findOne({ clave })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una existencia del almacen
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await existenciasAlmacen
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Existencia de almacen eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la existencia de almacen
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { movimientos } = req.body;
    await existenciasAlmacen
        .updateOne({ _id: id }, { $set: { movimientos } })
        .then((data) => res.status(200).json({ mensaje: "Información de existencias actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
