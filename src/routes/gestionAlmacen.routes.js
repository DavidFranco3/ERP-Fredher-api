const express = require("express");
const router = express.Router();
const gestionAlmacen = require("../models/gestionAlmacen");

// Registro de administradores
router.post("/registro", async (req, res) => {
    const { nombre, sucursal } = req.body;

    // Inicia validacion para no registrar almacenes con el mismo nombre
    const busqueda = await gestionAlmacen.findOne({ nombre });

    if (busqueda && busqueda.nombre === nombre && busqueda.sucursal === sucursal) {
        return res.status(401).json({ mensaje: "Ya existe un almacen con este nombre" });
    } else {
        const almacenRegistrar = gestionAlmacen(req.body);
        await almacenRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso del almacén"
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener toddas los almacenes
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await gestionAlmacen
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los almacenes registradas
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await gestionAlmacen
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await gestionAlmacen
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un almacen en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await gestionAlmacen
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un almacen
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await gestionAlmacen
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Almacen eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Deshabilitar un almacen
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await gestionAlmacen
        .updateOne({ _id: id }, { $set: { status } })
        .then((data) => res.status(200).json({ mensaje: "Estado del almacen actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del almacen
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    await gestionAlmacen
        .updateOne({ _id: id }, { $set: { nombre, descripcion } })
        .then((data) => res.status(200).json({ mensaje: "Datos actualizados" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
