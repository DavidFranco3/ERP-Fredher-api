const express = require("express");
const router = express.Router();
const clasificacionMateriales = require("../models/clasificacionMateriales");

// Registro de administradores
router.post("/registro", async (req, res) => {
    const { nombre, sucursal } = req.body;

    // Inicia validacion para no registrar materiales con el mismo nombre
    const busqueda = await clasificacionMateriales.findOne({ nombre });

    if (busqueda && busqueda.nombre === nombre && busqueda.sucursal === sucursal) {
        return res.status(401).json({mensaje: "Ya existe un material con este nombre"});
    } else  {
        const materialRegistrar = clasificacionMateriales(req.body);
        await materialRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Registro exitoso del material"
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los materiales
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;
    
    await clasificacionMateriales
        .find({ sucursal })
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los materiales registradas
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await clasificacionMateriales
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await clasificacionMateriales
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un material en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await clasificacionMateriales
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un material
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await clasificacionMateriales
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Material eliminada"}))
        .catch((error) => res.json({ message: error }));
});

// Deshabilitar el material
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await clasificacionMateriales
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado del material actualizado"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la sucurusal
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    await clasificacionMateriales
        .updateOne({ _id: id }, { $set: { nombre, descripcion } })
        .then((data) => res.status(200).json({ mensaje: "Datos actualizados"}))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
