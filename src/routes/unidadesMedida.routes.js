const express = require("express");
const router = express.Router();
const unidadesMedida = require("../models/unidadesMedida");

// Registro de administradores
router.post("/registro", async (req, res) => {
    const { nombre, sucursal } = req.body;

    // Inicia validacion para no registrar UM con el mismo nombre
    const busqueda = await unidadesMedida.findOne({ nombre });

    if (busqueda && busqueda.nombre === nombre && busqueda.sucursal === sucursal) {
        return res.status(401).json({mensaje: "Ya existe una UM con este nombre"});
    } else  {
        const umRegistrar = unidadesMedida(req.body);
        await umRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Registro exitoso de la UM"
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos las UM
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;
    
    await unidadesMedida
        .find({ sucursal })
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando las um registradas
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await unidadesMedida
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await unidadesMedida
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una um en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await unidadesMedida
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una um
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await unidadesMedida
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "UM eliminada"}))
        .catch((error) => res.json({ message: error }));
});

// Deshabilitar la um
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estadoUM } = req.body;
    await unidadesMedida
        .updateOne({ _id: id }, { $set: { estadoUM } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la UM actualizado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la sucurusal
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    await unidadesMedida
        .updateOne({ _id: id }, { $set: { nombre } })
        .then((data) => res.status(200).json({ mensaje: "Datos actualizados"}))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
