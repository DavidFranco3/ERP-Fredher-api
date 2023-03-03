const express = require("express");
const router = express.Router();
const clasificacionMaquinaria = require("../models/clasificacionMaquinaria");

// Registro de administradores
router.post("/registro", async (req, res) => {
    const { nombre, sucursal } = req.body;

    // Inicia validacion para no registrar maquinarias con el mismo nombre
    const busqueda = await clasificacionMaquinaria.findOne({ nombre });

    if (busqueda && busqueda.nombre === nombre && busqueda.sucursal === sucursal) {
        return res.status(401).json({mensaje: "Ya existe una maquina con este nombre"});
    } else  {
        const maquinariaRegistrar = clasificacionMaquinaria(req.body);
        await maquinariaRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Registro exitoso de la maquina"
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los maquinaria
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;
    
    await clasificacionMaquinaria
        .find({ sucursal })
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los maquinaria registradas
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await clasificacionmaquinaria
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await clasificacionMaquinaria
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una maquinaria en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await clasificacionMaquinaria
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un maquinaria
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await clasificacionMaquinaria
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Maquinaria eliminada"}))
        .catch((error) => res.json({ message: error }));
});

// Deshabilitar el maquinaria
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await clasificacionMaquinaria
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la maquinaria actualizado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la sucurusal
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    await clasificacionMaquinaria
        .updateOne({ _id: id }, { $set: { nombre, descripcion } })
        .then((data) => res.status(200).json({ mensaje: "Datos actualizados"}))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
