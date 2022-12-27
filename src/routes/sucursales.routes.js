const express = require("express");
const router = express.Router();
const sucursales = require("../models/sucursales");

// Registro de administradores
router.post("/registro", async (req, res) => {
    const { nombre } = req.body;

    // Inicia validacion para no registrar sucursales con el mismo nombre
    const busqueda = await sucursales.findOne({ nombre });

    if (busqueda && busqueda.nombre === nombre) {
        return res.status(401).json({mensaje: "Ya existe una sucursal con este nombre"});
    } else  {
        const sucursalRegistrar = sucursales(req.body);
        await sucursalRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Registro exitoso de la sucursal"
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos las sucursales
router.get("/listar", async (req, res) => {
    await sucursales
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando las sucursales registradas
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await sucursales
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await sucursales
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una sucursal en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await sucursales
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una sucursal
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await sucursales
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Sucursal eliminada"}))
        .catch((error) => res.json({ message: error }));
});

// Deshabilitar la sucursal
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estadoSucursal } = req.body;
    await sucursales
        .updateOne({ _id: id }, { $set: { estadoSucursal } })
        .then((data) => res.status(200).json({ mensaje: "Sucursal deshabilitado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la sucurusal
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion } = req.body;
    await sucursales
        .updateOne({ _id: id }, { $set: { nombre, direccion } })
        .then((data) => res.status(200).json({ mensaje: "Datos actualizados"}))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
